"use client";

import { useState } from "react";
import Modal from "../atoms/Modal";
import Button from "../atoms/Button";
import useStore from "@/store";
import InputField from "../atoms/Input";
import useCreateBranch from "@/hooks/useCreateBranch";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/utils/cn";
import { FaPlus } from "react-icons/fa";


const CreateBranchSchem = z.object({
    name: z.string().nonempty("Branch name is required"),
    address: z.string().nonempty("Address is required"),
  });
  type CreateBranchFormData = z.infer<typeof CreateBranchSchem>;
const CreateBranch = ({add}: {add?:boolean}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateBranchFormData>({
    resolver: zodResolver(CreateBranchSchem),
  });
  const { currentOrg, loading } = useStore();
  const { createBranch } = useCreateBranch();
    const onSubmit = async(data:CreateBranchFormData)=> {
        await createBranch(data,currentOrg);
        reset()
    };
  return (
    <>
    {
      add ? (
      <button 
      title="Add New"
      type="button"
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
          <div className="mx-auto w-full bg-white p-6 rounded-2xl shadow-xl">
            <h1 className="text-[15px] font-bold mb-4">Add a New Branch</h1>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-1 ">
                <div>
                    <InputField
                    required
                    type="text"
                    label="Branch name"
                    {...register("name")}
                    placeholder="Input branch name"
                 />
                 {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div>
                    <InputField
                    required
                    type="text"
                    label="Address"
                    {...register("address")}
                    placeholder="Input branch address"
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                </div>
                <div className="flex justify-end">
                    <Button className="px-5 py-2 ">
                       <span className="text-white text-[10px]"> {loading ?  `wait...` : `Add Branch`}</span>
                     </Button>
                </div>
              </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateBranch;