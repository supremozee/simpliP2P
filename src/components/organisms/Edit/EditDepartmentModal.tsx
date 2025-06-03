"use client";

import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import InputField from "@/components/atoms/Input";
import useStore from "@/store";
import useEditDepartment from "@/hooks/useEditDepartment";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Department, EditDepartment } from "@/types";

const EditDepartmentSchema = z.object({
  name: z.string().nonempty("Department name is required"),
  department_code: z.string().nonempty("Department code is required"),
});

type EditDepartmentFormData = z.infer<typeof EditDepartmentSchema>;

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department;
}

const EditDepartmentModal = ({ isOpen, onClose, department }: EditDepartmentModalProps) => {
  const { currentOrg, loading } = useStore();
  const { editDepartment } = useEditDepartment();
  
  const { register, handleSubmit, formState: { errors } } = useForm<EditDepartmentFormData>({
    resolver: zodResolver(EditDepartmentSchema),
    defaultValues: {
      name: department.name || "",
    //   department_code: department.department_code || ""
    }
  });
  
  const onSubmit = async (data: EditDepartmentFormData) => {
    const updateData: EditDepartment = {
      name: data.name,
    //   department_code: data.department_code,
    };
    
    await editDepartment(currentOrg, department.id as string, updateData);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mx-auto w-full bg-white p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-[18px] font-bold">Edit Department</h1>
        </div>
        
        {department.head_of_department && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-center gap-2">
            <span className="text-sm text-blue-700">
              Current Head of Department: {department.head_of_department.first_name} {department.head_of_department.last_name}
            </span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
          <div>
            <InputField
              required
              type="text"
              label="Department Name"
              {...register("name")}
              placeholder="Input department name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          
          {/* <div>
            <InputField
              required
              type="text"
              label="Department Code"
              {...register("department_code")}
              placeholder="Input department code"
            />
            {errors.department_code && <p className="text-red-500 text-sm mt-1">{errors.department_code.message}</p>}
          </div> */}
          <div className="flex justify-end gap-3 mt-3">
            <Button 
              onClick={onClose}
              type="button"
              className="px-5 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              <span className="text-[12px]">Cancel</span>
            </Button>
            <Button type="submit" className="px-5 py-2">
              <span className="text-white text-[12px]">{loading ? `Updating...` : `Update Department`}</span>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditDepartmentModal;