"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Tabs from "../molecules/Tabs";
import TableSkeleton from "../atoms/Skeleton/Table";
import Pagination from "../molecules/Pagination";
import useFetchAllOrders from "@/hooks/useFetchAllOrders";
import useStore from "@/store";
import ActionBar from "../molecules/ActionBar";
import CreatePurchaseOrder from "../organisms/CreatePurchaseOrder";
import { Order } from "@/types";
import TableShadowWrapper from "../atoms/TableShadowWrapper";
import useExportSelected from "@/hooks/useExportSelected";
import { MdCheckBox, MdCheckBoxOutlineBlank, MdFileDownload, MdExpandMore } from 'react-icons/md';
import { FiCheck } from 'react-icons/fi';
import Button from "../atoms/Button";

const PurchaseOrdersManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 10;
  const { currentOrg, setIsOpen, isOpen, setType } = useStore();
  const { data, isLoading } = useFetchAllOrders(currentOrg);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  
  const { 
    selectedItems, 
    isExporting, 
    toggleSelectItem, 
    selectAll, 
    deselectAll, 
    isSelected, 
    exportSelectedItems 
  } = useExportSelected();
  
  // Set export type for orders
  useEffect(() => {
    setType('orders');
  }, [setType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Generate filter options based on available data
  const filterOptions = useMemo(() => {
    if (!data?.data?.orders) return [];

    const suppliers = [...new Set(data.data.orders.map(order => order.supplier.full_name))];
    
    // Define cost ranges with formatted labels
    const costRanges = [
      { min: 0, max: 1000, label: '$0 - $1,000' },
      { min: 1001, max: 5000, label: '$1,001 - $5,000' },
      { min: 5001, max: 10000, label: '$5,001 - $10,000' },
      { min: 10001, max: 50000, label: '$10,001 - $50,000' },
      { min: 50001, max: Infinity, label: 'Above $50,000' }
    ];

    return [
      {
        label: "Supplier",
        value: "supplier",
        options: suppliers.map(supplier => ({
          label: supplier,
          value: supplier
        }))
      },
      {
        label: "Cost Range",
        value: "costRange",
        options: costRanges.map(range => ({
          label: range.label,
          value: `${range.min}-${range.max === Infinity ? '+' : range.max}`
        }))
      }
    ];
  }, [data?.data?.orders]);

  const handleFilter = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (data?.data?.orders) {
      let orders = data.data.orders;

      if (activeTab !== "ALL") {
        orders = orders.filter(order => order.status === activeTab);
      }

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        orders = orders.filter(order => {
          const amount = Number(order.total_amount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          });
          return order.po_number.toLowerCase().includes(searchLower) ||
            order.supplier.full_name.toLowerCase().includes(searchLower) ||
            amount.toLowerCase().includes(searchLower) ||
            order.total_amount.toString().includes(searchLower);
        });
      }

      // Apply active filters
      if (activeFilters.supplier) {
        orders = orders.filter(order => 
          order.supplier.full_name === activeFilters.supplier
        );
      }

      if (activeFilters.costRange) {
        orders = orders.filter(order => {
          const amount = Number(order.total_amount);
          const [minStr, maxStr] = activeFilters.costRange.split('-');
          const min = Number(minStr);
          const max = maxStr === '+' ? Infinity : Number(maxStr);
          return !isNaN(amount) && amount >= min && amount <= max;
        });
      }

      setFilteredOrders(orders);
    }
  }, [data, activeTab, searchQuery, activeFilters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (currentOrders && currentOrders.length > 0) {
      if (selectedItems.length === currentOrders.length) {
        deselectAll();
      } else {
        selectAll(currentOrders.map(order => order.id));
      }
    }
  };

  const totalItems = filteredOrders.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const tabNames = ["ALL", "APPROVED", "PENDING", "REJECTED"];
  const getTabCount = (tabName: string) => {
    const orders = data?.data?.orders || [];
    switch (tabName) {
      case "ALL":
        return orders.length;
      case "APPROVED":
        return orders.filter(order => order.status === "APPROVED").length;
      case "PENDING":
        return orders.filter(order => order.status === "PENDING").length;
      case "REJECTED":
        return orders.filter(order => order.status === "REJECTED").length;
      default:
        return 0;
    }
  };

  const renderRow = (order: Order, index: number) => {
    // Format currency properly
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: order?.currency || 'USD',
      minimumFractionDigits: 2,
    }).format(Number(order.total_amount));
    
    // Status badge styles based on status
    const getStatusBadge = (status: string) => {
      const statusClasses = {
        APPROVED: "bg-green-100 text-green-800 border-green-300",
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
        REJECTED: "bg-red-100 text-red-800 border-red-300",
      };
      
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800 border-gray-300"}`}>
          {status}
        </span>
      );
    };

    return (
      <tr 
        key={order.id} 
        className={`hover:bg-gray-50 transition-colors border-b ${
          isSelected(order.id) ? 'bg-blue-50 hover:bg-blue-100' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
        }`}
      >
        <td className="px-4 py-3">
          <button 
            onClick={() => toggleSelectItem(order.id)}
            className="flex items-center justify-center w-5 h-5 focus:outline-none"
            aria-label={isSelected(order.id) ? "Deselect order" : "Select order"}
          >
            {isSelected(order.id) ? (
              <MdCheckBox size={20} className="text-primary" />
            ) : (
              <MdCheckBoxOutlineBlank size={20} className="text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </td>
        <td className="px-4 py-3">{`${order.po_number?.split("-")[0]}-${order.po_number?.split("-").pop()}`}</td>
        <td className="px-4 py-3">{order.supplier.full_name}</td>
        <td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
        <td className="px-4 py-3">{formattedAmount}</td>
        <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
      </tr>
    );
  };

  const tabCounts = tabNames.map(getTabCount);
  
  if (isLoading) return <TableSkeleton />;

  const headers = [
    <div key="select-all" className="flex items-center justify-center">
      <button 
        onClick={handleSelectAll}
        className="flex items-center justify-center w-5 h-5 focus:outline-none"
        aria-label={selectedItems.length === currentOrders.length ? "Deselect all orders" : "Select all orders"}
      >
        {selectedItems.length > 0 && selectedItems.length === currentOrders.length ? (
          <MdCheckBox size={20} className="text-primary" />
        ) : (
          <MdCheckBoxOutlineBlank size={20} className="text-gray-400" />
        )}
      </button>
    </div>,
    "PO Number", 
    "Supplier", 
    "Date Created", 
    "Total Cost", 
    "Status"
  ];

  return (
    <>
      {isOpen && <CreatePurchaseOrder />}
      <div className="flex justify-between items-center w-full mb-10">
        <Tabs
          tabNames={tabNames}
          active={activeTab}
          setActive={setActiveTab}
          counts={tabCounts}
        />
      </div>
      <div className="rounded-[5px] bg-white pb-4">
        <div className="p-2 flex justify-between items-center">
          <ActionBar
            buttonName="Create New Purchase Order"
            onClick={() => setIsOpen(true)}
            type="orders"
            showDate
            onSearch={handleSearch}
            filterOptions={filterOptions}
            onFilter={handleFilter}
          />
          
          {selectedItems.length > 0 && (
            <div className="flex items-center relative ml-2" ref={exportDropdownRef}>
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="inline-flex justify-center items-center gap-1 bg-primary text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                disabled={isExporting}
              >
                <MdFileDownload size={18} />
                Export {selectedItems.length} {selectedItems.length === 1 ? 'order' : 'orders'}
                <MdExpandMore size={18} />
              </button>
              
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-40 top-10 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        exportSelectedItems('excel', 'orders');
                        setShowExportDropdown(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-900 hover:bg-primary hover:text-white"
                      disabled={isExporting}
                    >
                      <FiCheck className="text-green-500 mr-2" />
                      Excel
                    </button>
                    <button
                      onClick={() => {
                        exportSelectedItems('csv', 'orders');
                        setShowExportDropdown(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-900 hover:bg-primary hover:text-white"
                      disabled={isExporting}
                    >
                      <FiCheck className="text-green-500 mr-2" />
                      CSV
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {selectedItems.length > 0 && (
          <div className="mx-2 bg-blue-50 border border-blue-200 p-3 mb-4 rounded-md text-sm flex items-center justify-between">
            <div className="flex items-center">
              <MdCheckBox size={18} className="text-primary mr-2" />
              <span className="text-gray-800">
                <span className="font-medium">{selectedItems.length}</span> of <span className="font-medium">{filteredOrders.length}</span> orders selected
              </span>
            </div>
            <Button
              onClick={deselectAll}
              className="text-xs bg-white text-gray-700 hover:bg-gray-100"
              padding="xxs"
            >
              Clear selection
            </Button>
          </div>
        )}
        
        <TableShadowWrapper maxHeight="calc(100vh - 320px)">
          <table className="w-full border-collapse border border-[#80808050]">
            <thead className="bg-gray-100">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => renderRow(order, index))
              ) : (
                <tr>
                  <td colSpan={headers.length} className="px-4 py-8 text-center text-gray-500">
                    {searchQuery || Object.keys(activeFilters).length > 0
                      ? "No purchase orders found matching your criteria."
                      : "No purchase orders found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableShadowWrapper>
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default PurchaseOrdersManagement;