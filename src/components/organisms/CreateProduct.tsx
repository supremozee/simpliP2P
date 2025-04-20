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
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { cn } from "@/utils/cn";
import Select from "../atoms/Select";
import CreateCategory from "./CreateCategory";
import useFetchCategories from "@/hooks/useFetchCategories";
import { currencies } from "@/constants";
import { MdAdd } from "react-icons/md";
import FileUpload from "../atoms/FileUpload";

const CreateProductSchema = z.object({
  name: z.string().min(1, "Product Name is required"),
  description: z.string().min(1, "Description is required"),
  unitPrice: z.string().min(1, "Unit price is required"),
  currency: z.string().min(1, "Currency is required"),
  productCode: z.string().optional(),
  stockQty: z.number().nonnegative("Stock quantity must be at least 0"),
  stockQtyAlert: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().optional(),
  unitOfMeasure: z.string().optional(),
});

type ProductFormData = z.infer<typeof CreateProductSchema>;

const CreateProduct = ({ add, custom }: { add?: boolean, custom?: boolean }) => {
  const { currentOrg } = useStore();
  const { createProduct, loading, errorMessage, successCreate } = useCreateProduct();
  const { data: categoryData, isLoading: categoryLoading } = useFetchCategories(currentOrg);
  const [isOpen, setIsOpen] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ProductFormData>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      currency: "NGN",
      stockQtyAlert: 0,
      stockQty: 0,
    },
    mode: "onSubmit",
  });

  const categories = categoryData?.data?.categories || [];
  const category = watch("category");
  const selectedCurrency = watch("currency", "NGN");

  const handleFileUploaded = (url: string) => {
    setValue("image_url", url);
  };

  const onSubmit = async (data: ProductFormData) => {
    const formattedData = {
      ...data,
      unitPrice: Number(data.unitPrice),
      stockQty: Number(data.stockQty),
      stockQtyAlert: Number(data.stockQtyAlert || 0),
    };
    
    await createProduct(formattedData, currentOrg);
    setTimeout(() => {
      reset();
      setIsOpen(false);
    }, 1500);
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
          className={cn("px-10 text-white py-2 bg-primary rounded-md justify-center flex items-center",
            custom && "w-full text-[#305D88] sm:py-7 rounded-[15px] flex gap-5 bg-white sm:justify-start justify-center items-center shadow-lg drop-shadow"
          )}
          onClick={() => setIsOpen(true)}
        >
          {!custom && <MdAdd className="mr-2" size={28} />}
          <span className={cn("text-[14px] font-bold", custom && "text-[16px]")}>Create New Inventory</span>
        </Button>
      )}
      
      <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
        <div className="py-4 sm:px-10 h-auto max-h-[90vh]">
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
              <Input
                type="text"
                label="Product Code"
                placeholder="Product Code"
                {...register("productCode")}
              />
              {errors.productCode && <p className="text-red-500 text-sm">{errors.productCode.message}</p>}
            </div>
            <div>
              <Input
                type="text"
                label="Unit of measurement (UOM)"
                placeholder="Input unit of measurement"
                {...register("unitOfMeasure")}
              />
              {errors.unitOfMeasure && <p className="text-red-500 text-sm">{errors.unitOfMeasure.message}</p>}
            </div>
            <div>
              <Select
                label="Currency"
                options={currencies}
                {...register("currency")}
                onChange={(selectCurrency) => setValue("currency", selectCurrency)}
                value={selectedCurrency}
                error={errors.currency?.message}
                required
                placeholder="Select currency"
              />
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
                value={category}
                required
                error={errors.category?.message}
                onChange={(selectCategory) => setValue("category", selectCategory)}
                loading={categoryLoading}
                component={
                  <CreateCategory add={true} />
                }
              />
            </div>

            <div className="col-span-2 mt-6">
              <FileUpload
                label="Upload Item Image"
                onFileUploaded={handleFileUploaded}
                error={errors?.image_url?.message}
                id="image_url"
              />
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