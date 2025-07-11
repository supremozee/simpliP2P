/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Tabs from "../molecules/Tabs";
import TableHead from "../atoms/TableHead";
import TableBody from "../atoms/TableBody";
import useStore from "@/store";
import { Requisition } from "@/types";
import TableSkeleton from "../atoms/Skeleton/Table";
import useNotify from "@/hooks/useNotify";
import InitializeRequisition from "../molecules/InitializeRequisition";
import { useGetRequisitions } from "@/hooks/useGetRequisition";
import useFetchItemsByPrNumber from "@/hooks/useFetchAllItemsByPrNumber";
import ActionBar from "../molecules/ActionBar";
import TableShadowWrapper from "../atoms/TableShadowWrapper";
import useExportSelected from "@/hooks/useExportSelected";
import SelectedItemForExport from "../organisms/SelectedItemForExport";
import ExportCheckBox from "../molecules/ExportCheckBox";
import ViewRequisitions from "./ViewRequisitionDetailsModal";
import useFetchDepartment from "@/hooks/useFetchDepartments";
import RequisitionRow from "../organisms/RequisitionRow";

interface CompletionProps {
  id: string;
  pr_number: string;
}

const PurchaseRequisitionsPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const { currentOrg, setType, startDate, endDate } = useStore();
  const [prNumber, setPrNumber] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const { data: prItemData, isLoading: isLineItemsLoading } =
    useFetchItemsByPrNumber(currentOrg, prNumber);
  const { data } = useFetchDepartment(currentOrg);

  const lineItems = prItemData?.data?.data;

  // Set export type for requisitions
  useEffect(() => {
    setType("requisitions");
  }, [setType]);

  const tabNames = [
    "ALL",
    "PENDING",
    "APPROVED",
    "REJECTED",
    "REQUEST_MODIFICATION",
    "SAVED APPROVAL",
  ];

  const { setPr, setIsOpen, setHidePrText, isOpen } = useStore();
  const { error } = useNotify();

  const {
    allRequisitions,
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
    isAllRequisitionsLoading,
  } = useGetRequisitions();
  const {
    selectedItems,
    toggleSelectItem,
    selectAll,
    deselectAll,
    isSelected,
  } = useExportSelected();

  const handleViewRequisition = ({ pr_number, id }: CompletionProps) => {
    if (pr_number && id) {
      setHidePrText(`You are viewing requisition: ${pr_number}`);
      setPr({ pr_number, id });

      setIsOpen(true);
    } else {
      error("Invalid PR Number or ID");
    }
  };

  const toggleRow = (prNumber: string) => {
    // Only allow one expanded row at a time
    if (expandedRows.length > 0 && !expandedRows.includes(prNumber)) {
      setExpandedRows([]);
    }

    setPrNumber(prNumber);
    setExpandedRows((prev) => (prev.includes(prNumber) ? [] : [prNumber]));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filterType: string, value: string) => {
    if (filterType === "department") {
      setDepartmentFilter(value);
    }
    // Add other filter type handlers as needed
  };

  const filterRequisitions = () => {
    const requisitions = (() => {
      switch (activeTab) {
        case "ALL":
          return allRequisitions;
        case "PENDING":
          return pendingRequisitions;
        case "APPROVED":
          return approvedRequisitions;
        case "REJECTED":
          return rejectedRequisitions;
        case "REQUEST_MODIFICATION":
          return requestRequisitions;
        case "SAVED APPROVAL":
          return savedRequisitions;
        default:
          return [];
      }
    })();
    return requisitions.filter((req) => {
      const matchesSearch =
        !searchQuery ||
        req.pr_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.department?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        req.requestor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.request_description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Department filter
      const matchesDepartment =
        departmentFilter === "all" ||
        (req.department?.name &&
          req.department.name.toLowerCase() === departmentFilter.toLowerCase());

      // Date range filter
      let matchesDateRange = true;
      if (startDate || endDate) {
        const createdDate = new Date(req.created_at);

        if (startDate) {
          const filterStartDate = new Date(startDate);
          matchesDateRange = matchesDateRange && createdDate >= filterStartDate;
        }

        if (endDate) {
          const filterEndDate = new Date(endDate);
          // Set time to end of day for end date
          filterEndDate.setHours(23, 59, 59, 999);
          matchesDateRange = matchesDateRange && createdDate <= filterEndDate;
        }
      }

      return matchesSearch && matchesDepartment && matchesDateRange;
    });
  };

  const filterOptions = [
    {
      label: "Department",
      value: "department",
      options: [
        { label: "All", value: "all" },
        ...(data?.data?.departments.map((department) => ({
          label: department.name,
          value: department.name,
        })) || []),
      ],
    },
  ];

  const handleSelectAll = () => {
    const filteredReqs = filterRequisitions();
    if (selectedItems.length === filteredReqs.length) {
      deselectAll();
    } else {
      selectAll(filteredReqs.map((req) => req.id));
    }
  };

  const headers: string | any = [
    <ExportCheckBox
      handleSelectAll={handleSelectAll}
      selectedItems={selectedItems}
      items={filterRequisitions()}
      key="select-all"
    />,
    "PR No.",
    "PR date",
    "Supplier",
    "Department",
    "Requestor",
    "Total Qty",
    "Estimated Cost",
    "Needed By",
    "Status",
    "Action",
    "Line Items",
  ];

  const renderRow = (req: Requisition, index: number) => (
    <RequisitionRow
      key={req.id}
      req={req}
      index={index}
      isSelected={isSelected}
      toggleSelectItem={toggleSelectItem}
      handleViewRequisition={handleViewRequisition}
      toggleRow={toggleRow}
      expandedRows={expandedRows}
      lineItems={lineItems}
      isLineItemsLoading={isLineItemsLoading}
      activeTab={activeTab}
      headersLength={headers.length}
    />
  );

  const tabnamesToRender = tabNames.map((name) =>
    name === "REQUEST_MODIFICATION" ? "REQUEST MODIFICATION" : name
  );

  const getTabCount = (tabName: string) => {
    switch (tabName) {
      case "ALL":
        return allRequisitions.length;
      case "PENDING":
        return pendingRequisitions.filter((req) => req.status === "PENDING")
          .length;
      case "APPROVED":
        return approvedRequisitions.filter((req) => req.status === "APPROVED")
          .length;
      case "REJECTED":
        return rejectedRequisitions.filter((req) => req.status === "REJECTED")
          .length;
      case "REQUEST_MODIFICATION":
        return requestRequisitions.filter(
          (req) => req.status === "REQUESTED MODIFICATION"
        ).length;
      case "SAVED APPROVAL":
        return savedRequisitions.length;
      default:
        return 0;
    }
  };

  const tabCounts = tabNames.map(getTabCount);

  if (
    isLoadingSavedRequisitions ||
    isPendingLoading ||
    isApprovedLoading ||
    isRejectedLoading ||
    isRequestLoading ||
    isAllRequisitionsLoading
  )
    return <TableSkeleton />;

  return (
    <>
      <InitializeRequisition />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-1">
          Purchase Requisitions
        </h1>
        <p className="text-gray-600">
          Manage and track all purchase requisitions in your organization
        </p>
      </div>

      <ActionBar
        onSearch={handleSearch}
        showDate
        type="requisitions"
        filterOptions={filterOptions}
        onFilter={handleFilter}
      />

      <Tabs
        tabNames={tabnamesToRender}
        active={activeTab}
        setActive={setActiveTab}
        counts={tabCounts}
      />

      {selectedItems.length > 0 && (
        <div className="mb-4 mt-4">
          <SelectedItemForExport
            selectedItems={selectedItems}
            items={filterRequisitions()}
            deselectAll={deselectAll}
            entityType="requisitions"
          />
        </div>
      )}

      <TableShadowWrapper>
        <table className="w-full table-auto text-center border-collapse">
          <TableHead headers={headers} />
          <TableBody
            data={filterRequisitions()}
            renderRow={renderRow}
            emptyMessage="No requisitions found for this status."
          />
        </table>
      </TableShadowWrapper>

      {isOpen && <ViewRequisitions />}
    </>
  );
};

export default PurchaseRequisitionsPage;
