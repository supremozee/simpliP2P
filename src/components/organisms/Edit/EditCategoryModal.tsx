"use client";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import InputField from "@/components/atoms/Input";
import useStore from "@/store";
import useEditCategory from "@/hooks/useEditCategory";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, EditCategory } from "@/types";
import { HiOutlineTag } from "react-icons/hi2";

const EditCategorySchema = z.object({
  name: z.string().nonempty("Category name is required"),
});

type EditCategoryFormData = z.infer<typeof EditCategorySchema>;

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
}

const EditCategoryModal = ({ isOpen, onClose, category }: EditCategoryModalProps) => {
  const { currentOrg, loading } = useStore();
  const { editCategory } = useEditCategory();
  
  const { register, handleSubmit, formState: { errors } } = useForm<EditCategoryFormData>({
    resolver: zodResolver(EditCategorySchema),
    defaultValues: {
      name: category.name || "",
    }
  });
  
  const onSubmit = async (data: EditCategoryFormData) => {
    const updateData: EditCategory = {
      name: data.name
    };
    
    await editCategory(currentOrg, category.id as string, updateData);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mx-auto w-full bg-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <HiOutlineTag className="text-primary text-xl" />
          <h1 className="text-[18px] font-bold">Edit Category</h1>
        </div>
        
        {category.status && (
          <div className={`${
            category.status === "active" ? "bg-green-50" : "bg-amber-50"
          } p-3 rounded-lg mb-4 flex items-center gap-2`}>
            <span className={`text-sm ${
              category.status === "active" ? "text-green-700" : "text-amber-700"
            }`}>
              Current Status: {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
            </span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
          <div>
            <InputField
              required
              type="text"
              label="Category name"
              {...register("name")}
              placeholder="Input category name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div className="flex justify-end gap-3 mt-3">
            <Button 
              onClick={onClose}
              type="button"
              className="px-5 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              <span className="text-[12px]">Cancel</span>
            </Button>
            <Button type="submit" className="px-5 py-2">
              <span className="text-white text-[12px]">{loading ? `Updating...` : `Update Category`}</span>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditCategoryModal;