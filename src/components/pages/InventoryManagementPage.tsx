/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useMemo, useEffect } from "react";
import useProductsData from "@/hooks/useProductsData";
import useFetchCategories from "@/hooks/useFetchCategories";
import useStore from "@/store";
import TableSkeleton from "../atoms/Skeleton/Table";
import ErrorComponent from "../molecules/ErrorComponent";
import {
  MdEdit,
  MdDeleteOutline,
  MdInventory,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdUpload,
} from "react-icons/md";
import useDeleteProduct from "@/hooks/useDeleteProduct";
import ConfirmDelete from "../molecules/ConfirmDelete";
import CreateProduct from "../organisms/CreateProduct";
import UpdateProduct from "../organisms/UpdateProduct";
import TableHead from "../atoms/TableHead";
import TableBody from "../atoms/TableBody";
import TableRow from "../molecules/TableRow";
import { FetchProduct, Category } from "@/types";
import { format_price } from "@/utils/helpers";
import Image from "next/image";
import ActionBar from "../molecules/ActionBar";
import TableShadowWrapper from "../atoms/TableShadowWrapper";
import useExportSelected from "@/hooks/useExportSelected";
import SelectedItemForExport from "../organisms/SelectedItemForExport";
import ExportCheckBox from "../molecules/ExportCheckBox";
import BulkUploadModal from "../organisms/BulkUploadModal";
import Button from "../atoms/Button";
import Pagination from "../molecules/Pagination";

interface InventoryManagementProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({
  searchParams = {},
}) => {
  const { currentOrg, setProductId, productId, setType } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );

  // Extract pagination parameters from URL
  const page = searchParams?.["page"] ?? "1";
  const perPage = searchParams?.["per_page"] ?? "20";
  const currentPage = Math.max(
    1,
    Number(Array.isArray(page) ? page[0] : page) || 1
  );
  const itemsPerPage = Math.max(
    1,
    Number(Array.isArray(perPage) ? perPage[0] : perPage) || 20
  );

  // Use the new optimized dual fetch hook
  const {
    paginatedData,
    allData,
    isPaginatedLoading,
    isAllDataLoading,
    isError,
  } = useProductsData(currentOrg, currentPage, itemsPerPage);

  // Fetch categories for filtering
  const { data: categoriesData } = useFetchCategories(currentOrg);

  const { deleteProduct } = useDeleteProduct();
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [openUpdateProductModal, setOpenUpdateProductModal] = useState(false);
  const [openBulkUploadModal, setOpenBulkUploadModal] = useState(false);

  const {
    selectedItems,
    toggleSelectItem,
    selectAll,
    deselectAll,
    isSelected,
  } = useExportSelected();

  useEffect(() => {
    setType("products");
  }, [setType]);

  // Generate filter options from all products data
  const filterOptions = useMemo(() => {
    const options = [];

    // Category filter
    if (categoriesData?.data?.categories) {
      options.push({
        label: "Category",
        value: "category",
        options: [
          { label: "All", value: "all" },
          ...categoriesData.data.categories.map((category: Category) => ({
            label: category.name,
            value: category.name,
          })),
        ],
      });
    }

    // Stock status filter
    options.push({
      label: "Stock Status",
      value: "stockStatus",
      options: [
        { label: "All", value: "all" },
        { label: "In Stock", value: "in_stock" },
        { label: "Low Stock", value: "low_stock" },
        { label: "Out of Stock", value: "out_of_stock" },
      ],
    });

    return options;
  }, [categoriesData?.data?.categories]);

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

  // Filter products based on search and active filters
  const filteredProducts = useMemo(() => {
    if (!paginatedData?.data) return [];

    let products = paginatedData.data;

    // Apply search filter
    if (searchQuery) {
      products = products.filter((prod: FetchProduct) => {
        return (
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.productCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Apply active filters
    Object.entries(activeFilters).forEach(([filterType, filterValue]) => {
      if (filterValue && filterValue !== "all") {
        switch (filterType) {
          case "category":
            products = products.filter(
              (product: FetchProduct) => product.category?.name === filterValue
            );
            break;
          case "stockStatus":
            products = products.filter((product: FetchProduct) => {
              switch (filterValue) {
                case "in_stock":
                  return product.stockQty > product.stockQtyAlert * 2;
                case "low_stock":
                  return (
                    product.stockQty <= product.stockQtyAlert * 2 &&
                    product.stockQty > product.stockQtyAlert
                  );
                case "out_of_stock":
                  return product.stockQty <= product.stockQtyAlert;
                default:
                  return true;
              }
            });
            break;
          default:
            break;
        }
      }
    });

    return products;
  }, [paginatedData?.data, searchQuery, activeFilters]);

  // Search across all products for comprehensive results
  const searchAllProducts = useMemo(() => {
    if (!searchQuery || !allData?.data) return [];

    const searchLower = searchQuery.toLowerCase();
    return allData.data.filter((product: FetchProduct) => {
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.productCode?.toLowerCase().includes(searchLower) ||
        product.category?.name?.toLowerCase().includes(searchLower)
      );
    });
  }, [allData?.data, searchQuery]);

  // Show search results count
  const searchResultsCount = searchQuery ? searchAllProducts.length : 0;

  const handleSearch = (search: string) => {
    setSearchQuery(search);
  };

  const handleDelete = (productId: string) => {
    deleteProduct(currentOrg, productId);
    setOpenConfirmDeleteModal(false);
  };

  const handleOpenUpdateProductModal = (productId: string) => {
    setProductId(productId);
    setOpenUpdateProductModal(true);
  };

  const handleOpenConfirmDeleteModal = (productId: string) => {
    setSelectedProductId(productId);
    setOpenConfirmDeleteModal(true);
  };

  const handleSelectAll = () => {
    if (filteredProducts && filteredProducts.length > 0) {
      if (selectedItems.length === filteredProducts.length) {
        deselectAll();
      } else {
        selectAll(filteredProducts.map((product: FetchProduct) => product.id));
      }
    }
  };

  // Show loading if either query is loading
  if (isPaginatedLoading || isAllDataLoading) return <TableSkeleton />;
  if (isError) return <ErrorComponent text="No Inventory found" />;

  const products = filteredProducts || [];
  const totalPages = paginatedData?.metadata?.totalPages || 1;

  const tableHeaders: string[] | any = [
    <ExportCheckBox
      handleSelectAll={handleSelectAll}
      selectedItems={selectedItems}
      items={products}
      key={`select-all-${products.length}`}
    />,
    "Product Image",
    "Product Code",
    "Product Name",
    "Description",
    "Quantity",
    "Unit of Measure",
    "Unit Price",
    "Currency",
    "Stock Alert Level",
    "Category",
    "Actions",
  ];

  const renderRow = (product: FetchProduct, index: number) => {
    const stockStatus =
      product.stockQty <= product.stockQtyAlert
        ? "text-red-600 font-medium"
        : product.stockQty <= product.stockQtyAlert * 2
        ? "text-amber-600 font-medium"
        : "text-green-600 font-medium";
    const image_url =
      product?.image_url === "https://example.com/image.jpg"
        ? "/logo-black.png"
        : product?.image_url;
    const rowData = [
      <div
        key={`select-${product.id}`}
        className="flex items-center justify-center"
      >
        <button
          onClick={() => toggleSelectItem(product.id)}
          className="flex items-center justify-center w-5 h-5 focus:outline-none"
          aria-label={isSelected(product.id) ? "Deselect item" : "Select item"}
        >
          {isSelected(product.id) ? (
            <MdCheckBox size={20} className="text-primary" />
          ) : (
            <MdCheckBoxOutlineBlank
              size={20}
              className="text-gray-400 hover:text-gray-600"
            />
          )}
        </button>
      </div>,
      <div key={product.id} className="flex items-center justify-center">
        <Image
          className="rounded-full w-[40px] h-[40px] border-2 border-gray-200 bg-cover"
          src={image_url || "/logo-black.png"}
          alt={product?.name}
          width={40}
          height={40}
        />
      </div>,
      <div key={`code-${product.id}`} className="text-sm text-gray-600">
        {product.productCode}
      </div>,
      <div key={`name-${product.id}`} className="font-medium text-primary">
        {product?.name}
      </div>,
      <div
        key={`desc-${product.id}`}
        className="text-sm text-gray-600 text-wrap"
      >
        {product.description}
      </div>,
      <div key={`qty-${product.id}`} className={stockStatus}>
        {product.stockQty}
      </div>,
      <div key={`uom-${product.id}`} className="text-sm text-gray-600">
        {product.unitOfMeasure}
      </div>,
      <div key={`price-${product.id}`} className="font-medium text-primary">
        {format_price(Number(product.unitPrice))}
      </div>,
      <div key={`curr-${product.id}`} className="text-sm text-gray-600">
        {product.currency}
      </div>,
      product.stockQtyAlert,
      <div
        key={`cat-${product.id}`}
        className="px-2 py-1 bg-gray-100 text-primary rounded-full text-xs inline-block"
      >
        {product.category?.name ?? "Uncategorized"}
      </div>,
    ];

    return (
      <TableRow
        key={product.id}
        data={rowData}
        index={index}
        className={`transition-colors ${
          isSelected(product.id)
            ? "bg-blue-50 hover:bg-blue-100"
            : "hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => handleOpenUpdateProductModal(product.id)}
            className="flex justify-center items-center w-7 h-7 sm:w-8 sm:h-8 text-white px-0 py-0 rounded-full bg-primary hover:bg-primary/80 transition-colors shadow-sm"
            title="Edit product"
          >
            <MdEdit size={14} />
          </button>
          <button
            onClick={() => handleOpenConfirmDeleteModal(product.id)}
            className="text-white px-0 py-0 rounded-full flex justify-center items-center w-7 h-7 sm:w-8 sm:h-8 bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
            title="Delete product"
          >
            <MdDeleteOutline size={14} />
          </button>
        </div>
      </TableRow>
    );
  };

  return (
    <>
      {openUpdateProductModal && (
        <UpdateProduct
          showModal={openUpdateProductModal}
          setShowModal={setOpenUpdateProductModal}
          productId={productId}
        />
      )}
      {openConfirmDeleteModal && selectedProductId && (
        <ConfirmDelete
          isOpen={openConfirmDeleteModal}
          onClose={() => setOpenConfirmDeleteModal(false)}
          product={{
            id: selectedProductId,
            name:
              products.find(
                (product: FetchProduct) => product.id === selectedProductId
              )?.name || "Product",
          }}
          handleConfirm={() => handleDelete(selectedProductId)}
        />
      )}
      <BulkUploadModal
        isOpen={openBulkUploadModal}
        onClose={() => setOpenBulkUploadModal(false)}
      />

      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary mb-2 flex items-center">
            <MdInventory className="mr-2" size={24} /> Inventory Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your product inventory, stock levels, and pricing
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <ActionBar
            type="products"
            onSearch={handleSearch}
            filterOptions={filterOptions}
            onFilter={handleFilter}
            activeFilters={activeFilters}
            onClearFilter={handleClearFilter}
            onClearAllFilters={handleClearAllFilters}
          />
        </div>
      </div>

      {searchQuery && (
        <div className="mb-4">
          <div className="px-4 py-2 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
            <p className="text-sm text-blue-700">
              Found {searchResultsCount} results across all products for &ldquo;
              {searchQuery}&rdquo;
              {searchResultsCount > filteredProducts.length && (
                <span className="ml-2 text-blue-600">
                  (Showing {filteredProducts.length} on current page)
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="bg-white rounded-lg shadow-sm p-2 flex items-center">
            <span className="text-xs sm:text-sm font-medium mr-2">
              Total Products:
            </span>
            <span className="bg-primary text-white px-2 py-1 rounded-md text-xs sm:text-sm">
              {allData?.data?.length || 0}
            </span>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-2 flex items-center">
            <span className="text-xs sm:text-sm font-medium mr-2">
              Low Stock Items:
            </span>
            <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs sm:text-sm">
              {allData?.data?.filter(
                (p: FetchProduct) => p.stockQty <= p.stockQtyAlert
              ).length || 0}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setOpenBulkUploadModal(true)}
            kind="white"
            className="flex items-center border border-gray-200 hover:bg-gray-50"
          >
            <MdUpload className="mr-1" />
            <span className="text-[12px]">Bulk Upload</span>
          </Button>
          <div>
            <CreateProduct />
          </div>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="mb-4">
          <SelectedItemForExport
            selectedItems={selectedItems}
            items={filteredProducts}
            deselectAll={deselectAll}
            entityType="products"
          />
        </div>
      )}

      <TableShadowWrapper maxHeight="calc(100vh - 320px)">
        <table className="w-full border-collapse border border-[#808080] border-opacity-50 min-w-[900px]">
          <TableHead headers={tableHeaders} />
          <TableBody
            data={products}
            renderRow={renderRow}
            emptyMessage="No products found in inventory"
          />
        </table>
      </TableShadowWrapper>
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 w-full">
        <div className="w-full items-center">
          <Pagination
            page={String(currentPage)}
            perPage={String(itemsPerPage)}
            hasNextPage={currentPage < totalPages}
            hasPrevPage={currentPage > 1}
            totalPages={totalPages}
          />
        </div>
      </div>
    </>
  );
};

export default InventoryManagement;
