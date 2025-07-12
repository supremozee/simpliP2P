"use client";
import React, { useState } from "react";
import Modal from "../atoms/Modal";
import { Order } from "@/types";
import {
  IoCalendarOutline,
  IoPersonOutline,
  IoReceiptOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import { MdOutlineInventory, MdOutlineComment } from "react-icons/md";
import OrderTable from "./OrderTable";
import CommentSection from "./CommentSection";
import { format_price } from "@/utils/helpers";

interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  if (!order) return null;
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      APPROVED: "bg-green-100 text-green-800 border-green-300",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
      REJECTED: "bg-red-100 text-red-800 border-red-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          statusClasses[status as keyof typeof statusClasses] ||
          "bg-tertiary text-primary border-tertiary/50"
        }`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const tabs = [
    { id: "details", label: "Order Details", icon: IoDocumentTextOutline },
    { id: "items", label: "Order Items", icon: MdOutlineInventory },
    { id: "comments", label: "Comments", icon: MdOutlineComment },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Purchase Order: ${
        order.po_number}`}
      width="1200px"
      contentClassName="max-w-5xl"
    >
   <div className="mb-3">{getStatusBadge(order.status)}</div>
      <main className="space-y-6">
        <header className="bg-tertiary rounded-md p-6 border border-primary/10">
          <div className="flex gap-6 justify-between items-center">
            <div className="flex justify-center items-center gap-2">
              <IoReceiptOutline className="w-6 h-6 text-primary" />
              <div className="flex flex-col">
                <p className="text-lg text-primary font-bold  leading-none">PO Number</p>
                <p className="font-medium text-sm text-primary  leading-5">
                  {`${order.po_number}`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <IoPersonOutline className="w-6 h-6 text-primary" />
              <div>
                <p className="text-lg text-primary font-bold leading-none">Supplier</p>
                <p className="font-medium text-sm text-primary leading-5">
                  {order.supplier.full_name}
                </p>
                {order.supplier.email && (
                  <p className="text-sm text-foreground">
                    {order.supplier.email}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <IoCalendarOutline className="w-6 h-6 text-primary" />
              <div>
                <p className="text-lg text-primary font-bold leading-5">
                  Date Created
                </p>
                <p className="font-medium text-sm text-primary leading-5">{formatDate(order.created_at)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MdOutlineInventory className="w-6 h-6 text-primary" />
              <div>
                <p className="text-lg text-primary font-bold leading-5">
                  Total Amount
                </p>
                <p className="font-medium text-sm text-primary leading-5">
                  {format_price(Number(order.total_amount), order.currency, "currency")}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="border-b border-tertiary">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground hover:text-primary hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="min-h-[400px]">
          {activeTab === "details" && (
            <div className="space-y-6">
              {order.purchase_requisition && (
                <div className="bg-tertiary rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-primary">
                    <IoDocumentTextOutline className="w-5 h-5 mr-2" />
                    Purchase Requisition Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-primary font-medium">
                          PR Number
                        </p>
                        <p className="font-semibold text-primary">
                          {order.purchase_requisition.pr_number}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-primary font-medium">
                          Total Items
                        </p>
                        <p className="font-semibold">
                          {order.purchase_requisition.total_items}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-primary font-medium">
                          Quantity
                        </p>
                        <p className="font-semibold">
                          {order.purchase_requisition.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-primary font-medium">
                          Estimated Cost
                        </p>
                        <p className="font-semibold text-green-600">
                          {format_price(Number(order.total_amount), order.currency, "currency")}
                        </p>
                      </div>
                      {order.purchase_requisition.needed_by_date && (
                        <div>
                          <p className="text-sm text-primary font-medium">
                            Needed By Date
                          </p>
                          <p className="font-semibold">
                            {formatDate(
                              order.purchase_requisition.needed_by_date
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {order.purchase_requisition.requestor_name && (
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-primary font-medium">
                            Requestor
                          </p>
                          <p className="text-sm text-foreground">
                           <span className="font-bold">Name:</span> {order.purchase_requisition.requestor_name}
                          </p>
                          {order.purchase_requisition.requestor_email && (
                            <p className="text-sm text-foreground">
                             <span className="font-bold">Email:</span> {order.purchase_requisition.requestor_email}
                            </p>
                          )}
                          {order.purchase_requisition.requestor_phone && (
                            <p className="text-sm text-foreground">
                              <span className="font-bold">Phone:</span>{order.purchase_requisition.requestor_phone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {order.purchase_requisition.request_description && (
                    <div className="mt-6 pt-6 border-t border-primary">
                      <p className="text-primary font-bold text-lg">
                       Requisition Description
                      </p>
                      <p className="text-black text-sm leading-relaxed">
                        {order.purchase_requisition.request_description}
                      </p>
                    </div>
                  )}

                  {order.purchase_requisition.justification && (
                    <div className="mt-2">
                      <p className="text-primary font-bold text-lg">
                        Justification
                      </p>
                      <p className="text-black text-sm leading-relaxed">
                        {order.purchase_requisition.justification}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Information */}
              {order.attachment && (
                <div className="bg-primary rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary">
                    Attachments
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <IoDocumentTextOutline className="w-5 h-5 text-primary" />
                      <a
                        href={order.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium hover:text-primary/80 transition-colors"
                      >
                        View Attachment
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "items" && (
            <div>
              {order.purchase_requisition ? (
                <OrderTable requisition={order.purchase_requisition} />
              ) : (
                <div className="text-center py-12">
                  <MdOutlineInventory className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-foreground">
                    No items available for this order.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <CommentSection
                entity_type="purchase_order"
                entity_id={order.id}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-primary">
          <div className="text-sm text-foreground">
            Last updated: {formatDate(order.updated_at)}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-primary bg-tertiary rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </main>
    </Modal>
  );
};

export default ViewOrderModal;
