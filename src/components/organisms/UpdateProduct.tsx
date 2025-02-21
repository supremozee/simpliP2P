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

const UpdateProductSchema = z.object({
  name: z.string().min(1, "Name of the product is required"),
  description: z.string().min(1, "Description of the product is required"),
  unitPrice: z.preprocess((val) => parseFloat(val as string), z.number().positive().finite()),
  stockQtyAlert: z.preprocess((val) => parseInt(val as string, 10), z.number().optional()),
  category: z.string().min(1, "Category is required"),
  stockQty: z.preprocess((val) => parseInt(val as string, 10), z.number().optional()),
});

type UpdateProductFormData = z.infer<typeof UpdateProductSchema>;

interface UpdateProductProps extends ModalProps {
  productId: string;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ showModal, setShowModal, productId }) => {
  const { currentOrg } = useStore();
  const { updateProduct } = useUpdateProduct();
  const { data, isLoading, isError } = useFetchProductById(currentOrg, productId);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<UpdateProductFormData>({
    resolver: zodResolver(UpdateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      unitPrice: 0.00,
      stockQtyAlert: 0,
      category: "",
      stockQty: 0,
    },
  });

  useEffect(() => {
    if (data?.data) {
      setValue("name", data.data.name);
      setValue("description", data.data.description);
      setValue("unitPrice", data.data.unitPrice);
      setValue("stockQtyAlert", data.data.stockQtyAlert);
      setValue("category", data.data.category);
      setValue("stockQty", data.data.stockQty);
    }
  }, [data, setValue]);

  const onSubmit = async (data: ProductData) => {
    await updateProduct(currentOrg, productId, data);
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

            <div>
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
              <Input
                type="number"
                label="Stock Quantity"
                className="mt-1 w-full"
                placeholder="Enter stock quantity"
                {...register("stockQty")}
              />
              {errors.stockQty && <p className="text-red-500 text-sm">{errors.stockQty.message}</p>}
            </div>

            <div>
              <Input
                type="number"
                label="Stock Quantity Alert"
                className="mt-1 w-full"
                placeholder="Enter stock alert quantity"
                {...register("stockQtyAlert")}
              />
              {errors.stockQtyAlert && <p className="text-red-500 text-sm">{errors.stockQtyAlert.message}</p>}
            </div> 

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                {...register("category")}
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="Building">Building</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Technology">Technology</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            <div className="flex justify-end mt-6 space-x-4 col-span-1 sm:col-span-2">
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
