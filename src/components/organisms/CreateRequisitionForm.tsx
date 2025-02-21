"use client";
import {FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import InputField from "../atoms/Input";
import TextAreaField from "../atoms/TextArea";
import "react-calendar/dist/Calendar.css";
import useStore from '@/store';
import useFetchDepartment from '@/hooks/useFetchDepartments';
import CreateDepartment from './CreateDepartment';
import Select from '../atoms/Select';
import useFetchBranch from '@/hooks/useFetchBranch';
import CreateBranch from './CreateBranch';
interface RequisitionFormType {
    department_id: string;
    contact_info: string;
    requestor_name: string;
    request_description: string;
    branch_id: string;
    quantity: number;
    estimated_cost: number;
    justification: string;
    needed_by_date: string;
    priority_level?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    budget_code?: string;
    delivery_location?: string;
    special_instructions?: string;
}
interface CreateRequisitionFormProps {
    register: UseFormRegister<RequisitionFormType>;
    errors:FieldErrors<RequisitionFormType>;
    prNumber: string;
    watch: UseFormWatch<RequisitionFormType>;
    setValue: UseFormSetValue<RequisitionFormType>
  }
 const today = new Date()
const CreateRequisitionForm:React.FC<CreateRequisitionFormProps> = ({register, errors, prNumber, watch, setValue}) => {
  const {currentOrg} = useStore()
  const {data:departmentData, isLoading:loadingData, isError:errorData} = useFetchDepartment(currentOrg);
  const {data:branchData, isLoading:branchLoading, isError:errorBranch} = useFetchBranch(currentOrg);
  const departments = departmentData?.data?.departments || []
  const branches = branchData?.data?.branches || []
  const departmentId = watch("department_id");
  const branchId = watch("branch_id");

  const priorityLevels = [
    { id: "LOW", name: "Low Priority" },
    { id: "MEDIUM", name: "Medium Priority" },
    { id: "HIGH", name: "High Priority" },
    { id: "URGENT", name: "Urgent" }
  ];

  return (
    <div className='flex flex-col w-full justify-center z-20 relative'>
        <div className='flex w-full justify-end'>
          <h1 className='text-[15px] text-primary font-bold'>PR Number: {prNumber}</h1>
      </div>
        <h1 className='font-bold text-[15px] text-primary'>Basic Information</h1>
        <section className="space-y-4 w-full mx-auto bg-white p-4 md:px-10 py-10 rounded-[6px] h-auto font-roboto border-[0.5px] border-[#808080] mt-2 border-opacity-45">
            <div className="flex flex-col gap-1">
            <h1 className="text-2xl leading-none font-[500]">Submit a Purchase Requisition</h1>
            <p className="text-sm text-[#888888] leading-none font-[400]">Provide detailed information to request approval for a purchase.</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between w-full gap-10">
            <div className="flex flex-col w-full">
            <h1 className="text-[#888888] text-[14px] font-bold">Requestor Information</h1>
            <div className="flex flex-col gap-4 w-full">
              <div className='relative'>
                  <Select
                    label="Department"
                    options={departments}
                    {...register("department_id")}
                    required
                    value={departmentId}
                    display="name"
                    error={errors.department_id?.message}
                    loading={loadingData}
                    isError={errorData}
                    onChange={(e)=> setValue("department_id", e.target.value)}
                    component={
                      <CreateDepartment add={true} />
                   }
                  />
              </div>

              <div className='relative'>
                <Select
                  label="Branch"
                  options={branches}
                  {...register("branch_id")}
                  display="name"
                  value={branchId}
                  required
                  error={errors.branch_id?.message}
                  loading={branchLoading}
                  isError={errorBranch}
                  onChange={(e)=> setValue("branch_id", e.target.value)}
                  component={<CreateBranch add={true} />}
                />
              </div>

              <div className='relative opacity-60'>
                <Select
                  label="Priority Level (Coming Soon)"
                  options={priorityLevels}
                  value=""
                  error={errors.priority_level?.message}
                  placeholder="This feature will be available soon"
                  disabled
                />
              </div>

              <div className="opacity-60">
                <InputField
                  label="Budget Code (Coming Soon)"
                  name="budget_code"
                  type="text"
                  placeholder="This feature will be available soon"
                  disabled
                />
              </div>

              <div className="opacity-60">
                <InputField
                  name="delivery_location"
                  label="Delivery Location (Coming Soon)"
                  type="text"
                  placeholder="This feature will be available soon"
                  disabled
                />
              </div>

                <InputField
                label="Contact Information"
                required
                type="email"
                placeholder="Contact phone/mail"
                {...register("contact_info")}
                />
                {errors.contact_info && <p className="text-red-500 text-xs">{errors.contact_info.message}</p>}

                <InputField
                label="Requestor Name"
                required
                type="text"
                placeholder="John Doe"
                {...register("requestor_name")}
                />
                {errors.requestor_name && <p className="text-red-500 text-xs">{errors.requestor_name.message}</p>}
                 
                <InputField
                label="Needed By Date"
                required
                min={today.toISOString().split('T')[0]}
                type="date"
                placeholder="yyyy-MM-dd"
                className="cursor-pointer"
                {...register("needed_by_date")}
                />
                {errors.needed_by_date && <p className="text-red-500 text-xs">{errors.needed_by_date.message}</p>}
            </div>
            </div>

            <div className="flex flex-col w-full">
            <h1 className="text-[#888888] text-[14px] font-bold">Goods or Services Details</h1>
            <div className="flex flex-col gap-4 w-full">
                <TextAreaField
                label="Description of Goods/Services"
                placeholder="Describe goods/service needed"
                className="h-40"
                {...register("request_description")}
                />
                {errors.request_description && <p className="text-red-500 text-xs">{errors.request_description.message}</p>}

                <TextAreaField
                label="Special Instructions (Coming Soon)"
                placeholder="This feature will be available soon"
                className="h-28 opacity-60"
                name="special_instructions"
                disabled
                />

                <InputField
                label="Quantity"
                required
                type="number"
                placeholder="Input quantity"
                {...register("quantity", { valueAsNumber: true })}
                />
                {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity.message}</p>}

                <InputField
                label="Estimated Cost"
                required
                type="number"
                placeholder="Estimated Cost"
                {...register("estimated_cost", { valueAsNumber: true })}
                />
                {errors.estimated_cost && <p className="text-red-500 text-xs">{errors.estimated_cost.message}</p>}

                <TextAreaField
                label="Justification"
                placeholder="Input justification for the purchase of goods/services"
                className="h-28"
                {...register("justification")}
                />
                {errors.justification && <p className="text-red-500 text-xs">{errors.justification.message}</p>}
            </div>
            </div>
            </div>

         </section>
    </div>
  )
}

export default CreateRequisitionForm