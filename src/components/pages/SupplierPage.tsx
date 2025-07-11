/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import useFetchSuppliers from "@/hooks/useFetchSuppliers";
import useStore from "@/store";
import Loader from "../molecules/Loader";
import Pagination from "../molecules/Pagination";
import ActionBar from "../molecules/ActionBar";
import TableHead from "../atoms/TableHead";
import TableBody from "../atoms/TableBody";
import TableRow from "../molecules/TableRow";
import ConfirmDelete from "../molecules/ConfirmDelete";
import useDeleteSupplier from "@/hooks/useDeleteSupplier";
import { BsTruck, BsShield } from "react-icons/bs";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { Category, Supplier } from "@/types";
import CreateSupplier from "../organisms/CreateSupplier";
import UpdateSupplier from "../organisms/UpdateSupplier";
import TableShadowWrapper from "../atoms/TableShadowWrapper";
import useExportSelected from "@/hooks/useExportSelected";
import SelectedItemForExport from "../organisms/SelectedItemForExport";
import ExportCheckBox from "../molecules/ExportCheckBox";
import Rating from "../atoms/Rating";
import SupplierGrid from "../organisms/SupplierGrid";
import Tooltip from "../atoms/Tooltip";
import useFetchCategories from "@/hooks/useFetchCategories";

interface FilteredSupplier extends Supplier {
  category: {
    name: string;
  };
}

const SupplierPage = () => {
  const {
    currentOrg,
    setSupplierId,
    setIsUpdateSupplierOpen,
    setType,
    startDate,
    endDate,
  } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const itemsPerPage = 8;
  const { data, isLoading, isError, error } = useFetchSuppliers(
    currentOrg,
    currentPage,
    itemsPerPage
  );
  const { mutateAsync: deleteSupplier } = useDeleteSupplier(currentOrg);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null
  );

  const { data: categories } = useFetchCategories(currentOrg);
  const {
    selectedItems,
    toggleSelectItem,
    selectAll,
    deselectAll,
    isSelected,
  } = useExportSelected();

  useEffect(() => {
    setType("suppliers");
  }, [setType]);

  const toggleView = () => {
    setView((prev) => (prev === "list" ? "grid" : "list"));
  };

  const handleEdit = (id: string) => {
    setSupplierId(id);
    setIsUpdateSupplierOpen(true);
  };

  const handleOpenConfirmDeleteModal = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setOpenConfirmDeleteModal(true);
  };

  const handleDelete = async (supplierId: string) => {
    try {
      await deleteSupplier({ supplierId });
      setOpenConfirmDeleteModal(false);
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilter = (filterType: string, value: string) => {
    if (filterType === "category") {
      setCategoryFilter(value);
    }
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (suppliers && suppliers.length > 0) {
      if (selectedItems.length === suppliers.length) {
        deselectAll();
      } else {
        selectAll(suppliers.map((supplier) => supplier.id));
      }
    }
  };

  const filterSuppliers = (suppliers: FilteredSupplier[]) => {
    return suppliers.filter((supplier) => {
      // Text search filter
      const matchesSearch =
        !searchQuery ||
        supplier.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.category.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        categoryFilter === "all" ||
        supplier.category.name.toLowerCase() === categoryFilter.toLowerCase();

      // Date range filter
      let matchesDateRange = true;
      if (startDate || endDate) {
        const createdDate = new Date(supplier.created_at);

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

      return matchesSearch && matchesCategory && matchesDateRange;
    });
  };

  const suppliers = data?.data ? filterSuppliers(data.data) : [];

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500">{error.message}</p>;

  const headers: string[] | any = [
    <ExportCheckBox
      handleSelectAll={handleSelectAll}
      items={suppliers}
      selectedItems={selectedItems}
      key={`select-all-${suppliers.length}`}
    />,
    "Supplier Number",
    "Name",
    "Date created",
    "Category",
    "Rating",
    "Actions",
  ];

  const filterOptions = [
    {
      label: "Category",
      value: "category",
      options: [
        { label: "All", value: "all" },
        ...(categories?.data?.categories?.map((category: Category) => ({
          label: category.name,
          value: category.name,
        })) || []),
      ],
    },
  ];

  const renderRow = (supplier: FilteredSupplier, index: number) => (
    <TableRow
      key={supplier.id}
      data={[
        <div
          key={`select-${supplier.id}`}
          className="flex items-center justify-center"
        >
          <button
            onClick={() => toggleSelectItem(supplier.id)}
            className="flex items-center justify-center w-5 h-5 focus:outline-none"
            aria-label={
              isSelected(supplier.id) ? "Deselect supplier" : "Select supplier"
            }
          >
            {isSelected(supplier.id) ? (
              <MdCheckBox size={20} className="text-primary" />
            ) : (
              <MdCheckBoxOutlineBlank
                size={20}
                className="text-gray-400 hover:text-gray-600"
              />
            )}
          </button>
        </div>,
        supplier.supplier_no,
        supplier.full_name,
        new Date(supplier.created_at).toLocaleDateString(),
        supplier.category.name,
        <div
          key={`rating-${supplier.id}`}
          className="flex items-start justify-start"
        >
          <Rating rating={Number(supplier.rating) || 0} />
        </div>,
        <div
          key={`actions-${supplier.id}`}
          className="flex justify-start items-start space-x-2"
        >
          <Tooltip content="Edit supplier">
            <button
              onClick={() => handleEdit(supplier.id)}
              className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/80 transition-colors"
            >
              Edit
            </button>
          </Tooltip>
          <Tooltip content="Delete supplier">
            <button
              onClick={() => handleOpenConfirmDeleteModal(supplier.id)}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </Tooltip>
        </div>,
      ]}
      className={
        isSelected(supplier.id)
          ? "bg-blue-50 hover:bg-blue-100"
          : index % 2 === 0
          ? "bg-white hover:bg-gray-50"
          : "bg-gray-50 hover:bg-gray-100"
      }
      index={index}
    />
  );

  return (
    <>
      <UpdateSupplier />
      {openConfirmDeleteModal && selectedSupplierId && (
        <ConfirmDelete
          isOpen={openConfirmDeleteModal}
          onClose={() => setOpenConfirmDeleteModal(false)}
          product={{
            id: selectedSupplierId,
            name:
              suppliers.find((supplier) => supplier.id === selectedSupplierId)
                ?.full_name || "Supplier",
          }}
          handleConfirm={() => handleDelete(selectedSupplierId)}
        />
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-primary flex items-center">
              <BsTruck className="mr-2" /> Supplier Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your suppliers and vendor information
            </p>
          </div>
          <CreateSupplier
            create={isCreateOpen}
            onClick={() => setIsCreateOpen(true)}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="w-full">
            <ActionBar
              onSearch={handleSearch}
              showDate
              viewMode
              toggleView={toggleView}
              view={view}
              type="supplier's name"
              filterOptions={filterOptions}
              onFilter={handleFilter}
            />
          </div>
        </div>

        {selectedItems.length > 0 && (
          <SelectedItemForExport
            selectedItems={selectedItems}
            items={suppliers}
            deselectAll={deselectAll}
            entityType="suppliers"
          />
        )}

        <div className="bg-white rounded-lg shadow-sm">
          {view === "list" ? (
            <TableShadowWrapper maxHeight="calc(100vh - 320px)">
              <table className="min-w-full bg-white border-collapse table-auto">
                <TableHead headers={headers} />
                <TableBody
                  data={suppliers}
                  renderRow={renderRow}
                  emptyMessage="No suppliers found."
                />
              </table>
            </TableShadowWrapper>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-320px)] overflow-y-auto">
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <SupplierGrid
                    key={supplier.id}
                    supplier={supplier}
                    onEdit={handleEdit}
                    onDelete={handleOpenConfirmDeleteModal}
                    isSelected={isSelected(supplier.id)}
                    toggleSelect={() => toggleSelectItem(supplier.id)}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <BsShield className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium #181819">
                    No suppliers found
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          )}

          {data?.metadata && data.metadata.totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex justify-center">
              <Pagination
                totalPages={data.metadata.totalPages}
                currentPage={data.metadata.page}
                totalItems={data.metadata.total}
                pageSize={data.metadata.pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SupplierPage;
