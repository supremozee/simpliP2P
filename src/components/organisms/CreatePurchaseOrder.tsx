import React, { useState, useEffect, useRef, useMemo } from "react";
import Modal from "../atoms/Modal";
import useStore from "@/store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetchPurchaseRequisition from "@/hooks/useFetchPurchaseRequisition";
import useCreateOrder from "@/hooks/useCreateOrder";
import Button from "../atoms/Button";
import {
  IoClose,
  IoDocumentTextSharp,
  IoCheckmarkCircle,
  IoWarning,
} from "react-icons/io5";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFileUpload,
  FaUserTie,
  FaBuilding,
  FaCalendarAlt,
} from "react-icons/fa";
import TextAreaField from "../atoms/TextArea";
import InputField from "../atoms/Input";
import PurchaseOrderSkeleton from "../atoms/Skeleton/PurchaseOrderSkeleton";
import { cn } from "@/utils/cn";
import ErrorComponent from "../molecules/ErrorComponent";
import Select from "../atoms/Select";
import useFetchSuppliers from "@/hooks/useFetchSuppliers";
import Image from "next/image";
import useFetchAllOrders from "@/hooks/useFetchAllOrders";
import Link from "next/link";
import useFileManager from "@/hooks/useFileManager";
import LoaderSpinner from "../atoms/LoaderSpinner";
import { motion } from "framer-motion";
import CreateSupplier from "./CreateSupplier";

const ACCEPTED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "application/pdf": [".pdf"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "text/csv": [".csv"],
};

const PurchaseOrderSchema = z.object({
  request_id: z.string().min(1, "Request ID is required"),
  supplier_id: z.string().min(1, "Supplier is required"),
  total_amount: z
    .number()
    .min(1, "Total amount is required")
    .nonnegative("Amount must be positive"),
  attachment: z.string().optional(),
});

type PurchaseOrderFormData = z.infer<typeof PurchaseOrderSchema>;

const CreatePurchaseOrder = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(PurchaseOrderSchema),
    defaultValues: {
      request_id: "",
      supplier_id: "",
      total_amount: 0,
      attachment: "",
    },
  });

  const { createOrder, errorMessage, loading: isCreating } = useCreateOrder();
  const { isOpen, setIsOpen, currentOrg, setPr, orgName, upload, setUpload } =
    useStore();
  const { uploadFile, loading: isUploading } = useFileManager();
  const {
    data: requisitions,
    isLoading: isRequisitionsLoading,
    isError: isRequisitionsError,
  } = useFetchPurchaseRequisition(currentOrg, "APPROVED");
  const { data: suppliersData, isLoading: isSuppliersLoading } =
    useFetchSuppliers(currentOrg);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fileError, setFileError] = useState<string>("");

  const suppliers = suppliersData?.data || [];
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useFetchAllOrders(currentOrg);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
      setFileError(
        "Invalid file type. Please upload jpg, png, pdf, excel, or csv files."
      );
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size too large. Maximum size is 5MB.");
      return;
    }

    setFileError("");
    try {
      const response = await uploadFile(file);
      if (response?.url) {
        setValue("attachment", response.url);
        setUpload(response.url);
      }
    } catch (error) {
      setFileError("Error uploading file. Please try again.");
      console.error("Upload error:", error);
    }
  };

  const filteredRequisitions = useMemo(() => {
    if (!requisitions?.data?.requisitions || !ordersData?.data?.orders)
      return [];

    return requisitions.data.requisitions.filter((requisition) => {
      return !ordersData.data.orders.some(
        (order) =>
          order.purchase_requisition.pr_number === requisition.pr_number
      );
    });
  }, [requisitions, ordersData]);

  useEffect(() => {
    if (filteredRequisitions.length > 0) {
      const firstRequisition = filteredRequisitions[0];
      if (firstRequisition) {
        setPr({
          id: firstRequisition.id,
          pr_number: firstRequisition.pr_number,
        });
        setValue("supplier_id", firstRequisition.supplier?.id);
        setValue("request_id", firstRequisition.id);
        setValue("total_amount", Number(firstRequisition.estimated_cost));
      }
    }
  }, [filteredRequisitions, setPr, setValue]);

  const handleNavigation = (direction: "next" | "prev") => {
    const newIndex =
      direction === "next"
        ? (currentIndex + 1) % filteredRequisitions.length
        : currentIndex === 0
        ? filteredRequisitions.length - 1
        : currentIndex - 1;

    const requisition = filteredRequisitions[newIndex];
    if (requisition) {
      setPr({
        id: requisition.id,
        pr_number: requisition.pr_number,
      });
      setValue("request_id", requisition.id);
      setValue("supplier_id", requisition.supplier?.id);
      setValue("total_amount", Number(requisition.estimated_cost));
      setCurrentIndex(newIndex);
    }
  };

  const onSubmit = async (data: PurchaseOrderFormData) => {
    try {
      await createOrder(currentOrg, data);
      reset();
      setUpload("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const calculateDaysRemaining = (dateString: string) => {
    const today = new Date();
    const neededByDate = new Date(dateString);
    const timeDiff = neededByDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) return "Past due";
    if (daysDiff === 0) return "Due today";
    return `${daysDiff} day${daysDiff === 1 ? "" : "s"} remaining`;
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setUpload("");
    setValue("attachment", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFileError("");
  };

  const isLoading =
    isRequisitionsLoading || isOrdersLoading || isSuppliersLoading;
  const hasError = isRequisitionsError || isOrdersError;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        reset();
        setUpload("");
        setFileError("");
      }}
      contentClassName="max-w-7xl h-[90vh] overflow-y-auto"
      title="Create Purchase Order"
    >
      {hasError ? (
        <ErrorComponent text="Something went wrong. Please ensure you have approved requisitions and try again." />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="h-full">
          {isLoading ? (
            <PurchaseOrderSkeleton />
          ) : filteredRequisitions.length > 0 ? (
            <div className="flex flex-col gap-6">
              {/* Header Section */}
              <div className="sticky top-0 bg-white z-30 border-b border-gray-200">
                <div className="flex justify-between items-center p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <FaFileUpload className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-primary">
                        Create Purchase Order
                      </h2>
                      <p className="text-sm text-gray-500">
                        PR-{filteredRequisitions[currentIndex]?.pr_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      onClick={() => handleNavigation("prev")}
                      disabled={currentIndex === 0}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        currentIndex === 0
                          ? "bg-gray-100 text-gray-400"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      <FaArrowLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-500">
                      {currentIndex + 1} of {filteredRequisitions.length}
                    </span>
                    <Button
                      type="button"
                      onClick={() => handleNavigation("next")}
                      disabled={
                        currentIndex === filteredRequisitions.length - 1
                      }
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        currentIndex === filteredRequisitions.length - 1
                          ? "bg-gray-100 text-gray-400"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      <FaArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 p-6">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <FaUserTie className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-primary">
                        Requestor Details
                      </h3>
                    </div>
                    <div className="grid gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Department & Branch
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <FaBuilding className="w-4 h-4 text-gray-400" />
                          <p className="text-sm font-medium #181819">
                            {
                              filteredRequisitions[currentIndex]?.department
                                ?.name
                            }
                            , {filteredRequisitions[currentIndex]?.branch?.name}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Contact Information
                        </p>
                        <p className="text-sm font-medium #181819 mt-1">
                          {filteredRequisitions[currentIndex]?.requestor_phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Requestor Name</p>
                        <p className="text-sm font-medium #181819 mt-1">
                          {filteredRequisitions[currentIndex]?.requestor_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Delivery Timeline
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="w-4 h-4 text-gray-400" />
                            <p className="text-sm font-medium #181819">
                              {new Date(
                                filteredRequisitions[
                                  currentIndex
                                ]?.needed_by_date
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium",
                              calculateDaysRemaining(
                                filteredRequisitions[currentIndex]
                                  ?.needed_by_date
                              ).includes("Past")
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            )}
                          >
                            {calculateDaysRemaining(
                              filteredRequisitions[currentIndex]?.needed_by_date
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <IoDocumentTextSharp className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-primary">
                        Order Details
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <Select
                        label="Select Supplier"
                        options={suppliers}
                        {...register("supplier_id")}
                        onChange={(selectedSupplier) =>
                          setValue("supplier_id", selectedSupplier)
                        }
                        value={filteredRequisitions[currentIndex]?.supplier?.id}
                        required
                        error={errors.supplier_id?.message}
                        loading={isSuppliersLoading}
                        placeholder="Choose a supplier"
                        className="w-full"
                        component={<CreateSupplier add={true} />}
                      />
                      <InputField
                        label="Total Amount"
                        type="number"
                        value={watch("total_amount")?.toString()}
                        {...register("total_amount")}
                        name="total_amount"
                        placeholder="Enter total amount"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <IoDocumentTextSharp className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-primary">
                        Requisition Details
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <TextAreaField
                        label="Description of Goods/Services"
                        value={
                          filteredRequisitions[currentIndex]
                            ?.request_description
                        }
                        readOnly
                        rows={4}
                        className="bg-gray-50"
                        name="description"
                        placeholder="Description of goods or services"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Quantity"
                          type="number"
                          value={filteredRequisitions[
                            currentIndex
                          ]?.quantity?.toString()}
                          readOnly
                          className="bg-gray-50"
                          name="quantity"
                          placeholder="Enter quantity"
                        />
                        <InputField
                          label="Estimated Cost"
                          type="number"
                          value={filteredRequisitions[
                            currentIndex
                          ]?.estimated_cost?.toString()}
                          readOnly
                          className="bg-gray-50"
                          name="estimated_cost"
                          placeholder="Estimated cost"
                        />
                      </div>
                      <TextAreaField
                        label="Approval Justification"
                        value={
                          filteredRequisitions[currentIndex]
                            ?.approval_justification ??
                          "No justification provided"
                        }
                        readOnly
                        rows={3}
                        className="bg-gray-50"
                        name="justification"
                        placeholder="Approval justification"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <FaFileUpload className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-primary">
                        Attachments
                      </h3>
                    </div>

                    {!upload ? (
                      <div
                        className={cn(
                          "border-2 border-dashed rounded-lg cursor-pointer transition-colors p-8",
                          "hover:bg-gray-50 group",
                          fileError ? "border-red-300" : "border-gray-300"
                        )}
                        onClick={handleFileUploadClick}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                            <FaFileUpload className="w-6 h-6 text-gray-500" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">
                              Drop files here or{" "}
                              <span className="text-primary font-medium">
                                click to upload
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Supported formats: JPG, PNG, PDF, XLS, XLSX, CSV
                            </p>
                          </div>
                        </div>
                        <input
                          type="file"
                          accept={Object.keys(ACCEPTED_FILE_TYPES).join(",")}
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleUpload}
                        />
                      </div>
                    ) : (
                      <div className="relative p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <Image
                              src={
                                upload.endsWith(".pdf")
                                  ? "/pdf-icon.png"
                                  : upload
                              }
                              alt="File Preview"
                              width={80}
                              height={80}
                              className="rounded-lg object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                className="p-1 absolute top-0 right-0 hover:bg-gray-200 rounded-full transition-colors"
                                onClick={handleRemoveFile}
                              >
                                <IoClose className="w-5 h-5 text-gray-500" />
                              </button>
                            </div>
                            {isUploading ? (
                              <div className="mt-2">
                                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary rounded-full animate-pulse"
                                    style={{ width: "50%" }}
                                  />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Uploading...
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 mt-2">
                                <IoCheckmarkCircle className="w-4 h-4 text-green-500" />
                                <p className="text-xs text-green-600">
                                  File uploaded successfully
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {fileError && (
                      <div className="mt-2 flex items-center gap-2 text-red-600">
                        <IoWarning className="w-4 h-4" />
                        <p className="text-sm">{fileError}</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <LoaderSpinner size="sm" color="white" />
                        <span>Creating Order...</span>
                      </>
                    ) : (
                      <>
                        <IoCheckmarkCircle className="w-5 h-5" />
                        <span>Create Purchase Order</span>
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      className="px-4 py-2 #181819 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      onClick={() => {
                        reset();
                        setIsOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <IoWarning className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="space-y-4 mb-8">
                <div className="bg-gray-100 rounded-full p-4 inline-block mx-auto">
                  <IoWarning className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-primary">
                  No Approved Requisitions
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  There are currently no approved requisitions available to
                  create a purchase order from. You can view existing
                  requisitions or track current orders.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <Link
                  href="/track"
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-colors group"
                >
                  <Image
                    src="/track.jpg"
                    alt="Track Orders"
                    width={150}
                    height={150}
                    className="mb-4 rounded-lg"
                  />
                  <span className="px-6 py-2 bg-primary text-white rounded-lg group-hover:bg-primary/90 transition-colors">
                    Track Orders
                  </span>
                </Link>

                <Link
                  href={`/${orgName}/purchase-requisitions`}
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-colors group"
                >
                  <Image
                    src="/create-new.jpg"
                    alt="View Requisitions"
                    width={150}
                    height={150}
                    className="mb-4 rounded-lg"
                  />
                  <span className="px-6 py-2 bg-primary text-white rounded-lg group-hover:bg-primary/90 transition-colors">
                    View Requisitions
                  </span>
                </Link>
              </div>
            </div>
          )}
        </form>
      )}
    </Modal>
  );
};

export default CreatePurchaseOrder;
