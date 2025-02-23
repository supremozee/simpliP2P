"use client";
import React, { useState } from "react";
import Modal from "../atoms/Modal";
import useStore from "@/store";
import Button from "../atoms/Button";
import ConfirmReject from "../molecules/ConfirmReject";
import useFetchAllOrderById from "@/hooks/useFetchOrderById";
import CommentSection from "./CommentSection";
import useUpdateOrderStatus from "@/hooks/useUpdateOrderStatus";
import Image from "next/image";
import { IoDocumentTextOutline, IoWarningOutline } from "react-icons/io5";
import { FaFileInvoiceDollar, FaUserTie } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { cn } from "@/utils/cn";
import LoaderSpinner from "../atoms/LoaderSpinner";

const OrderApprovalModal = ({ order_id }: { order_id: string }) => {
  const { isOpen, setIsOpen, currentOrg } = useStore();
  const { data, isLoading, isError } = useFetchAllOrderById(currentOrg, order_id);
  const { updateOrderStatus, loading } = useUpdateOrderStatus();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [showConfirmApproval, setShowConfirmApproval] = useState(false);

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} contentClassName="max-w-5xl">
        <div className="flex justify-center items-center h-96">
          <LoaderSpinner size="lg" text="Loading order details..." />
        </div>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} contentClassName="max-w-5xl">
        <div className="p-6 text-center">
          <div className="text-red-500 mb-2">Error fetching order details</div>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      </Modal>
    );
  }

  const order = data?.data.order;

  const handleApprove = async () => {
    await updateOrderStatus(currentOrg, order_id, { status: 'APPROVED' });
    setIsOpen(false);
  };

  const handleReject = async () => {
    await updateOrderStatus(currentOrg, order_id, { status: 'REJECTED' });
    setIsRejectModalOpen(false);
    setIsOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      {isRejectModalOpen && (
        <ConfirmReject
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          requisition={{ id: order_id, name: order?.po_number || "this order" }}
          handleConfirm={handleReject}
        />
      )}
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        contentClassName="max-w-5xl"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Purchase Order Review</h2>
              <p className="text-sm text-gray-500">PO Number: {order?.po_number}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                order?.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                order?.status === "APPROVED" ? "bg-green-100 text-green-800" :
                "bg-red-100 text-red-800"
              )}>
                {order?.status}
              </span>
              <span className="text-sm text-gray-500 mt-1">
                Created: {new Date(order?.created_at ?? "").toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <IoDocumentTextOutline className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-800">Order Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-sm font-medium">{order?.purchase_requisition?.request_description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="text-sm font-medium">{order?.purchase_requisition?.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Needed By</p>
                    <p className="text-sm font-medium">
                      {new Date(order?.purchase_requisition?.needed_by_date ?? "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaUserTie className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-800">Supplier Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Supplier Name</p>
                    <p className="text-sm font-medium">{order?.supplier?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="text-sm font-medium">{order?.supplier?.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium">{order?.supplier?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm font-medium">
                      {order?.supplier?.address ? (
                        <>
                          {order.supplier.address.street}
                          {order.supplier.address.city && `, ${order.supplier.address.city}`}
                          {order.supplier.address.state && `, ${order.supplier.address.state}`}
                          {order.supplier.address.country && `, ${order.supplier.address.country}`}
                          {order.supplier.address.zip_code && ` ${order.supplier.address.zip_code}`}
                        </>
                      ) : 'No address provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaFileInvoiceDollar className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-800">Financial Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-lg font-semibold text-primary">
                      {formatCurrency(Number(order?.total_amount))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Budget Impact</p>
                    <div className="flex items-center gap-2">
                      <IoWarningOutline className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Requires budget review</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Approval Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BsClockHistory className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-800">Approval Timeline</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-sm">Request Created</p>
                    <p className="text-sm text-gray-500 ml-auto">
                      {new Date(order?.created_at ?? "").toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <p className="text-sm">Pending Approval</p>
                    <p className="text-sm text-gray-500 ml-auto">Current</p>
                  </div>
                </div>
              </div>

              {order?.attachment && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Attachments</h3>
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={order.attachment}
                      alt="Order attachment"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Actions</h3>
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full bg-primary text-white py-2 rounded-lg flex justify-center items-center"
                    onClick={() => setShowConfirmApproval(true)}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <LoaderSpinner size="sm" color="white" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Approve Order"
                    )}
                  </Button>
                  <Button
                    className="w-full bg-white border border-red-500 text-red-500 py-2 rounded-lg flex justify-center items-center"
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={loading}
                  >
                    Reject Order
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <CommentSection entity_id={order_id} entity_type="purchase_order"/>
          </div>
        </div>
      </Modal>

      {showConfirmApproval && (
        <Modal
          isOpen={showConfirmApproval}
          onClose={() => setShowConfirmApproval(false)}
          contentClassName="max-w-md"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Approval</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to approve this purchase order? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg"
                onClick={() => setShowConfirmApproval(false)}
              >
                Cancel
              </Button>
              <Button
                className="px-4 py-2 text-sm text-white bg-primary rounded-lg"
                onClick={handleApprove}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoaderSpinner size="sm" color="white" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Confirm Approval"
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default OrderApprovalModal;