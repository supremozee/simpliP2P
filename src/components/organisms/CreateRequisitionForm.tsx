"use client";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import InputField from "../atoms/Input";
import TextAreaField from "../atoms/TextArea";
import "react-calendar/dist/Calendar.css";
import useStore from '@/store';
import useFetchDepartment from '@/hooks/useFetchDepartments';
import CreateDepartment from './CreateDepartment';
import Select from '../atoms/Select';
import useFetchBranch from '@/hooks/useFetchBranch';
import CreateBranch from './CreateBranch';
import { currencies } from "@/constants";
import useFetchSuppliers from "@/hooks/useFetchSuppliers";
import CreateSupplier from "./CreateSupplier";
import { useGetRequisitions } from "@/hooks/useGetRequisition";
import useFetchItemsByPrNumber from "@/hooks/useFetchAllItemsByPrNumber";
import { useEffect } from "react";
import LoaderSpinner from "../atoms/LoaderSpinner";

interface RequisitionFormType {
  department_id: string;
  contact_info: string;
  requestor_name: string;
  request_description: string;
  branch_id: string;
  supplier_id:string;
  quantity: number;
  estimated_cost: number;
  currency: string;
  justification: string;
  needed_by_date: string;
}

interface CreateRequisitionFormProps {
  register: UseFormRegister<RequisitionFormType>;
  errors: FieldErrors<RequisitionFormType>;
  prNumber: string;
  watch: UseFormWatch<RequisitionFormType>;
  setValue: UseFormSetValue<RequisitionFormType>;
}

const today = new Date();


const CreateRequisitionForm: React.FC<CreateRequisitionFormProps> = ({ register, errors, prNumber, watch, setValue }) => {
  const { currentOrg, pr } = useStore();
  const { data: departmentData, isLoading: loadingData,  } = useFetchDepartment(currentOrg);
  const { data: branchData, isLoading: branchLoading,  } = useFetchBranch(currentOrg);
  const suppliers = useFetchSuppliers(currentOrg);
  const departments = departmentData?.data?.departments || [];
  const branches = branchData?.data?.branches || [];
  const supplier = suppliers?.data?.data || []
  const departmentId = watch("department_id");
  const branchId = watch("branch_id");
  const selectedCurrency = watch("currency");
  const supplierId = watch("supplier_id");
  const {isDisabled} = useGetRequisitions()
  const { data, isLoading } = useFetchItemsByPrNumber(currentOrg, pr?.pr_number || "", 1000, 1);
  const itemsLength = data?.data?.data?.find((item => item.purchase_requisition.pr_number === pr?.pr_number))?.pr_quantity || 0;
  useEffect(()=> {
    if (itemsLength && itemsLength > 0) {
      setValue("quantity", itemsLength)
    }
  }, [itemsLength, setValue])
  
  return (
    <div className="flex flex-col w-full justify-center z-20 relative">
      <div className="flex w-full sm:justify-end">
        <h1 className="text-[15px] text-primary font-bold">PR Number: {prNumber}</h1>
      </div>
      <section className="space-y-4 w-full mx-auto bg-white p-4 md:px-10 py-10 rounded-[6px] h-auto font-roboto border-[0.5px] border-[#808080] mt-2 border-opacity-45">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl leading-none font-[500]">Submit a Purchase Requisition</h1>
          <p className="text-sm text-[#888888] leading-none font-[400]">Provide detailed information to request approval for a purchase.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between w-full gap-10">
          <div className="flex flex-col w-full">
            <h1 className="text-[#888888] text-[14px] font-bold">Requestor Information</h1>
            <div className="flex flex-col gap-4 w-full">
              <div className="relative">
                <Select
                  label="Department"
                  options={departments}
                  {...register("department_id")}
                  required
                  disabled={!!isDisabled}
                  value={departmentId}
                  defaultValue={departmentId}
                  error={errors.department_id?.message}
                  loading={loadingData}
                  onChange={(e) => setValue("department_id", e || "")}
                  component={
                    <CreateDepartment add={true} />
                  }
                />
              </div>

              <div className="relative">
                <Select
                  label="Branch"
                  options={branches}
                  disabled={!!isDisabled}
                  {...register("branch_id")}
                  value={branchId}
                  required
                  error={errors.branch_id?.message}
                  loading={branchLoading}
                  onChange={(selectedOption) => setValue("branch_id", selectedOption || "")}
                  component={<CreateBranch add={true} />}
                />
              </div>
              <div className="relative">
                <Select
                  label="Select a Supplier"
                  options={supplier}
                  {...register("supplier_id")}
                  disabled={!!isDisabled}
                  value={supplierId}
                  required
                  error={errors.supplier_id?.message}
                  loading={branchLoading}
                  onChange={(selectedOption) => setValue("supplier_id", selectedOption || "")}
                  component={<CreateSupplier add={true} />}
                />
              </div>
              <InputField
                label="Requisitor Contact"
                disabled={!!isDisabled}
                required
                type="email"
                placeholder="Contact email"
                {...register("contact_info")}
              />
              {errors.contact_info && <p className="text-red-500 text-xs">{errors.contact_info.message}</p>}

              <InputField
                label="Requestor Name"
                required
                disabled={!!isDisabled}
                type="text"
                placeholder="John Doe"
                {...register("requestor_name")}
              />
              {errors.requestor_name && <p className="text-red-500 text-xs">{errors.requestor_name.message}</p>}

              <InputField
                label="Needed By Date"
                required
                disabled={!!isDisabled}
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
              disabled={!!isDisabled}
                label="Description of Goods/Services"
                placeholder="Describe goods/service needed"
                className="h-40"
                {...register("request_description")}
              />
              {errors.request_description && <p className="text-red-500 text-xs">{errors.request_description.message}</p>}

              <InputField
                label="Quantity"
                disabled
                required
                type="number"
                placeholder="Input quantity"
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity.message}</p>}
              {isLoading && <LoaderSpinner className="absolute top-0 left-0 w-2 h-2 bg-white bg-opacity-50 z-10" />}
              <div className="flex gap-4 flex-col">
                <div className="flex-1">
                  <InputField
                  disabled={!!isDisabled}
                    label="Estimated Cost"
                    required
                    type="number"
                    placeholder="Estimated Cost"
                    {...register("estimated_cost", { valueAsNumber: true })}
                  />
                  {errors.estimated_cost && <p className="text-red-500 text-xs">{errors.estimated_cost.message}</p>}
                </div>

                <div className="w-full">
                  <Select
                    label="Currency"
                    disabled={!!isDisabled}
                    options={currencies}
                    {...register("currency")}
                    value={selectedCurrency || "NGN"}
                    error={errors.currency?.message}
                    required
                    placeholder="Select currency"
                    onChange={(selectedOption) => setValue("currency", selectedOption || "")}
                  />
                  {errors.currency && <p className="text-red-500 text-xs">{errors.currency.message}</p>}
                </div>
              </div>

              <TextAreaField
                label="Justification"
                disabled={!!isDisabled}
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
  );
}

export default CreateRequisitionForm;