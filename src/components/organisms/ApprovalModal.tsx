"use client";
import React, { useState } from 'react';
import Modal from '../atoms/Modal';
import useStore from '@/store';
import useFetchPurchaseRequisitionById from '@/hooks/useFetchPurchaseRequistionById';
import Button from '../atoms/Button';
import TableHead from '../atoms/TableHead';
import TableBody from '../atoms/TableBody';
import TableRow from '../molecules/TableRow';
import useUpdateRequisitionStatus from '@/hooks/useUpdateRequisitionStatus';
import TextAreaField from '../atoms/TextArea';
import ConfirmReject from '../molecules/ConfirmReject';
import CommentSection from './CommentSection';
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaUserTie, FaFileInvoiceDollar } from "react-icons/fa";
import { BsClockHistory } from "react-icons/bs";
import { cn } from "@/utils/cn";
import LoaderSpinner from "../atoms/LoaderSpinner";
import useFetchBudget from '@/hooks/useFetchBudget';
import Select from '../atoms/Select';
import { format_price } from '@/utils/helpers';
import useFetchSuppliers from '@/hooks/useFetchSuppliers';
import useFetchItemsByPrNumber from '@/hooks/useFetchAllItemsByPrNumber';
import TableSkeleton from '../atoms/Skeleton/Table';
import ErrorComponent from '../molecules/ErrorComponent';

const actionTypes = [
  { id: "approve", name: "Approve Only" },
  { id: "reject", name: "Reject" },
  { id: "approve_and_create_po", name: "Approve & Create PO" }
];

const ApprovalModal = ({ pr_id }: { pr_id: string }) => {
  const { isOpen, setIsOpen, currentOrg, pr } = useStore();
  const { data, isLoading, isError } = useFetchPurchaseRequisitionById(currentOrg, pr_id);
  const { data: budgets, isLoading: isBudgetLoading } = useFetchBudget(currentOrg);
  const suppliers = useFetchSuppliers(currentOrg);
  const supplier = suppliers?.data?.data || []
  const { updateRequisitionStatus, loading } = useUpdateRequisitionStatus();
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [justification, setJustification] = useState<string>("");
  const [showConfirmApproval, setShowConfirmApproval] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [selectedActionType, setSelectedActionType] = useState<string>("approve_and_create_po");
  const { data:itemData, error, isLoading:isLoadingItem } = useFetchItemsByPrNumber(currentOrg, pr?.pr_number || "", 100, 1);
  const items = itemData?.data?.data
  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen z-50 absolute inset-0">
          <LoaderSpinner size="lg" text="Loading requisition details..." />
        </div>
    );
  }

  if (isError) {
    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} contentClassName="max-w-5xl">
        <div className="p-6 text-center">
          <div className="text-red-500 mb-2">Error fetching requisition details</div>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      </Modal>
    );
  }

  const requisition = data?.data.requisition;

  const handleApprove = async () => {
    if (!selectedBudget || !selectedActionType) return;
    await updateRequisitionStatus(currentOrg, pr_id, { 
      status: 'APPROVED', 
      approval_justification: justification,
      budget_id: selectedBudget,
      supplier_id: (selectedSupplier ? selectedSupplier : requisition?.supplier?.id) ?? "" ,
      action_type: selectedActionType as "approve" | "approve_and_create_po"
    });
    setShowConfirmApproval(false);
    setIsOpen(false);
  };

  const handleReject = async () => {
    if (!selectedBudget) return;
    await updateRequisitionStatus(currentOrg, pr_id, {
      status: 'REJECTED', 
      approval_justification: justification,
      budget_id: selectedBudget,
      supplier_id: (selectedSupplier ? selectedSupplier : requisition?.supplier?.id) ?? "" ,
      action_type: "reject"
    });
    setIsRejectModalOpen(false);
    setIsOpen(false);
  };

  const calculateTotal = ():number => {
    return requisition?.estimated_cost || 0;
  };

  return (
    <>
      {isRejectModalOpen && (
        <ConfirmReject
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          requisition={{ id: pr_id, name: requisition?.request_description || 'this requisition' }}
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
              <h2 className="text-2xl font-bold text-gray-800">Purchase Requisition Review</h2>
              <p className="text-sm text-gray-500">PR Number: {requisition?.pr_number}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                requisition?.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                requisition?.status === "APPROVED" ? "bg-green-100 text-green-800" :
                "bg-red-100 text-red-800"
              )}>
                {requisition?.status}
              </span>
              <span className="text-sm text-gray-500 mt-1">
                Created: {new Date(requisition?.created_at ?? "").toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Requisition Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <IoDocumentTextOutline className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-800">Requisition Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-sm font-medium">{requisition?.request_description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Justification</p>
                    <p className="text-sm font-medium">{requisition?.justification}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Needed By</p>
                    <p className="text-sm font-medium">
                      {new Date(requisition?.needed_by_date ?? "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaUserTie className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-800">Requestor Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Requestor Name</p>
                    <p className="text-sm font-medium">{requisition?.requestor_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone No.</p>
                    <p className="text-sm font-medium">{requisition?.requestor_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium">{requisition?.requestor_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="text-sm font-medium">{requisition?.department?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p className="text-sm font-medium">{requisition?.branch?.address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaFileInvoiceDollar className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-800"></h3>
                </div>
                <div className="overflow-x-auto">
                <div className="overflow-x-auto">
      {error ? (
        <ErrorComponent text='Error fetching items' />
      ) : (
        <table className="w-full border border-[#80808050]">
          <TableHead headers={['Item Name', 'Quantity', 'Unit Price', 'Total']} />
          {isLoadingItem ? (
            <TableSkeleton />
          ) : (
            <TableBody
              data={items || []}
              renderRow={(item, i) => (
                <TableRow
                  key={item.id || i}
                  data={[
                    item.item_name || 'Unnamed Item',
                    item.pr_quantity,
                    (format_price(item.unit_price || 0, item?.currency)),
                    (format_price((item.unit_price || 0) * (item.pr_quantity || 0), item?.currency))
                  ]}
                  index={i}
                />
              )}
              emptyMessage="No items found"
            />
          )}
        </table>
      )}
</div>
               <div className="flex justify-end mt-4">
                    <div className="bg-gray-50 px-4 py-2 rounded-lg">
                      <span className="text-sm text-gray-500">Total Amount: </span>
                      <span className="text-lg font-semibold text-primary">
                       {format_price(calculateTotal(), requisition?.currency)}  
                      </span>
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
                      {new Date(requisition?.created_at ?? "").toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <p className="text-sm">Pending Approval</p>
                    <p className="text-sm text-gray-500 ml-auto">Current</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Approval Notes</h3>
                <div className="space-y-4">
                  <div>
                    <Select
                      label="Select Budget"
                      options={budgets || []}
                      value={selectedBudget}
                      onChange={(selectedOption) => setSelectedBudget(selectedOption)}
                      error={selectedBudget.length === 0 ? "Please select a budget" : ""}
                      loading={isBudgetLoading}
                      required
                      placeholder="Select a budget"
                    />
                  </div>
                  <div>
                    <Select
                      label="Select Supplier"
                      options={supplier || []}
                      value={selectedSupplier ? selectedSupplier : requisition?.supplier?.id}
                      onChange={(selectedOption) => setSelectedSupplier(selectedOption)}
                      required
                      placeholder="Select a Supplier"
                    />
                  </div>
                  {!isRejectModalOpen && (
                    <div>
                      <Select
                        label="Action Type"
                        options={actionTypes}
                        value={selectedActionType}
                        onChange={(selectedOption) => setSelectedActionType(selectedOption)}
                        error={selectedActionType.length === 0 ? "Please select an action type" : ""}
                        required
                        placeholder="Select action type"
                      />
                    </div>
                  )}
                  <TextAreaField
                    name="approvalJustification"
                    label="Justification"
                    placeholder="Enter your justification for approval/rejection"
                    required={true}
                    className="w-full"
                    rows={4}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Actions</h3>
                <div className="flex flex-col gap-3">
                  <Button
                    className="w-full bg-primary text-white py-2 rounded-lg flex justify-center items-center"
                    onClick={() => setShowConfirmApproval(true)}
                    disabled={loading || !justification.trim() || !selectedBudget || !selectedActionType}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <LoaderSpinner size="sm" color="white" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      selectedActionType === "approve_and_create_po" ? "Approve & Create PO" : "Approve Requisition"
                    )}
                  </Button>
                  <Button
                    className="w-full bg-white border border-red-500 text-red-500 py-2 rounded-lg flex justify-center items-center"
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={loading || !justification.trim() || !selectedBudget}
                  >
                    Reject Requisition
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <CommentSection entity_id={pr_id} entity_type="purchase_requisition"/>
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
              Are you sure you want to approve this purchase requisition? This action cannot be undone.
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

export default ApprovalModal;
