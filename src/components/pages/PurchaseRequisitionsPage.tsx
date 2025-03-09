"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Tabs from "../molecules/Tabs";
import TableHead from "../atoms/TableHead";
import TableBody from "../atoms/TableBody";
import TableRow from "../molecules/TableRow";
import useFetchPurchaseRequisition from "@/hooks/useFetchPurchaseRequisition";
import useStore from "@/store";
import { Requisition } from "@/types";
import TableSkeleton from "../atoms/Skeleton/Table";
import useFetchRequsitionsSavedForLater from "@/hooks/useFetchRequistionsSavedForLater";
import Button from "../atoms/Button";
import useNotify from "@/hooks/useNotify";
import InitializeRequisition from "../molecules/InitializeRequisition";
import CreateRequisitions from "./CreateRequisitions";
import { format_price } from "@/utils/helpers";
import { cn } from "@/utils/cn";

interface CompletionProps {
  id: string;
  pr_number: string;
}

const PurchaseRequisitionsPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const tabNames = [
    "ALL",
    "PENDING",
    "APPROVED",
    "REJECTED",
    "REQUEST_MODIFICATION",
    "SAVED APPROVAL",
  ];
  const { currentOrg, setPr, setIsOpen, isOpen } = useStore();
  const { data:allRequisitionsData, isLoading:allRequisitionsLoading } = useFetchPurchaseRequisition(currentOrg);
  const { data:pendingData, isLoading:pendingLoading } = useFetchPurchaseRequisition(currentOrg, "PENDING");
  const { data:approvedData, isLoading:approvedLoading } = useFetchPurchaseRequisition(currentOrg, "APPROVED");
  const { data:rejectedData, isLoading:rejectedLoading } = useFetchPurchaseRequisition(currentOrg, "REJECTED");
  const { data:requestData, isLoading:requestLoading } = useFetchPurchaseRequisition(currentOrg, "REQUEST_MODIFICATION");
  const { data: savedForLater, isLoading: savedForLaterLoading } = useFetchRequsitionsSavedForLater(currentOrg);
  const { error } = useNotify();
  const requisitions = allRequisitionsData?.data?.requisitions || [];
  const pendingRequisitions = pendingData?.data?.requisitions || [];
  const approvedRequisitions = approvedData?.data?.requisitions || [];
  const rejectedRequisitions = rejectedData?.data?.requisitions || [];
  const requestRequisitions = requestData?.data?.requisitions || [];
  const requisitionsSavedForLater = savedForLater?.data?.requisitions || [];

  const headers = [
    "PR Number",
    "Department",
    "Requestor",
    "Line Items",
    "Description",
    "Quantity",
    "Estimated Cost",
    "Status",
    "Needed By",
    "Action"
  ];

  const handleViewRequisition = ({ pr_number, id }: CompletionProps) => {
    if (pr_number && id) {
      setPr({ pr_number, id });
      setIsOpen(true);
    } else {
      error("Invalid PR Number or ID");
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const renderRow = (req: Requisition, index: number) => (
    <>
      <TableRow
        key={req.id}
        data={[
          req.pr_number,
          req.department?.name,
          req.requestor_name,
          <div
          key={req.id}
          className="flex  justify-center items-center"
          >
           <Button
             className="p-1 px-2 bg-secondary"
             onClick={() => toggleRow(req.id)}>
              <span className="text-white text-[10px]">
              {expandedRows.includes(req.id) ? "Hide Items" : "Show Items"}
              </span>
          </Button>
          </div>,
          req.request_description,
          req.quantity,
          format_price(Number(req.estimated_cost), req.currency),
          <span key={req.id} className={`font-semibold ${req.status === 'PENDING' ? 'text-yellow-600' : ''}`}>{req.status}</span>,
          req.needed_by_date,
          <div className="flex w-full justify-center items-center" key={req.id}>
            <Button onClick={() => handleViewRequisition({ pr_number: req.pr_number, id: req.id })} className={cn("p-1 px-2 bg-[#F10000]",
              activeTab === "SAVED APPROVAL" && 'bg-[#F10000]',
              (activeTab === "PENDING" || req.status === "PENDING") && 'bg-yellow-600',
              (activeTab === "APPROVED" || req.status === "APPROVED") && 'bg-green-600',
              activeTab === "REJECTED" && 'bg-[#F10000]',
              activeTab === "REQUEST_MODIFICATION" && 'bg-[#F10000]'
            )}>
              <p className="text-white text-[10px]">
                {(activeTab === "SAVED APPROVAL" || req.status === "SAVED_FOR_LATER" ) ? "Complete": (activeTab === "REQUEST_MODIFICATION" || req.status === "REQUESTED MODIFICATION") ? "View Request": ((req.status === "PENDING" || req.status==="APPROVED") &&"View Requisition")}</p>
            </Button>
          </div>
        ]}
        index={index}
      />
      {expandedRows.includes(req.id) && (
        <motion.tr
          key={`${req.id}-items`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          translate= "yes"
        >
          <td colSpan={headers.length}>
            <div className="p-4 bg-gray-100">
              <h3 className="font-semibold mb-2">Line Items</h3>
              {req.items && req.items.length > 0 ? (
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Item</th>
                      <th className="border px-4 py-2">Quantity</th>
                      <th className="border px-4 py-2">Unit Price</th>
                      <th className="border px-4 py-2">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {req.items.map((item, idx) => (
                      <tr key={idx} className="text-center">
                        <td className="border px-4 py-2">{item.item_name}</td>
                        <td className="border px-4 py-2">{item.pr_quantity}</td>
                        <td className="border px-4 py-2">{format_price(item.unit_price, req.currency)}</td>
                        <td className="border px-4 py-2">{format_price((item.unit_price * item.pr_quantity), req.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500">No items available</p>
              )}
            </div>
          </td>
        </motion.tr>
      )}
    </>
  );

  const tabnamesToRender = tabNames.map(name =>
    name === "REQUEST_MODIFICATION" ? "REQUEST MODIFICATION" : name
  );

  const getTabCount = (tabName: string) => {
    switch (tabName) {
      case "ALL":
        return requisitions.length;
      case "PENDING":
        return pendingRequisitions.filter(req => req.status === "PENDING").length;
      case "APPROVED":
        return approvedRequisitions.filter(req => req.status === "APPROVED").length;
      case "REJECTED":
        return rejectedRequisitions.filter(req => req.status === "REJECTED").length;
      case "REQUEST_MODIFICATION":
        return requestRequisitions.filter(req => req.status === "REQUESTED MODIFICATION").length;
      case "SAVED APPROVAL":
        return requisitionsSavedForLater.length;
      default:
        return 0;
    }
  };
  const renderRequisitions = ()=> {
    switch (activeTab)  {
      case "ALL":
        return requisitions;
      case "PENDING":
        return pendingRequisitions;
      case "APPROVED":
        return approvedRequisitions;
      case "REJECTED":
        return rejectedRequisitions;
      case "REQUEST_MODIFICATION":
        return requestRequisitions;
      case "SAVED APPROVAL":
        return requisitionsSavedForLater;
      default:
        return [];
    }

  }

  const tabCounts = tabNames.map(getTabCount);

  if (savedForLaterLoading || pendingLoading || approvedLoading || requestLoading || rejectedLoading || allRequisitionsLoading) return <TableSkeleton />;

  return (
    <>
      <InitializeRequisition />
      <Tabs
        tabNames={tabnamesToRender}
        active={activeTab}
        setActive={setActiveTab}
        counts={tabCounts}
      />
      <div className="overflow-x-auto relative z-10">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <TableHead headers={headers} />
          <TableBody
            data={renderRequisitions()}
            renderRow={renderRow}
            emptyMessage="No requisitions found for this status."
          />
        </table>
      </div>
      {isOpen && <CreateRequisitions />}
    </>
  );
};

export default PurchaseRequisitionsPage;