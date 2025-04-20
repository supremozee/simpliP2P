"use client";
import React, { useState } from 'react';
import useFetchProducts from '@/hooks/useFetchProducts';
import useStore from '@/store';
import TableSkeleton from '../atoms/Skeleton/Table';
import ErrorComponent from '../molecules/ErrorComponent';
import { MdEdit, MdDeleteOutline, MdInventory } from 'react-icons/md';
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

const InventoryManagement = () => {
  const { currentOrg, setProductId, productId } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;
  const { data, isLoading, isError } = useFetchProducts(currentOrg, 1, 10);
  const { deleteProduct } = useDeleteProduct();
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [openUpdateProductModal, setOpenUpdateProductModal] = useState(false);

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
  if (isLoading) return <TableSkeleton />;
  if (isError) return <ErrorComponent text="No Inventory found" />;

  const products = data?.data || [];
  const totalItems = data?.metadata?.total || products.length;
  const tableHeaders = [
    'Product Image',
    'Product Name',
    'Description',
    "Product Code",
    'Unit of Measure',
    'Currency',
    'Unit Price',
    'Quantity',
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

    const rowData = [
      <div 
        key={product.id}
        className='flex items-center justify-center'>
        <Image
          className="rounded-full w-[40px] h-[40px] object-cover border-2 border-gray-200"
          src={product?.image_url || "/logo-black.png"}
          alt={product?.name}
          width={40}
          height={40}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>,
      <div key={`name-${product.id}`} className="font-medium text-gray-800">{product?.name}</div>,
      <div key={`desc-${product.id}`} className="text-sm text-gray-600 max-w-xs truncate">{product.description}</div>,
      <div key={`code-${product.id}`} className="text-sm text-gray-600">{product.productCode}</div>,
      <div key={`uom-${product.id}`} className="text-sm text-gray-600">{product.unitOfMeasure}</div>,
      <div key={`curr-${product.id}`} className="text-sm text-gray-600">{product.currency}</div>,
      <div key={`price-${product.id}`} className="font-medium text-primary">{format_price(Number(product.unitPrice), product.currency)}</div>,
      <div key={`qty-${product.id}`} className={stockStatus}>{product.stockQty}</div>,
      product.stockQtyAlert,
      <div key={`cat-${product.id}`} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs inline-block">{product.category?.name ?? "Uncategorized"}</div>
    ];

    return (
      <TableRow
        key={product.id}
        data={rowData}
        index={index}
        className="hover:bg-gray-50 transition-colors"
      >
        <div className='flex items-center justify-center gap-3'>
          <button
            onClick={() => handleOpenUpdateProductModal(product.id)}
            className="flex justify-center items-center w-8 h-8 text-white px-0 py-0 rounded-full bg-primary hover:bg-primary/80 transition-colors shadow-sm"
            title="Edit product"
          >
            <MdEdit size={14} />
          </button>
          <button
            onClick={() => handleOpenConfirmDeleteModal(product.id)}
            className="text-white px-0 py-0 rounded-full flex justify-center items-center w-8 h-8 bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
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
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <MdInventory className="mr-2" size={24} /> Inventory Management
        </h1>
        <p className="text-gray-600">Manage your product inventory, stock levels, and pricing</p>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-white rounded-lg shadow-sm p-2 flex items-center mr-4">
            <span className="text-sm font-medium mr-2">Total Products:</span>
            <span className="bg-primary text-white px-2 py-1 rounded-md text-sm">{products.length}</span>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-2 flex items-center">
            <span className="text-sm font-medium mr-2">Low Stock Items:</span>
            <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm">
              {products.filter(p => p.stockQty <= p.stockQtyAlert).length}
            </span>
          </div>
        </div>
          <CreateProduct />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="overflow-auto max-h-[600px]">
          <table className="w-full border-collapse border border-[#808080] border-opacity-50">
            <TableHead headers={tableHeaders}  />
            <TableBody
              data={products}
              renderRow={renderRow}
              emptyMessage="No products found in inventory"
            />
          </table>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
          </div>
          
          <Pagination
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