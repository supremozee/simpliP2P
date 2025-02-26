/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from '../atoms/Input'; 
import Button from '../atoms/Button';
import Modal from "../atoms/Modal";
import { ModalProps, ProductData } from "@/types";
import useStore from '@/store';
import { useEffect } from "react";
import useUpdateProduct from "@/hooks/useUpdateProduct";
import useFetchProductById from "@/hooks/useFetchProductById";
import Select from "../atoms/Select";
import useFetchCategories from "@/hooks/useFetchCategories";
import CreateCategory from "./CreateCategory";

const currencies:any = [
  { id: "NGN", name: "NGN - Nigerian Naira" },
  { id: "USD", name: "USD - US Dollar" },
  { id: "EUR", name: "EUR - Euro" },
  { id: "GBP", name: "GBP - British Pound" },
  { id: "JPY", name: "JPY - Japanese Yen" },
  { id: "GHS", name: "GHS - Ghanaian Cedi" },
  { id: "KES", name: "KES - Kenyan Shilling" },
  { id: "ZAR", name: "ZAR - South African Rand" }
] as const;

const UpdateProductSchema = z.object({
  name: z.string().min(1, "Name of the product is required"),
  description: z.string().min(1, "Description of the product is required"),
  unitPrice: z.number().min(1, "Unit price is required"),
  currency: z.string().min(1, "Currency is required"),
  stockQtyAlert: z.number().min(0, "Stock alert must be 0 or greater"),
  category: z.string().min(1, "Category is required"),
  stockQty: z.number().min(0, "Stock quantity must be 0 or greater"),
});

type UpdateProductFormData = z.infer<typeof UpdateProductSchema>;

interface UpdateProductProps extends ModalProps {
  productId: string;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ showModal, setShowModal, productId }) => {
  const { currentOrg } = useStore();
  const { updateProduct } = useUpdateProduct();
  const { data, isLoading, isError } = useFetchProductById(currentOrg, productId);
  const { data: categoryData, isLoading: categoryLoading, isError: errorCategory } = useFetchCategories(currentOrg);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<UpdateProductFormData>({
    resolver: zodResolver(UpdateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      unitPrice: 0,
      currency: "USD",
      stockQtyAlert: 0,
      category: "",
      stockQty: 0,
    },
  });

  const categories = categoryData?.data?.categories || [];
  const selectedCategory = watch("category");

  useEffect(() => {
    if (data?.data) {
      setValue("name", data.data.name);
      setValue("description", data.data.description);
      setValue("unitPrice", data.data.unitPrice);
      setValue("stockQtyAlert", data.data.stockQtyAlert);
      setValue("category", data.data.category?.id || "");
      setValue("stockQty", data.data.stockQty);
    }
  }, [data, setValue]);

  const onSubmit = async (formData: UpdateProductFormData) => {
    const productData: ProductData = {
      ...formData,
      stockQty: Number(formData.stockQty),
      stockQtyAlert: Number(formData.stockQtyAlert),
    };
    await updateProduct(currentOrg, productId, productData);
    setShowModal(false);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Modal onClose={toggleModal} isOpen={showModal}>
      <div className="px-4 py-6 sm:px-10">
        <h2 className="text-xl font-bold mb-4">Update Product</h2>
        <p className="text-gray-500 mb-6">Update the product&apos;s information below</p>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                label="Product Name"
                className="mt-1 w-full"
                placeholder="Enter product name"
                {...register("name")}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <Input
                type="text"
                label="Description"
                className="mt-1 w-full"
                placeholder="Enter product description"
                {...register("description")}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div>
              <Input
                type="text"
                label="Unit Price"
                className="mt-1 w-full"
                placeholder="Enter unit price"
                {...register("unitPrice")}
              />
              {errors.unitPrice && <p className="text-red-500 text-sm">{errors.unitPrice.message}</p>}
            </div>

            <div>
              <Select
                label="Currency"
                options={currencies}
                {...register("currency")}
                value={watch("currency")}
                error={errors.currency?.message}
                required
                display="name"
                placeholder="Select currency"
              />
            </div>

            <div>
              <div className="flex flex-col">
                <Input
                  type="number"
                  label="Stock Quantity"
                  className="mt-1 w-full"
                  min={0}
                  placeholder="Enter stock quantity"
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
                  label="Stock Alert Level"
                  className="mt-1 w-full"
                  min={0}
                  placeholder="Enter alert threshold"
                  {...register("stockQtyAlert", { valueAsNumber: true })}
                />
                <span className="text-xs text-gray-500 mt-1">
                  Minimum quantity before restock notification
                </span>
              </div>
              {errors.stockQtyAlert && <p className="text-red-500 text-sm">{errors.stockQtyAlert.message}</p>}
            </div>

            <div className="relative">
              <Select
                label="Category"
                options={categories}
                {...register("category")}
                onChange={(e) => setValue("category", e.target.value)}
                value={selectedCategory}
                error={errors.category?.message}
                loading={categoryLoading}
                isError={errorCategory}
                required
                display="name"
                placeholder="Select a category"
                component={<CreateCategory add={true} />}
              />
            </div>

            <div className="flex justify-end mt-6 space-x-4 col-span-1 sm:col-span-2">
              <Button
                type="button"
                className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300"
                onClick={toggleModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-5 py-2 text-white rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        )}
        {isError && <p className="text-red-500 mt-4">Error updating product</p>}
      </div>
    </Modal>
  );
};

export default UpdateProduct;
