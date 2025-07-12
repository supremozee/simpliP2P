/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import useSuppliersData from "@/hooks/useSuppliersData";
import useStore from "@/store";
import Loader from "../molecules/Loader";
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
import Pagination from "../molecules/Pagination";

interface FilteredSupplier extends Supplier {
  category: {
    name: string;
  };
}

interface SupplierPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const SupplierPage: React.FC<SupplierPageProps> = ({ searchParams = {} }) => {
  const {
    currentOrg,
    setSupplierId,
    setIsUpdateSupplierOpen,
    setType,
    startDate,
    endDate,
  } = useStore();
  const [view, setView] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Extract pagination parameters from URL
  const page = searchParams?.["page"] ?? "1";
  const perPage = searchParams?.["per_page"] ?? "8";
  const currentPage = Math.max(
    1,
    Number(Array.isArray(page) ? page[0] : page) || 1
  );
  const itemsPerPage = Math.max(
    1,
    Number(Array.isArray(perPage) ? perPage[0] : perPage) || 8
  );

  // Use the new optimized dual fetch hook
  const {
    paginatedData,
    allData,
    isPaginatedLoading,
    isAllDataLoading,
    isError,
    error,
  } = useSuppliersData(currentOrg, currentPage, itemsPerPage);

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

  // Generate filter options from all suppliers data
  const filterOptions = useMemo(() => {
    const options = [];

    // Category filter
    if (categories?.data?.categories) {
      options.push({
        label: "Category",
        value: "category",
        options: [
          { label: "All", value: "all" },
          ...categories.data.categories.map((category: Category) => ({
            label: category.name,
            value: category.name,
          })),
        ],
      });
    }

    // Rating filter
    options.push({
      label: "Rating",
      value: "rating",
      options: [
        { label: "All", value: "all" },
        { label: "5 Stars", value: "5" },
        { label: "4+ Stars", value: "4" },
        { label: "3+ Stars", value: "3" },
        { label: "2+ Stars", value: "2" },
        { label: "1+ Stars", value: "1" },
      ],
    });

    return options;
  }, [categories?.data?.categories]);

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

  // Filter suppliers based on search and active filters
  const filteredSuppliers = useMemo(() => {
    if (!paginatedData?.data) return [];

    let suppliers = paginatedData.data;

    // Apply search filter
    if (searchQuery) {
      suppliers = suppliers.filter((supplier: FilteredSupplier) => {
        return (
          supplier.full_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.category.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply active filters
    Object.entries(activeFilters).forEach(([filterType, filterValue]) => {
      if (filterValue && filterValue !== "all") {
        switch (filterType) {
          case "category":
            suppliers = suppliers.filter(
              (supplier: FilteredSupplier) =>
                supplier.category.name === filterValue
            );
            break;
          case "rating":
            suppliers = suppliers.filter((supplier: FilteredSupplier) => {
              const rating = Number(supplier.rating) || 0;
              const targetRating = Number(filterValue);
              return rating >= targetRating;
            });
            break;
          default:
            break;
        }
      }
    });

    // Apply date range filter
    if (startDate || endDate) {
      suppliers = suppliers.filter((supplier: FilteredSupplier) => {
        const createdDate = new Date(supplier.created_at);
        let matchesDateRange = true;

        if (startDate) {
          const filterStartDate = new Date(startDate);
          matchesDateRange = matchesDateRange && createdDate >= filterStartDate;
        }

        if (endDate) {
          const filterEndDate = new Date(endDate);
          filterEndDate.setHours(23, 59, 59, 999);
          matchesDateRange = matchesDateRange && createdDate <= filterEndDate;
        }

        return matchesDateRange;
      });
    }

    return suppliers;
  }, [paginatedData?.data, searchQuery, activeFilters, startDate, endDate]);

  // Search across all suppliers for comprehensive results
  const searchAllSuppliers = useMemo(() => {
    if (!searchQuery || !allData?.data) return [];

    const searchLower = searchQuery.toLowerCase();
    return allData.data.filter((supplier: FilteredSupplier) => {
      return (
        supplier.full_name.toLowerCase().includes(searchLower) ||
        supplier.email.toLowerCase().includes(searchLower) ||
        supplier.category.name.toLowerCase().includes(searchLower)
      );
    });
  }, [allData?.data, searchQuery]);

  // Show search results count
  const searchResultsCount = searchQuery ? searchAllSuppliers.length : 0;

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectAll = () => {
    if (filteredSuppliers && filteredSuppliers.length > 0) {
      if (selectedItems.length === filteredSuppliers.length) {
        deselectAll();
      } else {
        selectAll(
          filteredSuppliers.map((supplier: FilteredSupplier) => supplier.id)
        );
      }
    }
  };

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

  // Show loading if either query is loading
  if (isPaginatedLoading || isAllDataLoading) return <Loader />;
  if (isError)
    return (
      <p className="text-red-500">{error?.message || "An error occurred"}</p>
    );

  const suppliers = filteredSuppliers || [];

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
              activeFilters={activeFilters}
              onClearFilter={handleClearFilter}
              onClearAllFilters={handleClearAllFilters}
            />
            {statsText && (
              <div className="mt-2 text-sm text-gray-600">{statsText}</div>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="mb-4">
            <div className="px-4 py-2 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
              <p className="text-sm text-blue-700">
                Found {searchResultsCount} results across all suppliers for
                &ldquo;
                {searchQuery}&rdquo;
                {searchResultsCount > filteredSuppliers.length && (
                  <span className="ml-2 text-blue-600">
                    (Showing {filteredSuppliers.length} on current page)
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

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

          {paginatedData?.metadata && paginatedData.metadata.totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex justify-center">
              <Pagination
                page={currentPage.toString()}
                perPage={itemsPerPage.toString()}
                hasNextPage={currentPage < paginatedData.metadata.totalPages}
                hasPrevPage={currentPage > 1}
                totalPages={paginatedData.metadata.totalPages}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SupplierPage;
