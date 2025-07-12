/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo, use } from "react";
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
import Pagination from "../molecules/Pagination";

interface CompletionProps {
  id: string;
  pr_number: string;
}

interface PurchaseRequisitionsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const PurchaseRequisitionsPage: React.FC<PurchaseRequisitionsPageProps> = ({
  searchParams,
}) => {
  const resolvedSearchParams = use(searchParams);
  const [activeTab, setActiveTab] = useState("ALL");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const { currentOrg, setType, startDate, endDate } = useStore();
  const [prNumber, setPrNumber] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );

  const page = resolvedSearchParams?.["page"] ?? "1";
  const perPage = resolvedSearchParams?.["per_page"] ?? "20";
  const currentPage = Math.max(
    1,
    Number(Array.isArray(page) ? page[0] : page) || 1
  );
  const itemsPerPage = Math.max(
    1,
    Number(Array.isArray(perPage) ? perPage[0] : perPage) || 20
  );
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
    allRequisitionsComplete,
    isLoadingSavedRequisitions,
    isPendingLoading,
    isApprovedLoading,
    isRejectedLoading,
    isRequestLoading,
    isAllRequisitionsLoading,
    paginationMetadata,
  } = useGetRequisitions({
    enablePagination: true,
    page: currentPage,
    pageSize: itemsPerPage,
  });
  const {
    selectedItems,
    toggleSelectItem,
    selectAll,
    deselectAll,
    isSelected,
  } = useExportSelected();

  // Generate filter options from departments data
  const filterOptions = useMemo(() => {
    const options = [];

    // Department filter
    if (data?.data?.departments) {
      options.push({
        label: "Department",
        value: "department",
        options: [
          { label: "All", value: "all" },
          ...data.data.departments.map((department: any) => ({
            label: department.name,
            value: department.name,
          })),
        ],
      });
    }

    // Status filter
    options.push({
      label: "Status",
      value: "status",
      options: [
        { label: "All", value: "all" },
        { label: "Pending", value: "PENDING" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
        { label: "Request Modification", value: "REQUESTED MODIFICATION" },
      ],
    });

    return options;
  }, [data?.data?.departments]);

  const handleFilter = (filterType: string, value: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      // If "all" is selected, remove the filter (clear it)
      if (value === "all") {
        delete newFilters[filterType];
      } else {
        newFilters[filterType] = value;
      }

      return newFilters;
    });
  };

  const handleClearFilter = (filterType: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterType];
      return newFilters;
    });
  };

  const handleClearAllFilters = () => {
    setActiveFilters({});
  };

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

  // Enhanced filtering logic with active filters support
  const filterRequisitions = useMemo(() => {
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

    return requisitions.filter((req: Requisition) => {
      // Text search filter
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

      // Apply active filters
      let matchesFilters = true;
      Object.entries(activeFilters).forEach(([filterType, filterValue]) => {
        if (filterValue && filterValue !== "all") {
          switch (filterType) {
            case "department":
              matchesFilters =
                matchesFilters && req.department?.name === filterValue;
              break;
            case "status":
              matchesFilters = matchesFilters && req.status === filterValue;
              break;
            default:
              break;
          }
        }
      });

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
          filterEndDate.setHours(23, 59, 59, 999);
          matchesDateRange = matchesDateRange && createdDate <= filterEndDate;
        }
      }

      return matchesSearch && matchesFilters && matchesDateRange;
    });
  }, [
    activeTab,
    allRequisitions,
    pendingRequisitions,
    approvedRequisitions,
    rejectedRequisitions,
    requestRequisitions,
    savedRequisitions,
    searchQuery,
    activeFilters,
    startDate,
    endDate,
  ]);

  // Search across all requisitions for comprehensive results
  const searchAllRequisitions = useMemo(() => {
    if (!searchQuery) return [];

    const searchLower = searchQuery.toLowerCase();
    return allRequisitionsComplete.filter((req: Requisition) => {
      return (
        req.pr_number.toLowerCase().includes(searchLower) ||
        req.department?.name?.toLowerCase().includes(searchLower) ||
        req.requestor_name.toLowerCase().includes(searchLower) ||
        req.request_description.toLowerCase().includes(searchLower)
      );
    });
  }, [allRequisitionsComplete, searchQuery]);

  // Show search results count
  const searchResultsCount = searchQuery ? searchAllRequisitions.length : 0;

  // Statistics for search results and active filters
  const statsText = useMemo(() => {
    const parts = [];

    if (searchQuery) {
      parts.push(
        `${searchResultsCount} search result${
          searchResultsCount !== 1 ? "s" : ""
        } for "${searchQuery}"`
      );
    }

    if (Object.keys(activeFilters).length > 0) {
      const filterCount = Object.keys(activeFilters).length;
      parts.push(
        `${filterCount} filter${filterCount !== 1 ? "s" : ""} applied`
      );
    }

    return parts.join(" • ");
  }, [searchQuery, searchResultsCount, activeFilters]);

  const handleSelectAll = () => {
    if (selectedItems.length === filterRequisitions.length) {
      deselectAll();
    } else {
      selectAll(filterRequisitions.map((req: Requisition) => req.id));
    }
  };

  const headers: string | any = [
    <ExportCheckBox
      handleSelectAll={handleSelectAll}
      selectedItems={selectedItems}
      items={filterRequisitions}
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
        return allRequisitionsComplete.length;
      case "PENDING":
        return allRequisitionsComplete.filter(
          (req: Requisition) => req.status === "PENDING"
        ).length;
      case "APPROVED":
        return allRequisitionsComplete.filter(
          (req: Requisition) => req.status === "APPROVED"
        ).length;
      case "REJECTED":
        return allRequisitionsComplete.filter(
          (req: Requisition) => req.status === "REJECTED"
        ).length;
      case "REQUEST_MODIFICATION":
        return allRequisitionsComplete.filter(
          (req: Requisition) => req.status === "REQUESTED MODIFICATION"
        ).length;
      case "SAVED APPROVAL":
        return savedRequisitions.length;
      default:
        return 0;
    }
  };

  const tabCounts = tabNames.map(getTabCount);

  // Pagination calculations
  const totalPages = (() => {
    switch (activeTab) {
      case "ALL":
        return paginationMetadata?.allRequisitionsMeta?.totalPages || 1;
      case "PENDING":
        return paginationMetadata?.pendingRequisitionsMeta?.totalPages || 1;
      case "APPROVED":
        return paginationMetadata?.approvedRequisitionsMeta?.totalPages || 1;
      case "REJECTED":
        return paginationMetadata?.rejectedRequisitionsMeta?.totalPages || 1;
      case "REQUEST_MODIFICATION":
        return paginationMetadata?.requestRequisitionsMeta?.totalPages || 1;
      default:
        return 1;
    }
  })();

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
        activeFilters={activeFilters}
        onClearFilter={handleClearFilter}
        onClearAllFilters={handleClearAllFilters}
      />
      {statsText && (
        <div className="mt-2 text-sm text-gray-600">{statsText}</div>
      )}

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
            items={filterRequisitions}
            deselectAll={deselectAll}
            entityType="requisitions"
          />
        </div>
      )}

      <TableShadowWrapper>
        <table className="w-full table-auto text-center border-collapse">
          <TableHead headers={headers} />
          <TableBody
            data={filterRequisitions}
            renderRow={renderRow}
            emptyMessage="No requisitions found for this status."
          />
        </table>
      </TableShadowWrapper>

      {/* Only show pagination for tabs that support it (not SAVED APPROVAL) */}
      {activeTab !== "SAVED APPROVAL" && (
        <Pagination
          page={String(currentPage)}
          perPage={String(itemsPerPage)}
          hasNextPage={currentPage < totalPages}
          hasPrevPage={currentPage > 1}
          totalPages={totalPages}
        />
      )}

      {isOpen && <ViewRequisitions />}
    </>
  );
};

export default PurchaseRequisitionsPage;
