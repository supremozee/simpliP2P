"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import Modal from "../atoms/Modal";
import useCreateProduct from "@/hooks/useCreateProduct";
import useStore from "@/store";
import TextAreaField from "../atoms/TextArea";
import { FaImage, FaPlus } from "react-icons/fa";
import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/utils/cn";
import Select from "../atoms/Select";
import CreateCategory from "./CreateCategory";
import useFetchCategories from "@/hooks/useFetchCategories";
import useFileManager from "@/hooks/useFileManager";
import LoaderSpinner from "../atoms/LoaderSpinner";
import { currencies } from "@/constants";

// Currency data

const CreateProductSchema = z.object({
  name: z.string().min(1, "Product Name is required"),
  description: z.string().min(1, "Description is required"),
  unitPrice: z.string().min(1, "Unit price is required"),
  currency: z.string().min(1, "Currency is required"),
  stockQty: z.number().nonnegative("Stock quantity must be at least 0"),
  stockQtyAlert: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().min(1, "Image is required"),
});

type ProductFormData = z.infer<typeof CreateProductSchema>;

const CreateProduct = ({ add, custom }: { add?: boolean, custom?: boolean }) => {
  const { currentOrg } = useStore();
  const { createProduct, loading, errorMessage, successCreate } = useCreateProduct();
  const { data: categoryData, isLoading: categoryLoading } = useFetchCategories(currentOrg);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ProductFormData>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      currency: "USD",
      stockQtyAlert: 0,
      stockQty: 0,
    },
    mode: "onSubmit",
  });
  const imageRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { uploadFile, loading: imageLoading } = useFileManager();

  const handleFileUpload = async () => {
    try {
      const file = imageRef.current?.files?.[0];
      if (!file) {
        throw new Error("No file selected");
      }
      const response = await uploadFile(file);
      setImagePreview(response.url);
      setValue("image_url", response.url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const categories = categoryData?.data?.categories || [];
  const selectedCurrency = watch("currency");

  const onSubmit = async (data: ProductFormData) => {
    const formattedData = {
      ...data,
      unitPrice: Number(data.unitPrice),
      stockQty: Number(data.stockQty),
      stockQtyAlert: Number(data.stockQtyAlert || 0),
    };
    await createProduct(formattedData, currentOrg);
    setTimeout(()=> {
      reset();
      setIsOpen(false);
    }, 1500)
    
  };

  return (
    <>
      {add ? (
        <button
          title="Add New"
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-[18px] h-[18px] text-white rounded-full flex justify-center text-center items-center bg-primary"
        >
          <FaPlus size={10} />
        </button>
      ) : (
        <Button
          className={cn("px-10 text-white py-2 bg-primary rounded-md",
            custom && "w-full text-[#305D88] sm:py-7 rounded-[15px] flex gap-5 bg-white sm:justify-start justify-center items-center shadow-lg drop-shadow"
          )}
          onClick={() => setIsOpen(true)}
        >
          <span className={cn("text-[10px]", custom && "text-[16px]")}>Create New Inventory</span>
        </Button>
      )}
      <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
        <div className=" py-4 sm:px-10 h-auto max-h-[90vh]">
          <h2 className="text-xl font-bold mb-4">Add Inventory Product</h2>
          <p className="text-gray-500 mb-6">
            Fill in the product information below
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="sm:grid sm:grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                label="Product Name"
                placeholder="Input product name"
                {...register("name")}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="col-span-2">
              <TextAreaField
                label="Description"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Product description"
                rows={3}
                {...register("description")}
              ></TextAreaField>
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div>
              <Input
                type="text"
                label="Unit Price"
                placeholder="Input unit price"
                {...register("unitPrice")}
              />
              {errors.unitPrice && <p className="text-red-500 text-sm">{errors.unitPrice.message}</p>}
            </div>

            <div>
              <Select
                label="Currency"
                options={currencies}
                {...register("currency")}
                onChange={(selectCurrency)=> setValue("currency", selectCurrency)}
                value={selectedCurrency}
                error={errors.currency?.message}
                required
                placeholder="Select currency"
              />
              {errors.currency && <p className="text-red-500 text-sm">{errors.currency.message}</p>}
            </div>

            <div>
              <div className="flex flex-col">
                <Input
                  type="number"
                  label="Stock Quantity"
                  placeholder="Input stock quantity"
                  min={0}
                  {...register("stockQty", { valueAsNumber: true })}
                />
                <span className="text-xs text-gray-500 mt-1">
                  Current stock level in inventory
                </span>
              </div>
              {errors.stockQty && <p className="text-red-500 text-sm">{errors.stockQty.message}</p>}
            </div>

            <div>
              <div className="flex flex-col">
                <Input
                  type="number"
                  label="Stock Alert (Optional)"
                  placeholder="Stock alert threshold"
                  min={0}
                  {...register("stockQtyAlert", { valueAsNumber: true })}
                />
                <span className="text-xs text-gray-500 mt-1">
                  Minimum quantity before restock notification
                </span>
              </div>
              {errors.stockQtyAlert && <p className="text-red-500 text-sm">{errors.stockQtyAlert.message}</p>}
            </div>

            <div onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}>
              <Select
                label="Category"
                options={categories}
                {...register("category")}
                required
                error={errors.category?.message}
                onChange={(selectCategory) => setValue("category", selectCategory)}
                loading={categoryLoading}
                component={
                  <CreateCategory add={true} />
                }
              />
            </div>

            <div className="flex flex-col w-full col-span-2 mt-10">
              <label htmlFor="image_url" className="mb-4">Upload Item Image</label>
              {imageLoading ? <LoaderSpinner /> : (
                <label htmlFor="image_url" className={cn("flex flex-col items-center justify-center w-full border-2 cursor-pointer border-dashed border-gray-300 rounded-lg",
                  imagePreview ? "border-transparent h-48" : "border-gray-300 h-48"
                )}>
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Product Preview"
                      width={300}
                      height={300}
                      className="w-full h-full object-cover bg-center"
                    />
                  ) : (
                    <FaImage className="text-gray-400 text-6xl" />
                  )}
                  <input
                    id="image_url"
                    type="file"
                    className="hidden"
                    {...register("image_url")}
                    onChange={handleFileUpload}
                    ref={imageRef}
                  />
                </label>
              )}
              {errors?.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
            </div>

            <div className="flex justify-end my-6 space-x-4 col-span-1 sm:col-span-2">
              <Button
                className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300"
                onClick={() => {
                  reset();
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-5 py-[0.5px] flex justify-center items-center text-white rounded-lg"
              >
                <span className="text-[12px]">{loading ? "Creating..." : "Create Product"}</span>
              </Button>
            </div>
          </form>

          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          {successCreate && <p className="text-green-500 mt-4">Product created successfully</p>}
        </div>
      </Modal>
    </>
  );
};

export default CreateProduct;