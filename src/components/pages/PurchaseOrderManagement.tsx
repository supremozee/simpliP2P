"use client";
import React, { useState, useEffect, useMemo } from "react";
import Tabs from "../molecules/Tabs";
import TableSkeleton from "../atoms/Skeleton/Table";
import Pagination from "../molecules/Pagination";
import useFetchAllOrders from "@/hooks/useFetchAllOrders";
import useStore from "@/store";
import ActionBar from "../molecules/ActionBar";
import TableRow from "../molecules/TableRow";
import TableHead from "../atoms/TableHead";
import TableBody from "../atoms/TableBody";
import CreatePurchaseOrder from "../organisms/CreatePurchaseOrder";
import { Order } from "@/types";

const PurchaseOrdersManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const itemsPerPage = 10;
  const { currentOrg, setIsOpen, isOpen } = useStore();
  const headers = ["PO Number", "Supplier", "Date Created", "Total Cost", "Status"];
  const { data, isLoading } = useFetchAllOrders(currentOrg);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

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

      // Filter by tab
      if (activeTab !== "ALL") {
        orders = orders.filter(order => order.status === activeTab);
      }

      // Filter by search - include total_amount in the search
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
    return (
      <TableRow
        key={order.po_number}
        data={[
          order.po_number,
          order.supplier.full_name,
          new Date(order.created_at).toLocaleDateString(),
          Number(order.total_amount).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
          }),
          order.status,
        ]}
        index={index}
      />
    );
  };

  const tabCounts = tabNames.map(getTabCount);
  
  if (isLoading) return <TableSkeleton />;

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
        <div className="p-2">
          <ActionBar
            buttonName="Create New Purchase Order"
            onClick={() => setIsOpen(true)}
            type="orders"
            showDate
            onSearch={handleSearch}
            filterOptions={filterOptions}
            onFilter={handleFilter}
          />
        </div>
        <table className="w-full border-collapse">
          <TableHead headers={headers} />
          <TableBody
            data={currentOrders}
            renderRow={renderRow}
            emptyMessage={
              searchQuery || Object.keys(activeFilters).length > 0
                ? "No purchase orders found matching your criteria."
                : "No purchase orders found."
            }
          />
        </table>
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