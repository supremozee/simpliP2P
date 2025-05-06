/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Tabs from "../molecules/Tabs";
import TableHead from "../atoms/TableHead";
import TableBody from "../atoms/TableBody";
import TableRow from "../molecules/TableRow";
import useStore from "@/store";
import { Requisition } from "@/types";
import TableSkeleton from "../atoms/Skeleton/Table";
import Button from "../atoms/Button";
import useNotify from "@/hooks/useNotify";
import InitializeRequisition from "../molecules/InitializeRequisition";
import CreateRequisitions from "./CreateRequisitionsModal";
import { format_price } from "@/utils/helpers";
import { cn } from "@/utils/cn";
import { useGetRequisitions } from "@/hooks/useGetRequisition";
import useFetchItemsByPrNumber from "@/hooks/useFetchAllItemsByPrNumber";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import ActionBar from "../molecules/ActionBar";
import TableShadowWrapper from "../atoms/TableShadowWrapper";
import useExportSelected from "@/hooks/useExportSelected";
import SelectedItemForExport from "../organisms/SelectedItemForExport";
import ExportCheckBox from "../molecules/ExportCheckBox";

interface CompletionProps {
  id: string;
  pr_number: string;
}

const PurchaseRequisitionsPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const {currentOrg, setType, startDate, endDate} = useStore();
  const [prNumber, setPrNumber] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const { data: prItemData, isLoading: isLineItemsLoading } = useFetchItemsByPrNumber(currentOrg, prNumber);
  const lineItems = prItemData?.data?.data;
  
  // Set export type for requisitions
  useEffect(() => {
    setType('requisitions');
  }, [setType]);
  
  const expandedHeading = [
    "Item",
    "Quantity",
    "Unit Price",
    "Total Cost",
  ];
  
  const tabNames = [
    "ALL",
    "PENDING",
    "APPROVED",
    "REJECTED",
    "REQUEST_MODIFICATION",
    "SAVED APPROVAL",
  ];
  
  const {setPr, setIsOpen, setHidePrText, isOpen } = useStore();
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
      setHidePrText(`You are viewing requisition ID: ${id}`)
      setPr({ pr_number, id });

      setIsOpen(true);
    } else {
      error("Invalid PR Number or ID");
    }
  };

  const toggleRow = (prNumber: string) => {
    if (expandedRows.length > 0 && !expandedRows.includes(prNumber)) {
      setExpandedRows([]);
    }
    
    setPrNumber(prNumber);
    setExpandedRows(prev =>
      prev.includes(prNumber) ? [] : [prNumber]
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filterType: string, value: string) => {
    if (filterType === 'department') {
      setDepartmentFilter(value);
    }
    // Add other filter type handlers as needed
  };

  const filterRequisitions = () => {
    const requisitions = (() => {
      switch (activeTab)  {
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
    return requisitions.filter(req => {
      const matchesSearch = !searchQuery || 
        req.pr_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.department?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requestor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.request_description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Department filter
      const matchesDepartment = departmentFilter === 'all' || 
        (req.department?.name && req.department.name.toLowerCase() === departmentFilter.toLowerCase());
      
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

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'REQUESTED MODIFICATION':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'SAVED_FOR_LATER':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  const handleSelectAll = () => {
    const filteredReqs = filterRequisitions();
    if (selectedItems.length === filteredReqs.length) {
      deselectAll();
    } else {
      selectAll(filteredReqs.map(req => req.id));
    }
  };
  const headers:string | any = [
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
    <React.Fragment key={`row-${req.id}`}>
      <TableRow
        key={req.id}
        data={[
          <div key={`select-${req.id}`} className="flex items-center justify-center">
            <button 
              onClick={() => toggleSelectItem(req.id)}
              className="flex items-center justify-center w-5 h-5 focus:outline-none"
              aria-label={isSelected(req.id) ? "Deselect requisition" : "Select requisition"}
            >
              {isSelected(req.id) ? (
                <MdCheckBox size={20} className="text-primary" />
              ) : (
                <MdCheckBoxOutlineBlank size={20} className="text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>,
          `${req.pr_number}`,
          new Date(req.created_at.split("T")[0]).toLocaleDateString('en-US', {year:'numeric', month: 'short', day: 'numeric'}),
          req.supplier?.full_name,
          req.department?.name,
          req.requestor_name,
          req.quantity,
          format_price(Number(req.estimated_cost), req.currency, "currency"),
          <span key={`date-${req.id}`} className="whitespace-nowrap">{req.needed_by_date}</span>,
          <span 
            key={`status-${req.id}`} 
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(req.status)}`}
          >
            {req.status}
          </span>,
          <div className="flex w-full justify-center items-center" key={`action-${req.id}`}>
            <Button 
              key={req.id}
              onClick={() => handleViewRequisition({ pr_number: req.pr_number, id: req.id })} 
              className={cn(
                "p-2 px-3 rounded-md transition-colors z-20",
                activeTab === "SAVED APPROVAL" || req.status === "SAVED_FOR_LATER" 
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : req.status === "PENDING" 
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : req.status === "APPROVED" 
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-600 hover:bg-gray-700'
              )}
            >
              <p className="text-white text-xs">
                {(activeTab === "SAVED APPROVAL" || req.status === "SAVED_FOR_LATER") 
                  ? "Complete" 
                  : (activeTab === "REQUEST_MODIFICATION" || req.status === "REQUESTED MODIFICATION") 
                    ? "View Request" 
                    : "View Details"}
              </p>
            </Button>
          </div>,
          <div
            key={`toggle-${req.id}`}
            className="flex justify-center items-center"
          >
            <Button
              className={cn(
                "p-2 rounded-full transition-colors flex items-center justify-center",
                expandedRows.includes(req.pr_number) 
                  ? "bg-secondary/90 hover:bg-secondary" 
                  : "bg-secondary hover:bg-secondary/90"
              )}
              onClick={() => toggleRow(req.pr_number)}
            >
              {expandedRows.includes(req.pr_number) 
                ? <HiChevronUp className="text-white" /> 
                : <HiChevronDown className="text-white" />}
            </Button>
          </div>,
        ]}
        className={`${expandedRows.includes(req.pr_number) ? "border-b-0" : ""} ${isSelected(req.id) ? 'bg-blue-50' : ''}`}
        index={index}
      />
      {expandedRows.includes(req.pr_number) && (
        <motion.tr
          key={`${req.id}-items`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <td colSpan={headers.length} className="bg-gray-50 border-b border-gray-300">
            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className="w-1 h-5 bg-primary mr-2"></div>
                <h3 className="font-semibold text-gray-800">Line Items for {req.pr_number}</h3>
              </div>
              
              {isLineItemsLoading ? (
                <div className="animate-pulse space-y-3 py-2">
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                  <div className="h-12 bg-gray-200 rounded w-full"></div>
                  <div className="h-12 bg-gray-200 rounded w-full"></div>
                </div>
              ) : lineItems && lineItems.length > 0 ? (
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        {expandedHeading.map((header, i) => (
                          <th key={`header-${i}`} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {lineItems.map((item, index) => (
                        <tr key={`line-${item.id || index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 text-sm text-gray-800">{item.item_name}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{item.pr_quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{format_price(item.unit_price, req.currency)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">
                            {format_price((item.unit_price * item.pr_quantity), req.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500">No line items available for this requisition</p>
                </div>
              )}
            </div>
          </td>
        </motion.tr>
      )}
    </React.Fragment>
  );

  const tabnamesToRender = tabNames.map(name =>
    name === "REQUEST_MODIFICATION" ? "REQUEST MODIFICATION" : name
  );

  const getTabCount = (tabName: string) => {
    switch (tabName) {
      case "ALL":
        return allRequisitions.length;
      case "PENDING":
        return pendingRequisitions.filter(req => req.status === "PENDING").length;
      case "APPROVED":
        return approvedRequisitions.filter(req => req.status === "APPROVED").length;
      case "REJECTED":
        return rejectedRequisitions.filter(req => req.status === "REJECTED").length;
      case "REQUEST_MODIFICATION":
        return requestRequisitions.filter(req => req.status === "REQUESTED MODIFICATION").length;
      case "SAVED APPROVAL":
        return savedRequisitions.length;
      default:
        return 0;
    }
  };

  const tabCounts = tabNames.map(getTabCount);

  const filterOptions = [
    { 
      label: "Department", 
      value: "department", 
      options: [
        { label: "All", value: "all" },
        { label: "Engineering", value: "Engineering" },
        { label: "Executive Management", value: "Executive Management" },
        { label: "Operations", value: "Operations" }
      ] 
    }
  ];

  if (
    isLoadingSavedRequisitions ||
    isPendingLoading ||
    isApprovedLoading ||
    isRejectedLoading ||
    isRequestLoading ||
    isAllRequisitionsLoading
  ) return <TableSkeleton />;

  return (
    <>
      <InitializeRequisition />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Purchase Requisitions</h1>
        <p className="text-gray-600">Manage and track all purchase requisitions in your organization</p>
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
        <table className="w-full table-auto border-collapse">
          <TableHead headers={headers} />
          <TableBody
            data={filterRequisitions()}
            renderRow={renderRow}
            emptyMessage="No requisitions found for this status."
          />
        </table>
      </TableShadowWrapper>
      
      {isOpen && <CreateRequisitions />}
    </>
  );
};

export default PurchaseRequisitionsPage;