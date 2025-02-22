"use client";

import { useState } from "react";
import Modal from "../atoms/Modal";
import Button from "../atoms/Button";
import useStore from "@/store";
import InputField from "../atoms/Input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateCategory from "@/hooks/useCreateCategory";
import { FaPlus } from "react-icons/fa";
import { cn } from "@/utils/cn";

const CreateCategorySchema = z.object({
    name: z.string().nonempty("Branch name is required"),
  });
  type CreateCategoryFormData = z.infer<typeof CreateCategorySchema>;
const CreateCategory = ({add}: {add?:boolean}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(CreateCategorySchema),
    mode: "onChange",
  });
  const { currentOrg, loading } = useStore();
  const { createCategory } = useCreateCategory();
    const onSubmit = async(data:CreateCategoryFormData)=> {
        await createCategory(data,currentOrg);
        reset()
        setIsOpen(false)
    };
  return (
    <>
     {
      add ? (
      <button 
      title="Add New"
      onClick={() => setIsOpen(true)}
      className="w-[18px] h-[18px] rounded-full flex justify-center items-center bg-primary text-white">
      <FaPlus size={10} />
        </button>)
        :
     ( <Button
      className={cn("px-10 text-white py-2 bg-primary rounded-md ",
            )}
      onClick={() => setIsOpen(true)}
    >
          <span className="text-[10px]">Add New</span>
    </Button>)}
      {isOpen && (
       <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
          <div className="mx-auto w-[400px] h-[200px] bg-white p-6 rounded-2xl shadow-xl">
            <h1 className="text-[15px] font-bold mb-4">Add a Category</h1>
              <form action="post"  onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-1 absolute">
                <div>
                    <InputField
                    required
                    type="text"
                    label="Category name"
                    {...register("name")}
                    placeholder="Input Category name"
                 />
                 {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div className="flex justify-end">
                    <Button className="px-5 py-2 ">
                       <span className="text-white text-[10px]">{loading ? "Adding" : "Add A Category"}</span>
                     </Button>
                </div>
              </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateCategory;