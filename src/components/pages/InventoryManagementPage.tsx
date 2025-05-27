/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import useFetchProducts from '@/hooks/useFetchProducts';
import useStore from '@/store';
import TableSkeleton from '../atoms/Skeleton/Table';
import ErrorComponent from '../molecules/ErrorComponent';
import { MdEdit, MdDeleteOutline, MdInventory, MdCheckBox, MdCheckBoxOutlineBlank, MdUpload } from 'react-icons/md';
import useDeleteProduct from '@/hooks/useDeleteProduct';
import ConfirmDelete from '../molecules/ConfirmDelete';
import CreateProduct from '../organisms/CreateProduct';
import UpdateProduct from '../organisms/UpdateProduct';
import TableHead from '../atoms/TableHead';
import TableBody from '../atoms/TableBody';
import TableRow from '../molecules/TableRow';
import { FetchProduct } from '@/types';
import { format_price } from '@/utils/helpers';
import Image from 'next/image';
import Pagination from '../molecules/Pagination';
import ActionBar from '../molecules/ActionBar';
import TableShadowWrapper from '../atoms/TableShadowWrapper';
import useExportSelected from '@/hooks/useExportSelected';
import SelectedItemForExport from '../organisms/SelectedItemForExport';
import ExportCheckBox from '../molecules/ExportCheckBox';
import BulkUploadModal from '../organisms/BulkUploadModal';
import Button from '../atoms/Button';

const InventoryManagement = () => {
  const { currentOrg, setProductId, productId } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError } = useFetchProducts(currentOrg, 1, 100);
  const { deleteProduct } = useDeleteProduct();
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [openUpdateProductModal, setOpenUpdateProductModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openBulkUploadModal, setOpenBulkUploadModal] = useState(false);
  const getProducts = data?.data || [];
  
  const { 
    selectedItems, 
    toggleSelectItem, 
    selectAll, 
    deselectAll, 
    isSelected
  } = useExportSelected();
  
  const handleSearch = (search: string) => {
    setSearchQuery(search);
  };
  
  const filterProduct = getProducts.filter(prod => {
    return !searchQuery || 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.productCode?.toLowerCase().includes(searchQuery.toLowerCase()) 
  });
  
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filterProduct.length) {
      deselectAll();
    } else {
      selectAll(filterProduct.map(product => product.id));
    }
  };
  
  if (isLoading) return <TableSkeleton />;
  if (isError) return <ErrorComponent text="No Inventory found" />;

  const products = filterProduct || [];
  const totalItems = data?.metadata?.total || products.length;
  const pageSize = data?.metadata?.pageSize || 100;
  const totalPages = data?.metadata?.totalPages
  
  
  const tableHeaders: string[] | any = [
    <ExportCheckBox
     handleSelectAll={handleSelectAll}
      selectedItems={selectedItems}
      items={products}
    key={`select-all-${products.length}`}
    />,
    'Product Image',
    "Product Code",
    'Product Name',
    "Description",
    'Quantity',
    'Unit of Measure',
    'Unit Price',
    'Currency',
    'Stock Alert Level',
    'Category',
    'Actions'
  ];

  const renderRow = (product: FetchProduct, index: number) => {
    const stockStatus = product.stockQty <= product.stockQtyAlert 
      ? 'text-red-600 font-medium' 
      : product.stockQty <= product.stockQtyAlert * 2 
        ? 'text-amber-600 font-medium' 
        : 'text-green-600 font-medium';
    const image_url = product?.image_url === "https://example.com/image.jpg" ? "/logo-black.png" : product?.image_url;
    const rowData = [
      <div key={`select-${product.id}`} className="flex items-center justify-center">
        <button 
          onClick={() => toggleSelectItem(product.id)}
          className="flex items-center justify-center w-5 h-5 focus:outline-none"
          aria-label={isSelected(product.id) ? "Deselect item" : "Select item"}
        >
          {isSelected(product.id) ? (
            <MdCheckBox size={20} className="text-primary" />
          ) : (
            <MdCheckBoxOutlineBlank size={20} className="text-gray-400 hover:text-gray-600" />
          )}
        </button>
      </div>,
      <div 
        key={product.id}
        className='flex items-center justify-center'>
        <Image
          className="rounded-full w-[40px] h-[40px] border-2 border-gray-200 bg-cover"
          src={image_url || "/logo-black.png"}
          alt={product?.name}
          width={40}
          height={40}
        />
      </div>,
      <div key={`code-${product.id}`} className="text-sm text-gray-600">{product.productCode}</div>,
      <div key={`name-${product.id}`} className="font-medium text-gray-800">{product?.name}</div>,
      <div key={`desc-${product.id}`} className="text-sm text-gray-600 text-wrap">{product.description}</div>,
      <div key={`qty-${product.id}`} className={stockStatus}>{product.stockQty}</div>,
      <div key={`uom-${product.id}`} className="text-sm text-gray-600">{product.unitOfMeasure}</div>,
      <div key={`price-${product.id}`} className="font-medium text-primary">{format_price(Number(product.unitPrice))}</div>,
      <div key={`curr-${product.id}`} className="text-sm text-gray-600">{product.currency}</div>,
      product.stockQtyAlert,
      <div key={`cat-${product.id}`} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs inline-block">{product.category?.name ?? "Uncategorized"}</div>
    ];

    return (
      <TableRow
        key={product.id}
        data={rowData}
        index={index}
        className={`transition-colors ${isSelected(product.id) ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}`}
      >
        <div className='flex items-center justify-center gap-2 sm:gap-3'>
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
            name: products.find(product => product.id === selectedProductId)?.name || 'Product'
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <MdInventory className="mr-2" size={24} /> Inventory Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your product inventory, stock levels, and pricing</p>
        </div>
        <div className='w-full sm:w-auto'>
          <ActionBar
            type='products'
            onSearch={(search) => handleSearch(search)}
          />
        </div>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="bg-white rounded-lg shadow-sm p-2 flex items-center">
            <span className="text-xs sm:text-sm font-medium mr-2">Total Products:</span>
            <span className="bg-primary text-white px-2 py-1 rounded-md text-xs sm:text-sm">{products.length}</span>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-2 flex items-center">
            <span className="text-xs sm:text-sm font-medium mr-2">Low Stock Items:</span>
            <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs sm:text-sm">
              {products.filter(p => p.stockQty <= p.stockQtyAlert).length}
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
            <span className='text-[12px]'>Bulk Upload</span>
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
            items={filterProduct}
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
            totalPages={totalPages || 1}
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default InventoryManagement;