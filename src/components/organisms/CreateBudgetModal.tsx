import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Modal from "../atoms/Modal";
import { ModalProps } from "@/types";
import useCreateBudget from '@/hooks/useCreateBudget';
import useStore from '@/store';
import Select from "../atoms/Select";
import useFetchDepartments from "@/hooks/useFetchDepartments";
import useFetchCategories from "@/hooks/useFetchCategories";
import useFetchBranch from "@/hooks/useFetchBranch";
import CreateBranch from "./CreateBranch";
import CreateDepartment from "./CreateDepartment";
import CreateCategory from "./CreateCategory";
import { currencies } from "@/constants";

const CreateBudgetSchema = z.object({
  name: z.string().min(1, "Budget name is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  currency: z.string().optional(),
  branchId: z.string().min(1, "Branch ID is required"),
  departmentId: z.string().min(1, "Department ID is required"),
  categoryId: z.string().min(1, "Category ID is required"),
});

type CreateBudgetFormData = z.infer<typeof CreateBudgetSchema>;

const CreateBudgetModal: React.FC<ModalProps> = ({ showModal = false, setShowModal }) => {
  const { currentOrg } = useStore();
  const { createBudget, loading, errorMessage } = useCreateBudget();
  const { data: branchData, isLoading: branchLoading } = useFetchBranch(currentOrg);
  const { data: departmentData, isLoading: departmentLoading } = useFetchDepartments(currentOrg);
  const { data: categoryData, isLoading: categoryLoading, } = useFetchCategories(currentOrg);
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CreateBudgetFormData>({
    resolver: zodResolver(CreateBudgetSchema),
    mode: "onSubmit",
    defaultValues: { currency: 'NGN' },
  });

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const onSubmit = async (data: CreateBudgetFormData) => {
    try {
      await createBudget(data, currentOrg);
      setTimeout(()=> {
        setShowModal(false);
        reset();
      }, 1500)
    } catch (error) {
      console.error("Error creating budget:", error);
    }
  };

  const branches = branchData?.data.branches || [];
  const departments = departmentData?.data.departments || [];
  const categories = categoryData?.data.categories || [];

  return (
    <Modal onClose={toggleModal} isOpen={showModal}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <h2 className="text-xl font-bold mb-4">Create Budget</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              label="Budget Name"
              className="mt-1 w-full"
              placeholder="Input budget name"
              {...register("name")}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <Input
              type="number"
              label="Amount"
              className="mt-1 w-full"
              placeholder="Input amount"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>

          <div>
            <Select
              label="Currency"
              options={currencies}
              {...register("currency")}
              onChange={(selectBudget) => setValue("currency", selectBudget)}
              required
              value={watch("currency") || "NGN"}
              error={errors.currency?.message}
            />
          </div>

          <div>
            <Select
              label="Branch"
              options={branches}
              {...register("branchId")}
              onChange={(selectBranch) => setValue("branchId", selectBranch)}
              required
              value={watch("branchId")}
              error={errors.branchId?.message}
              loading={branchLoading}
              component={<CreateBranch add={true}/>}
            />
          </div>

          <div>
            <Select
              label="Department"
              options={departments}
              {...register("departmentId")}
              onChange={(selectDepartment) => setValue("departmentId", selectDepartment)}
              required
              value={watch("departmentId")}
              error={errors.departmentId?.message}
              loading={departmentLoading}
              component={<CreateDepartment add={true}/>}
            />
          </div>

          <div>
            <Select
              label="Category"
              options={categories}
              {...register("categoryId")}
              onChange={(selectCategory) => setValue("categoryId", selectCategory)}
              required
              value={watch("categoryId")}
              error={errors.categoryId?.message}
              loading={categoryLoading}
              component={<CreateCategory add={true}/>}

            />
          </div>
        </div>
        <Button type="submit" disabled={ loading} className="mt-4 px-4">
        <span className="text-white text-[12px]">{loading ? 'Creating...' : 'Create Budget'}</span>  
        </Button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </form>
    </Modal>
  );
};

export default CreateBudgetModal;