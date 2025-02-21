import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from '../atoms/Input'; 
import Button from '../atoms/Button';
import Modal from "../atoms/Modal";
import { DeleteSupplierResponse, ModalProps } from "@/types";
import useStore from '@/store';
import useUpdateSupplier from "@/hooks/useUpdateSupplier";
import useFetchSupplierById from "@/hooks/useFetchSupplierById";
import { useEffect, useState } from "react";
import useNotify from "@/hooks/useNotify";
import useDeleteSupplier from "@/hooks/useDeleteSupplier";
import Select from "../atoms/Select";
import CreateCategory from "./CreateCategory";
import useFetchCategories from "@/hooks/useFetchCategories";
import LoaderSpinner from "../atoms/LoaderSpinner";

const UpdateSupplierSchema = z.object({
  full_name: z.string().min(1, "Full Name is required"),
  phone: z.string().min(10, "Phone is required").regex(/^[0-9]+$/, "Phone number must contain only numbers"),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  category: z.string().min(1, "Category is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
});

type UpdateSupplierFormData = z.infer<typeof UpdateSupplierSchema>;

interface UpdateSupplierProps extends ModalProps {
  supplierId?: string;
}

const UpdateSupplier: React.FC<UpdateSupplierProps> = ({ showModal, setShowModal }) => {
  const { currentOrg, supplierId } = useStore();
  const {success} = useNotify();
  const [selectedCategory, setSelectedCategory] = useState("");
  const updateSupplierMutation = useUpdateSupplier(currentOrg);
  const deleteSupplierMutation = useDeleteSupplier(currentOrg);
  const { isPending, isError } = updateSupplierMutation;
  const { data: supplierData, isLoading: isSupplierLoading } = useFetchSupplierById(currentOrg, supplierId);
  const { data: categoryData, isLoading: categoryLoading, isError: errorCategory } = useFetchCategories(currentOrg);

  const { register, handleSubmit, formState: { errors }, reset, setValue, control, watch } = useForm<UpdateSupplierFormData>({
    resolver: zodResolver(UpdateSupplierSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      category: "",
      rating: 0
    }
  });

  const categories = categoryData?.data?.categories || [];
  const ratings = useWatch({ control, name: 'rating' });

  useEffect(() => {
    if (supplierData?.data) {
      const data = supplierData.data;
      setValue("full_name", data.full_name ?? "");
      setValue("email", data.email ?? "");
      setValue("phone", data.phone ?? "");
      setValue("address", data.address ?? "");
      setValue("category", data.category?.id ?? "");
      setSelectedCategory(data.category?.name ?? "");
      
      const ratingValue = data.rating ? Number(data.rating) : 0;
      setValue("rating", ratingValue);
    }
  }, [supplierData, setValue]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleDeleteSupplier = async () => {
    if (supplierId) {
      const response: DeleteSupplierResponse = await deleteSupplierMutation.mutateAsync({ supplierId });
      if (response.status === "success") {
        success(response?.message);
      }
      toggleModal();
    }
  };

  const onSubmit = async (data: UpdateSupplierFormData) => {
    try {
      if (supplierId) {
        const response = await updateSupplierMutation.mutateAsync({ supplierId, data });
        if (response.status === "success") {
          success(response?.message);
        }
      } else {
        alert("Supplier ID not defined");
      }
      reset();
      toggleModal();
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  return (
    <Modal onClose={toggleModal} isOpen={showModal}>
      <div className="px-4 py-6 sm:px-10">
        <h2 className="text-xl font-bold mb-4">Update Supplier</h2>
        <p className="text-gray-500 mb-6">
          Update the supplier&apos;s information below
        </p>

        {isSupplierLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <LoaderSpinner size="md" text="Loading supplier data..." />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                label="Full Name"
                className="mt-1 w-full"
                placeholder="Input full name"
                {...register("full_name")}
              />
              {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}
            </div>

            <div>
              <Input
                type="email"
                label="Email"
                className="mt-1 w-full"
                placeholder="Input email address"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <Input
                type="text"
                label="Phone Number"
                className="mt-1 w-full"
                placeholder="Input phone number"
                {...register("phone")}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            <div>
              <Input
                type="text"
                label="Address"
                className="mt-1 w-full"
                placeholder="Input address"
                {...register("address")}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
            <div className="relative">
              <Select
                label="Category"
                options={categories}
                {...register("category")}
                onChange={(e) => {
                  setValue("category", e.target.value);
                  const selectedCat = categories.find(cat => cat.id === e.target.value);
                  if (selectedCat) {
                    setSelectedCategory(selectedCat.name);
                  }
                }}
                value={watch("category")}
                defaultValue={selectedCategory}
                error={errors.category?.message}
                loading={categoryLoading}
                isError={errorCategory}
                required
                placeholder="Select a category"
                component={<CreateCategory add={true} />}
              />
            </div>

            <div className="mt-5 sm:mt-0">
              <label className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-2xl ${Number(ratings) >= star ? "text-yellow-400" : "text-gray-300"}`}
                    onClick={() => setValue("rating", star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
            </div>

            <div className="flex justify-end mt-6 space-x-4 col-span-1 sm:col-span-2">
              <Button
                className="px-5 py-2 bg-red-500 text-white rounded-lg flex justify-center items-center"
                onClick={() => {
                  reset();
                  handleDeleteSupplier();
                  setShowModal(false);
                }}
              >
                <span className="text-[13px]">Delete Supplier</span>
              </Button>
              <Button
                type="submit"
                className="px-5 py-2 text-white rounded-lg flex justify-center items-center"
                disabled={isPending}
              >
                <span className="text-[13px]">{isPending ? "Updating..." : "Update Supplier"}</span>
              </Button>
            </div>
          </form>
        )}
        {isError && <p className="text-red-500 mt-4">Error updating supplier</p>}
      </div>
    </Modal>
  );
};

export default UpdateSupplier;