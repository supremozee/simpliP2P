"use client";

import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import InputField from "@/components/atoms/Input";
import useStore from "@/store";
import useEditBranch from "@/hooks/useEditBranch";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Branch, EditBranch } from "@/types";

const EditBranchSchema = z.object({
  name: z.string().nonempty("Branch name is required"),
  address: z.string().nonempty("Address is required"),
});

type EditBranchFormData = z.infer<typeof EditBranchSchema>;

interface EditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch;
}

const EditBranchModal = ({ isOpen, onClose, branch }: EditBranchModalProps) => {
  const { currentOrg, loading } = useStore();
  const { editBranch } = useEditBranch();
  
  const { register, handleSubmit, formState: { errors } } = useForm<EditBranchFormData>({
    resolver: zodResolver(EditBranchSchema),
    defaultValues: {
      name: branch.name || "",
      address: branch.address || "",
    }
  });
  
  const onSubmit = async (data: EditBranchFormData) => {
    const updateData: EditBranch = {
      name: data.name,
      address: data.address
    };
    
    await editBranch(currentOrg, branch.id as string, updateData);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mx-auto w-full bg-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-[18px] font-bold">Edit Branch</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
          <div>
            <InputField
              required
              type="text"
              label="Branch name"
              {...register("name")}
              placeholder="Input branch name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <InputField
              required
              type="text"
              label="Address"
              {...register("address")}
              placeholder="Input branch address"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
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
              <span className="text-white text-[12px]">{loading ? `Updating...` : `Update Branch`}</span>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditBranchModal;