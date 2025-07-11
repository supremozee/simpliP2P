"use client";
import React, { useState, useEffect, useMemo } from "react";
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
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import SelectedItemForExport from "../organisms/SelectedItemForExport";
import ExportCheckBox from "../molecules/ExportCheckBox";

const PurchaseOrdersManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const { currentOrg, setIsOpen, isOpen, setType } = useStore();
  const { data, isLoading } = useFetchAllOrders(currentOrg);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const metadata = data?.data?.metadata || {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  };
  const currentOrders = filteredOrders;
  const {
    selectedItems,
    toggleSelectItem,
    selectAll,
    deselectAll,
    isSelected,
  } = useExportSelected();

  // Set export type for orders
  useEffect(() => {
    setType("orders");
  }, [setType]);

  // Generate filter options based on available data
  const filterOptions = useMemo(() => {
    if (!data?.data?.orders) return [];
    const suppliers = [
      ...new Set(data.data.orders.map((order) => order.supplier.full_name)),
    ];
    return [
      {
        label: "Supplier",
        value: "supplier",
        options: suppliers.map((supplier) => ({
          label: supplier,
          value: supplier,
        })),
      },
    ];
  }, [data?.data?.orders]);

  const handleFilter = (filterType: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  useEffect(() => {
    if (data?.data?.orders) {
      let orders = data.data.orders;

      if (activeTab !== "ALL") {
        orders = orders.filter((order) => order.status === activeTab);
      }

      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        orders = orders.filter((order) => {
          const amount = Number(order.total_amount).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });
          return (
            order.po_number.toLowerCase().includes(searchLower) ||
            order.supplier.full_name.toLowerCase().includes(searchLower) ||
            amount.toLowerCase().includes(searchLower) ||
            order.total_amount.toString().includes(searchLower)
          );
        });
      }

      // Apply active filters
      if (activeFilters.supplier) {
        orders = orders.filter(
          (order) => order.supplier.full_name === activeFilters.supplier
        );
      }

      if (activeFilters.costRange) {
        orders = orders.filter((order) => {
          const amount = Number(order.total_amount);
          const [minStr, maxStr] = activeFilters.costRange.split("-");
          const min = Number(minStr);
          const max = maxStr === "+" ? Infinity : Number(maxStr);
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
        selectAll(currentOrders.map((order) => order.id));
      }
    }
  };
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
        return orders.filter((order) => order.status === "APPROVED").length;
      case "PENDING":
        return orders.filter((order) => order.status === "PENDING").length;
      case "REJECTED":
        return orders.filter((order) => order.status === "REJECTED").length;
      default:
        return 0;
    }
  };

  const renderRow = (order: Order, index: number) => {
    // Format currency properly
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: order?.currency || "USD",
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
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            statusClasses[status as keyof typeof statusClasses] ||
            "bg-gray-100 text-primary border-gray-300"
          }`}
        >
          {status}
        </span>
      );
    };

    return (
      <tr
        key={order.id}
        className={`hover:bg-gray-50 transition-colors border-b ${
          isSelected(order.id)
            ? "bg-blue-50 hover:bg-blue-100"
            : index % 2 === 0
            ? "bg-white"
            : "bg-gray-50/50"
        }`}
      >
        <td className="px-4 py-3">
          <button
            onClick={() => toggleSelectItem(order.id)}
            className="flex items-center justify-center w-5 h-5 focus:outline-none"
            aria-label={
              isSelected(order.id) ? "Deselect order" : "Select order"
            }
          >
            {isSelected(order.id) ? (
              <MdCheckBox size={20} className="text-primary" />
            ) : (
              <MdCheckBoxOutlineBlank
                size={20}
                className="text-gray-400 hover:text-gray-600"
              />
            )}
          </button>
        </td>
        <td className="px-4 py-3">{`${
          order.po_number?.split("-")[0]
        }-${order.po_number?.split("-").pop()}`}</td>
        <td className="px-4 py-3">{order.supplier.full_name}</td>
        <td className="px-4 py-3">
          {new Date(order.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </td>
        <td className="px-4 py-3">{formattedAmount}</td>
        <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
      </tr>
    );
  };

  const tabCounts = tabNames.map(getTabCount);

  if (isLoading) return <TableSkeleton />;

  const headers = [
    <ExportCheckBox
      handleSelectAll={handleSelectAll}
      selectedItems={selectedItems}
      items={filteredOrders}
      key={"export-checkbox"}
    />,
    "PO Number",
    "Supplier",
    "Date Created",
    "Estimated Cost",
    "Status",
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
        </div>

        {selectedItems.length > 0 && (
          <div className="mx-2">
            <SelectedItemForExport
              selectedItems={selectedItems}
              items={filteredOrders}
              deselectAll={deselectAll}
              entityType="orders"
            />
          </div>
        )}

        <TableShadowWrapper maxHeight="calc(100vh - 320px)">
          <table className="w-full border-collapse border border-[#80808050]">
            <thead className="bg-gray-100">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium #181819 uppercase tracking-wider"
                  >
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
                  <td
                    colSpan={headers.length}
                    className="px-4 py-8 text-center text-gray-500"
                  >
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
            totalPages={metadata.totalPages}
            currentPage={currentPage}
            totalItems={metadata.total}
            pageSize={metadata.pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default PurchaseOrdersManagement;
