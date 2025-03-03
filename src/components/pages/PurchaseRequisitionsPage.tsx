"use client";
import React, { useState } from "react";
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

interface CompletionProps {
  id: string;
  pr_number: string;
}

const PurchaseRequisitionsPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
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
    "Description",
    "Quantity",
    "Estimated Cost",
    "Status",
    "Needed By",
    ...(activeTab === "SAVED APPROVAL" ? ["Complete Requisition"] : []),
  ];

  const handleCompleteRequisition = ({ pr_number, id }: CompletionProps) => {
    if (pr_number && id) {
      setPr({ pr_number, id });
      setIsOpen(true);
    } else {
      error("Invalid PR Number or ID");
    }
  };

  const renderRow = (req: Requisition, index: number) => (
    <TableRow
      key={req.id}
      data={[
        req.pr_number,
        req.department?.name,
        req.requestor_name,
        req.request_description,
        req.quantity,
        `${req.currency} ${req.estimated_cost.toLocaleString()}`,
        <span key={req.id} className={`font-semibold ${req.status === 'PENDING' ? 'text-yellow-600' : ''}`}>{req.status}</span>,
        req.needed_by_date,
        activeTab === "SAVED APPROVAL" ? (
          <Button key={req.id} onClick={() => handleCompleteRequisition({ pr_number: req.pr_number, id: req.id })} className="p-1 px-2 bg-[#F10000]">
            <p className="text-white text-[10px]">Complete Requisition</p>
          </Button>
        ): null,
      ]}
      index={index}
    />
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