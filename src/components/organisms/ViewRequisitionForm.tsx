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
import { useEffect, useState } from "react";
import LoaderSpinner from "../atoms/LoaderSpinner";

interface RequisitionFormType {
  department_id: string;
  requestor_phone: string;
  requestor_name: string;
  requestor_email: string;
  request_description: string;
  branch_id: string;
  supplier_id:string;
  currency: string;
  justification: string;
  needed_by_date: string;
}

interface ViewRequisitionFormProps {
  register: UseFormRegister<RequisitionFormType>;
  errors: FieldErrors<RequisitionFormType>;
  prNumber: string;
  watch: UseFormWatch<RequisitionFormType>;
  setValue: UseFormSetValue<RequisitionFormType>;
}

const today = new Date();


const ViewRequisitionForm: React.FC<ViewRequisitionFormProps> = ({ register, errors, prNumber, watch, setValue }) => {
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
  const {isDisabled, showForSavedOnly} = useGetRequisitions()
  const hideQtyAndEstCost = showForSavedOnly?.status === "INITIALIZED" || showForSavedOnly?.status === "SAVED_FOR_LATER"
   const [quantity, setQuantity] = useState(0);
    const [estimatedCost, setEstimatedCost] = useState(0);
  const { data, isLoading } = useFetchItemsByPrNumber(currentOrg, pr?.pr_number || "", 1000, 1);
  const totalQuantity = data?.data?.data?.reduce((acc, item) => acc + item.pr_quantity, 0) || 0;
  const totalEstimatedCost = data?.data?.data?.reduce((acc, item) => acc + (item.pr_quantity * item.unit_price), 0) || 0;
  useEffect(()=> {
    if (totalQuantity && totalEstimatedCost) {
      setQuantity(totalQuantity)
      setEstimatedCost(totalEstimatedCost)
    }
  }, [totalQuantity, totalEstimatedCost])
  
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
                label="Requestor Phone"
                disabled={!!isDisabled}
                required
                type="text"
                placeholder="Requestor Phone"
                {...register("requestor_phone")}
              />
              {errors.requestor_phone && <p className="text-red-500 text-xs">{errors.requestor_phone.message}</p>}
              <InputField
                label="Requestor Email"
                disabled={!!isDisabled}
                required
                type="email"
                placeholder="Contact email"
                {...register("requestor_email")}
              />
              {errors.requestor_email && <p className="text-red-500 text-xs">{errors.requestor_email.message}</p>}
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
             {!hideQtyAndEstCost && <InputField
                label="Quantity"
                name="quantity"
                disabled
                required
                type="number"
                placeholder="Input quantity"
                value={String(quantity)}
              />}
              {isLoading && <LoaderSpinner className="absolute top-0 left-0 w-2 h-2 bg-white bg-opacity-50 z-10" />}
              <div className="flex gap-4 flex-col">
                {!hideQtyAndEstCost&&<div className="flex-1">
                  <InputField
                  disabled
                    label="Estimated Cost"
                    name="estimated_cost"
                    required
                    type="number"
                    placeholder="Estimated Cost"
                    value={String(estimatedCost)}

                  />
                </div>}

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

export default ViewRequisitionForm;