"use client";
import React, { useState, useEffect, useCallback } from "react";
import NumberedListItem from "../atoms/NumberedListItem";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "@/store";
import Button from "../atoms/Button";
import Modal from "../atoms/Modal";
import FetchItemByPrNumber from "../organisms/FetchItemByPrNumber";
import useFinaliseRequisition from "@/hooks/useFinaliseRequisition";
import useNotify from "@/hooks/useNotify";
import useSaveForLater from "@/hooks/useSaveForLater";
import { FaPlus } from "react-icons/fa";
import AddItemsToRequisition from "../organisms/AddItemsToRequisition";
import LoaderSpinner from "../atoms/LoaderSpinner";
import { Requisition } from "@/types";
import { useGetRequisitions } from "@/hooks/useGetRequisition";
import ViewRequisitionForm from "../organisms/ViewRequisitionForm";
import CommentSection from "../organisms/CommentSection";

const PurchaseRequisitionSchema = z.object({
  department_id: z.string().min(1, "Department is required"),
  requestor_phone: z.string().min(1, "Invalid contact phone number"),
  requestor_email: z.string().email("Invalid email address"),
  requestor_name: z.string().min(1, "Requestor name is required"),
  request_description: z
    .string()
    .min(1, "Description of goods/services is required"),
  branch_id: z.string().min(1, "Branch is required"),
  supplier_id: z.string().min(1, "Supplier is required"),
  currency: z.string().min(1, "Currency is required"),
  justification: z.string().min(1, "Justification is required"),
  needed_by_date: z
    .string()
    .min(1, "Needed by date is required")
    .refine((date) => {
      if (!date) return false;
      const selectedDate = new Date(date);
      const today = new Date();
      // Reset time parts to compare dates only
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "Date must be today or in the future"),
});

type PurchaseRequsitionData = z.infer<typeof PurchaseRequisitionSchema>;

const ViewRequisitions = () => {
  const { currentOrg, pr, isOpen, setIsOpen, hideCreatePrText } = useStore();
  const { finaliseRequisition, loading: finalizeLoading } =
    useFinaliseRequisition();
  const { saveForLater, loading: saveForLaterLoading } = useSaveForLater();
  const { error } = useNotify();
  const [saveForLaterChecked, setSaveForLaterChecked] = useState(false);
  const {
    savedRequisitions,
    pendingRequisitions,
    approvedRequisitions,
    rejectedRequisitions,
    requestRequisitions,
    isLoadingSavedRequisitions,
    isPendingLoading,
    isApprovedLoading,
    isRejectedLoading,
    isRequestLoading,
    isDisabled,
    showForSavedOnly,
  } = useGetRequisitions();

  const defaultValues = {
    department_id: "",
    requestor_phone: "",
    requestor_email: "",
    requestor_name: "",
    request_description: "",
    branch_id: "",
    supplier_id: "",
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
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues,
  });

  const setRequisitionValues = useCallback(
    (requisition: Requisition) => {
      setValue("department_id", requisition?.department?.id);
      setValue("requestor_phone", requisition.requestor_phone);
      setValue("requestor_email", requisition.requestor_email);
      setValue("requestor_name", requisition.requestor_name);
      setValue("request_description", requisition.request_description);
      setValue("branch_id", requisition?.branch?.id);
      setValue("supplier_id", requisition?.supplier?.id);
      setValue("justification", requisition.justification);
      setValue("currency", requisition.currency);
      setValue(
        "needed_by_date",
        new Date(requisition.needed_by_date).toISOString().split("T")[0]
      );
    },
    [setValue]
  );

  useEffect(() => {
    if (savedRequisitions) {
      const saved = savedRequisitions.find(
        (req: Requisition) => req?.pr_number === pr?.pr_number
      );
      if (saved) setRequisitionValues(saved);
    }
  }, []);

  useEffect(() => {
    if (pendingRequisitions) {
      const pending = pendingRequisitions.find(
        (req: Requisition) => req?.pr_number === pr?.pr_number
      );
      if (pending) setRequisitionValues(pending);
    }
  }, []);

  useEffect(() => {
    if (approvedRequisitions) {
      const approved = approvedRequisitions.find(
        (req: Requisition) => req?.pr_number === pr?.pr_number
      );
      if (approved) setRequisitionValues(approved);
    }
  }, []);

  useEffect(() => {
    if (rejectedRequisitions) {
      const rejected = rejectedRequisitions.find(
        (req: Requisition) => req?.pr_number === pr?.pr_number
      );
      if (rejected) setRequisitionValues(rejected);
    }
  }, []);

  useEffect(() => {
    if (requestRequisitions) {
      const request = requestRequisitions.find(
        (req: Requisition) => req?.pr_number === pr?.pr_number
      );
      if (request) setRequisitionValues(request);
    }
  }, []);

  // Function to handle save for later
  const handleSaveForLater = async (data: PurchaseRequsitionData) => {
    if (!pr) {
      error("No PR number specified");
      return;
    }

    try {
      const submissionData = {
        pr_number: pr.pr_number,
        department_id: data.department_id,
        supplier_id: data.supplier_id,
        requestor_phone: data.requestor_phone,
        requestor_email: data.requestor_email,
        requestor_name: data.requestor_name,
        request_description: data.request_description,
        branch_id: data.branch_id,
        currency: data.currency,
        justification: data.justification,
        needed_by_date: data.needed_by_date,
      };

      await saveForLater(currentOrg, submissionData);
      setIsOpen(false);
      reset();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      error("Failed to save requisition as draft");
    }
  };

  // Function to handle submit requisition
  const handleFinalizeRequisition = async (data: PurchaseRequsitionData) => {
    if (!pr) {
      error("No PR number specified");
      return;
    }

    try {
      const submissionData = {
        pr_number: pr.pr_number,
        department_id: data.department_id,
        supplier_id: data.supplier_id,
        requestor_phone: data.requestor_phone,
        requestor_email: data.requestor_email,
        requestor_name: data.requestor_name,
        request_description: data.request_description,
        branch_id: data.branch_id,
        currency: data.currency,
        justification: data.justification,
        needed_by_date: data.needed_by_date,
      };

      await finaliseRequisition(submissionData, currentOrg);
      setIsOpen(false);
      reset();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  const onSubmit = (data: PurchaseRequsitionData) => {
    if (saveForLaterChecked) {
      handleSaveForLater(data);
    } else {
      handleFinalizeRequisition(data);
    }
  };

  const isSubmitting = finalizeLoading || saveForLaterLoading;
  return (
    <div>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          contentClassName="overflow-y-scroll w-full max-h-[600px] sm:px-10 sm:pb-10"
        >
          <div className="flex flex-col sm:gap-4 gap-2">
            <div className="bg-primary/5 sm:p-4 rounded-lg sm:mb-4">
              <h1 className="sm:text-xl text-sm font-semibold text-primary">
                {hideCreatePrText !== ""
                  ? hideCreatePrText
                  : "Create Purchase Requisition"}
              </h1>
            </div>

            <ol className="list-decimal list-inside bg-white h-auto py-4 flex flex-col justify-center gap-5 items-center rounded-sm">
              {isLoadingSavedRequisitions ||
              isPendingLoading ||
              isApprovedLoading ||
              isRejectedLoading ||
              isRequestLoading ? (
                <LoaderSpinner />
              ) : (
                <>
                  <NumberedListItem
                    number={1}
                    title="Basic Information"
                    description="Enter requisition details and specifications"
                  >
                    <ViewRequisitionForm
                      register={register}
                      errors={errors}
                      prNumber={pr?.pr_number ?? ""}
                      watch={watch}
                      setValue={setValue}
                    />
                  </NumberedListItem>

                  {showForSavedOnly && (
                    <NumberedListItem
                      number={2}
                      title="Item Selection"
                      description="Add items from inventory or create new items"
                    >
                      <AddItemsToRequisition />
                    </NumberedListItem>
                  )}

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

            {showForSavedOnly && (
              <div className="flex flex-col gap-4 mt-4 bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      disabled={!!isDisabled || isSubmitting}
                      className={`rounded-full ${
                        saveForLaterChecked ? "bg-green-600" : "bg-primary"
                      } justify-center flex p-0 w-6 h-6 items-center`}
                      onClick={() => setSaveForLaterChecked((prev) => !prev)}
                    >
                      {saveForLaterChecked ? (
                        <span className="text-white text-xs">✓</span>
                      ) : (
                        <FaPlus color="white" size={16} />
                      )}
                    </Button>
                    <p className="text-sm font-medium #181819">
                      Save as Draft
                      {saveForLaterChecked && (
                        <span className="ml-2 text-xs text-green-600">
                          (Selected)
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Save your progress and continue later
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm #181819 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>

                  <div className="flex gap-3 items-center justify-center">
                    {isDisabled?.status === "APPROVED" ||
                    isDisabled?.status === "PENDING" ? (
                      <p className="text-primary font-serif">
                        <span className="text-yellow-600 italic text-sm">
                          {isDisabled.status}
                        </span>
                      </p>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 text-sm text-white bg-primary hover:bg-primary/90 rounded-lg flex items-center gap-2"
                        onClick={handleSubmit(onSubmit)}
                      >
                        {finalizeLoading || saveForLaterLoading ? (
                          <>
                            <span className="animate-spin">⏳</span>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <span>
                            {saveForLaterChecked
                              ? "Save Draft"
                              : "Submit Requisition"}
                          </span>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
            {!showForSavedOnly && (
              <CommentSection
                entity_type="purchase_requisition"
                entity_id={pr?.id || ""}
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ViewRequisitions;
