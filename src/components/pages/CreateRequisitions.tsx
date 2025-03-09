"use client";
import React, { useState, useEffect, useCallback } from 'react';
import CreateRequisitionForm from "../organisms/CreateRequisitionForm";
import NumberedListItem from "../atoms/NumberedListItem";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useStore from '@/store';
import Button from '../atoms/Button';
import Modal from '../atoms/Modal';
import FetchItemByPrNumber from '../organisms/FetchItemByPrNumber';
import useFinaliseRequisition from '@/hooks/useFinaliseRequisition';
import useNotify from '@/hooks/useNotify';
import useSaveForLater from '@/hooks/useSaveForLater';
import { FaPlus } from 'react-icons/fa';
import useFetchRequsitionsSavedForLater from '@/hooks/useFetchRequistionsSavedForLater';
import AddItemsToRequisition from '../organisms/AddItemsToRequisition';
import LoaderSpinner from '../atoms/LoaderSpinner';
import useFetchPurchaseRequisition from '@/hooks/useFetchPurchaseRequisition';
import { Requisition } from '@/types';

const PurchaseRequisitionSchema = z.object({
  department_id: z.string().min(1, "Department is required"),
  contact_info: z.string().email().min(1,"Invalid contact information"),
  requestor_name: z.string().min(1, "Requestor name is required"),
  request_description: z.string().min(1, "Description of goods/services is required"),
  branch_id: z.string().min(1, "Branch is required"),
  supplier_id: z.string().min(1, "Supplier is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  estimated_cost: z.number().min(1, "Estimated cost must be at least 1"),
  currency: z.string().min(1, "Currency is required"),
  justification: z.string().min(1, "Justification is required"),
  needed_by_date: z.string().min(1, "Needed by date must be in the future"),
});

type PurchaseRequsitionData = z.infer<typeof PurchaseRequisitionSchema>;

const CreateRequisitions = () => {
  const { currentOrg, pr, isOpen, setIsOpen } = useStore();
  const { finaliseRequisition, loading, errorMessage } = useFinaliseRequisition();
  const { saveForLater } = useSaveForLater();
  const { error } = useNotify();
  const [saveForLaterChecked, setSaveForLaterChecked] = useState(false);

  const { data: savedRequisitions, isLoading: isLoadingSavedRequisitions } = useFetchRequsitionsSavedForLater(currentOrg);
  const { data: pendingRequisitions, isLoading: pendingLoading } = useFetchPurchaseRequisition(currentOrg, "PENDING");
  const { data: approvedRequisitions, isLoading: approvedLoading } = useFetchPurchaseRequisition(currentOrg, "APPROVED");
  const { data: rejectedRequisitions, isLoading: rejectedLoading } = useFetchPurchaseRequisition(currentOrg, "REJECTED");
  const { data: requestRequisitions, isLoading: requestLoading } = useFetchPurchaseRequisition(currentOrg, "REQUEST_MODIFICATION");

  const defaultValues = {
    department_id: "",
    contact_info: "",
    requestor_name: "",
    request_description: "",
    branch_id: "",
    supplier_id: "",
    quantity: 0,
    estimated_cost: 0,
    currency: "NGN",
    justification: "",
    needed_by_date: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PurchaseRequsitionData>({
    resolver: zodResolver(PurchaseRequisitionSchema),
    mode: "onSubmit",
    defaultValues,
  });

  const setRequisitionValues = useCallback((requisition: Requisition) => {
    setValue("department_id", requisition?.department?.id);
    setValue("contact_info", requisition.contact_info);
    setValue("requestor_name", requisition.requestor_name);
    setValue("request_description", requisition.request_description);
    setValue("branch_id", requisition?.branch?.id);
    setValue("supplier_id", requisition?.supplier?.id);
    setValue("quantity", requisition.quantity);
    setValue("estimated_cost", requisition.estimated_cost);
    setValue("justification", requisition.justification);
    setValue("currency", requisition.currency);
    setValue("needed_by_date", new Date(requisition.needed_by_date).toISOString().split('T')[0]);
  },[setValue]);

  useEffect(() => {
    if (savedRequisitions) {
      const saved = savedRequisitions.data.requisitions.find((req) => req?.pr_number === pr?.pr_number);
      if (saved) setRequisitionValues(saved);
    }
  }, [savedRequisitions, pr, setValue, setRequisitionValues]);

  useEffect(() => {
    if (pendingRequisitions) {
      const pending = pendingRequisitions.data.requisitions.find((req) => req?.pr_number === pr?.pr_number);
      if (pending) setRequisitionValues(pending);
    }
  }, [pendingRequisitions, pr, setRequisitionValues, setValue]);

  useEffect(() => {
    if (approvedRequisitions) {
      const approved = approvedRequisitions.data.requisitions.find((req) => req?.pr_number === pr?.pr_number);
      if (approved) setRequisitionValues(approved);
    }
  }, [approvedRequisitions, pr, setRequisitionValues, setValue]);

  useEffect(() => {
    if (rejectedRequisitions) {
      const rejected = rejectedRequisitions.data.requisitions.find((req) => req?.pr_number === pr?.pr_number);
      if (rejected) setRequisitionValues(rejected);
    }
  }, [rejectedRequisitions, pr, setValue, setRequisitionValues]);

  useEffect(() => {
    if (requestRequisitions) {
      const request = requestRequisitions.data.requisitions.find((req) => req?.pr_number === pr?.pr_number);
      if (request) setRequisitionValues(request);
    }
  }, [requestRequisitions, pr, setValue, setRequisitionValues]);

  const onSubmit = async (data: PurchaseRequsitionData) => {
    if (pr) {
      const submissionData = {
        pr_number: pr.pr_number,
        department_id: data.department_id,
        supplier_id: data.supplier_id,
        contact_info: data.contact_info,
        requestor_name: data.requestor_name,
        request_description: data.request_description,
        branch_id: data.branch_id,
        quantity: data.quantity,
        estimated_cost: data.estimated_cost,
        currency: data.currency,
        justification: data.justification,
        needed_by_date: data.needed_by_date,
      };

      if (saveForLaterChecked) {
        await saveForLater(currentOrg, submissionData);
      } else {
        await finaliseRequisition(submissionData, currentOrg);
        setIsOpen(false);
      }
      reset();
    } else {
      error("No PR number specified");
    }
  };
  const isDisbaled = approvedRequisitions?.data.requisitions.find((req)=> req.pr_number === pr?.pr_number) || pendingRequisitions?.data.requisitions.find((req)=> req.pr_number === pr?.pr_number) || requestRequisitions?.data.requisitions.find((req)=> req.pr_number === pr?.pr_number) 
  return (
    <>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} contentClassName="overflow-y-scroll w-full max-h-[600px] sm:px-10 sm:pb-10">
          <div className="flex flex-col sm:gap-4 gap-2">
            <div className="bg-primary/5 sm:p-4 rounded-lg sm:mb-4">
              <h1 className="sm:text-xl text-sm font-semibold text-gray-800">Create Purchase Requisition</h1>
              <p className="sm:text-sm text-[12px] text-gray-600">PR Number: {pr?.pr_number}</p>
            </div>

            <ol className="list-decimal list-inside bg-white h-auto py-4 flex flex-col justify-center gap-5 items-center rounded-sm">
              {isLoadingSavedRequisitions || pendingLoading || approvedLoading || rejectedLoading || requestLoading ? (
                <LoaderSpinner />
              ) : (
                <>
                  <NumberedListItem
                    number={1}
                    title="Basic Information"
                    description="Enter requisition details and specifications"
                  >
                    <CreateRequisitionForm
                      register={register}
                      errors={errors}
                      prNumber={pr?.pr_number ?? ""}
                      watch={watch}
                      setValue={setValue}
                    />
                  </NumberedListItem>

                  <NumberedListItem
                    number={2}
                    title="Item Selection"
                    description="Add items from inventory or create new items"
                  >
                    <AddItemsToRequisition />
                  </NumberedListItem>

                  <NumberedListItem
                    number={3}
                    title="Review Items"
                    description="Review and confirm selected items"
                  >
                    <FetchItemByPrNumber />
                  </NumberedListItem>
                </>
              )}
            </ol>

            <div className="flex flex-col gap-4 mt-4 bg-white p-4 rounded-lg">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <Button
                    className="rounded-full bg-primary justify-center flex p-0 w-6 h-6 items-center"
                    onClick={() => setSaveForLaterChecked(true)}
                  >
                    <FaPlus color="white" size={16} />
                  </Button>
                  <p className="text-sm font-medium text-gray-700">Save as Draft</p>
                </div>
                <p className="text-xs text-gray-500">Save your progress and continue later</p>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  type='button'
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
                  onClick={() => setIsOpen(false)}
                >
                  <span className='text-white'>Cancel</span>
                </Button>

                <div className="flex gap-3 items-center justify-center">
                  <Button
                    type='button'
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    onClick={() => {/* Add export logic */}}
                  >
                    Export as PDF
                  </Button>
                  {(isDisbaled?.status === "APPROVED" || isDisbaled?.status === "PENDING") ?
                  <p className='text-primary font-serif '> <span className='text-yellow-600 italic text-sm'>{isDisbaled.status}</span></p>:
                  <div
                    role="button"
                    onClick={() => handleSubmit(onSubmit)()}
                    className="px-6 py-2 text-sm text-white bg-primary hover:bg-primary/90 rounded-lg flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Submit Requisition</span>
                    )}
                  </div>}
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default CreateRequisitions;