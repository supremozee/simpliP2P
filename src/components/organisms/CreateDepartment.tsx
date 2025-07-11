"use client";

import { useState } from "react";
import Modal from "../atoms/Modal";
import Button from "../atoms/Button";
import useStore from "@/store";
import InputField from "../atoms/Input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreateDepartment from "@/hooks/useCreateDepartment";
import useFetchMembers from "@/hooks/useFetchMembers";
import { cn } from "@/utils/cn";
import { FaPlus } from "react-icons/fa";

const CreateDepartmentSchema = z.object({
  name: z.string().nonempty("Branch name is required"),
  department_code: z.string().optional(),
  description: z.string().optional(),
  hod_id: z.string().optional(),
});
type CreateDepartmentFormData = z.infer<typeof CreateDepartmentSchema>;
const CreateDepartment = ({ add }: { add?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateDepartmentFormData>({
    resolver: zodResolver(CreateDepartmentSchema),
  });
  const { currentOrg, loading } = useStore();
  const members = useFetchMembers(currentOrg);
  const hodId = members.data?.data;
  const { createDepartment } = useCreateDepartment();
  const onSubmit = async (data: CreateDepartmentFormData) => {
    // Convert empty string to undefined for hod_id
    const formattedData = {
      ...data,
      hod_id: data.hod_id === "" ? undefined : data.hod_id,
    };
    await createDepartment(formattedData, currentOrg);
    reset();
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
          className={cn("px-10 text-white py-2 bg-primary rounded-md ")}
          onClick={() => setIsOpen(true)}
        >
          <span className="text-[10px]">Add New</span>
        </Button>
      )}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
          <div className="mx-auto w-full bg-white p-6 rounded-2xl shadow-xl">
            <h1 className="text-[15px] font-bold mb-4">Add a New Department</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-1 "
            >
              <div>
                <InputField
                  required
                  type="text"
                  label="Department name"
                  {...register("name")}
                  placeholder="Input Department name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="cursor-pointer">
                <label
                  htmlFor="hod_id"
                  className="block text-sm font-medium #181819"
                >
                  Head of Department
                </label>
                <select
                  id="hod_id"
                  {...register("hod_id")}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm cursor-pointer"
                >
                  <option value="">Select Head of Department</option>
                  {hodId?.users.map((hod) => (
                    <option
                      key={hod.id}
                      className="cursor-pointer"
                      value={hod.id}
                    >
                      {hod.first_name + " " + hod.last_name}
                    </option>
                  ))}
                </select>
                {errors.hod_id && (
                  <p className="text-red-500 text-sm">
                    {errors.hod_id.message}
                  </p>
                )}
              </div>
              <div>
                <InputField
                  type="text"
                  label="Department Code"
                  {...register("department_code")}
                  placeholder="Input department code"
                />
                {errors.department_code && (
                  <p className="text-red-500 text-sm">
                    {errors.department_code.message}
                  </p>
                )}
              </div>

              <div>
                <InputField
                  type="text"
                  label="description"
                  {...register("description")}
                  placeholder="Input department description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <Button className="px-5 py-2 ">
                  <span className="text-white text-[10px]">
                    {" "}
                    {loading ? "Adding" : "Add Department"}
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateDepartment;
