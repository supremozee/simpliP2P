"use client";
import React, { useState, useEffect, useMemo, use } from "react";
import Tabs from "../molecules/Tabs";
import TableSkeleton from "../atoms/Skeleton/Table";
import useOrdersData from "@/hooks/useOrdersData";
import useStore from "@/store";
import ActionBar from "../molecules/ActionBar";
import CreatePurchaseOrder from "../organisms/CreatePurchaseOrder";
import ViewOrderModal from "../organisms/ViewOrderModal";
import { Order } from "@/types";
import TableShadowWrapper from "../atoms/TableShadowWrapper";
import useExportSelected from "@/hooks/useExportSelected";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import SelectedItemForExport from "../organisms/SelectedItemForExport";
import ExportCheckBox from "../molecules/ExportCheckBox";
import Pagination from "../molecules/Pagination";
import { format_price } from "@/utils/helpers";

interface PurchaseOrdersManagementProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const PurchaseOrdersManagement: React.FC<PurchaseOrdersManagementProps> = ({
  searchParams,
}) => {
  const resolvedSearchParams = use(searchParams);
  const [activeTab, setActiveTab] = useState("ALL");
  const { currentOrg, setIsOpen, isOpen, setType } = useStore();
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

  // Use the new optimized dual fetch hook
  const { paginatedData, allData, isPaginatedLoading, isAllDataLoading } =
    useOrdersData(currentOrg, currentPage, itemsPerPage);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const {
    selectedItems,
    toggleSelectItem,
    selectAll,
    deselectAll,
    isSelected,
  } = useExportSelected();

  useEffect(() => {
    setType("orders");
  }, [setType]);

  const filterOptions = useMemo(() => {
    if (!allData?.data?.orders) return [];
    const suppliers = [
      ...new Set(
        allData.data.orders.map((order: Order) => order.supplier.full_name)
      ),
    ] as string[];
    return [
      {
        label: "Supplier",
        value: "supplier",
        options: [
          { label: "All", value: "all" },
          ...suppliers.map((supplier: string) => ({
            label: supplier,
            value: supplier,
          })),
        ],
      },
    ];
  }, [allData?.data?.orders]);

  const handleFilter = (filterType: string, value: string) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

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

  const filteredOrders = useMemo(() => {
    if (!paginatedData?.data?.orders) return [];

    let orders = paginatedData.data.orders;

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      orders = orders.filter((order: Order) => {
        const amount = format_price(Number(order.total_amount));
        return (
          order.po_number.toLowerCase().includes(searchLower) ||
          order.supplier.full_name.toLowerCase().includes(searchLower) ||
          amount.toLowerCase().includes(searchLower) ||
          order.total_amount.toString().includes(searchLower)
        );
      });
    }

    Object.entries(activeFilters).forEach(([filterType, filterValue]) => {
      if (filterValue && filterValue !== "all") {
        switch (filterType) {
          case "supplier":
            orders = orders.filter(
              (order: Order) => order.supplier.full_name === filterValue
            );
            break;
          default:
            break;
        }
      }
    });

    return orders;
  }, [paginatedData?.data?.orders, searchQuery, activeFilters]);

  const totalPages = paginatedData?.data?.metadata?.totalPages || 1;

  const currentOrders = filteredOrders;

  const searchAllOrders = useMemo(() => {
    if (!searchQuery || !allData?.data?.orders) return [];

    const searchLower = searchQuery.toLowerCase();
    return allData.data.orders.filter((order: Order) => {
      const amount = format_price(Number(order.total_amount));
      return (
        order.po_number.toLowerCase().includes(searchLower) ||
        order.supplier.full_name.toLowerCase().includes(searchLower) ||
        amount.toLowerCase().includes(searchLower) ||
        order.total_amount.toString().includes(searchLower)
      );
    });
  }, [allData?.data?.orders, searchQuery]);

  const searchResultsCount = searchQuery ? searchAllOrders.length : 0;
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectAll = () => {
    if (currentOrders && currentOrders.length > 0) {
      if (selectedItems.length === currentOrders.length) {
        deselectAll();
      } else {
        selectAll(currentOrders.map((order: Order) => order.id));
      }
    }
  };
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedOrder(null);
  };

  const tabNames = ["ALL", "APPROVED", "PENDING", "REJECTED"];

  const getTabCount = (tabName: string) => {
    if (!allData?.data?.orders) return 0;
    const allOrders = allData.data.orders;
    switch (tabName) {
      case "ALL":
        return allOrders.length;
      case "APPROVED":
        return allOrders.filter((order: Order) => order.status === "APPROVED")
          .length;
      case "PENDING":
        return allOrders.filter((order: Order) => order.status === "PENDING")
          .length;
      case "REJECTED":
        return allOrders.filter((order: Order) => order.status === "REJECTED")
          .length;
      default:
        return 0;
    }
  };

  const renderRow = (order: Order, index: number) => {
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
        <td className="px-4 py-3">
          {order.currency} {format_price(Number(order.total_amount))}
        </td>
        <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
        <td className="px-4 py-3">
          <button
            onClick={() => handleViewOrder(order)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20 transition-colors duration-200"
            aria-label={`View order ${order.po_number}`}
          >
            <IoEyeOutline className="w-4 h-4 mr-1" />
            View
          </button>
        </td>
      </tr>
    );
  };

  const tabCounts = tabNames.map(getTabCount);

  // Show loading if either query is loading
  if (isPaginatedLoading || isAllDataLoading) return <TableSkeleton />;

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
    "Actions",
  ];

  return (
    <>
      {isOpen && <CreatePurchaseOrder />}
      <ViewOrderModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        order={selectedOrder}
      />
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
            activeFilters={activeFilters}
            onClearFilter={handleClearFilter}
            onClearAllFilters={handleClearAllFilters}
          />
        </div>

        {searchQuery && (
          <div className="mx-2 mb-4">
            <div className="px-4 py-2 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
              <p className="text-sm text-blue-700">
                Found {searchResultsCount} results across all orders for &ldquo;
                {searchQuery}&rdquo;
                {searchResultsCount > filteredOrders.length && (
                  <span className="ml-2 text-blue-600">
                    (Showing {filteredOrders.length} on current page)
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

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
          <table className="w-full border-collapse border border-tertiary">
            <thead className="bg-tertiary">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentOrders && currentOrders.length > 0 ? (
                currentOrders.map((order: Order, index: number) =>
                  renderRow(order, index)
                )
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

        <Pagination
          page={String(currentPage)}
          perPage={String(itemsPerPage)}
          hasNextPage={currentPage < totalPages}
          hasPrevPage={currentPage > 1}
          totalPages={totalPages}
        />
      </div>
    </>
  );
};

export default PurchaseOrdersManagement;
