"use client";
import React, { useState } from 'react';
import useFetchProducts from '@/hooks/useFetchProducts';
import useStore from '@/store';
import TableSkeleton from '../atoms/Skeleton/Table';
import ErrorComponent from '../molecules/ErrorComponent';
import { MdEdit } from 'react-icons/md';
import { FaTimes } from 'react-icons/fa';
import useDeleteProduct from '@/hooks/useDeleteProduct';
import ConfirmDelete from '../molecules/ConfirmDelete';
import CreateProduct from '../organisms/CreateProduct';
import UpdateProduct from '../organisms/UpdateProduct';
import TableHead from '../atoms/TableHead';
import TableBody from '../atoms/TableBody';
import TableRow from '../molecules/TableRow';
import { FetchProduct } from '@/types';

const InventoryManagement = () => {
  const { currentOrg, setProductId, productId } = useStore();
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

  if (isLoading) return <TableSkeleton />;
  if (isError) return <ErrorComponent text="No Inventory found" />;

  const products = data?.data || [];
  const tableHeaders = [
    'Product Name',
    'Description',
    'Unit Price',
    'Quantity',
    'Stock Alert Level',
    'Category',
    'Actions'
  ];

  const renderRow = (product: FetchProduct, index: number) => {
    const rowData = [
      product?.name,
      product.description,
      `${product.currency}${product.unitPrice}`,
      product.stockQty,
      product.stockQtyAlert,
      product.category?.name ?? null
    ];

    return (
      <TableRow
        key={product.id}
        data={rowData}
        index={index}
      >
        <div className='flex items-center justify-center gap-4'>
          <button
            onClick={() => handleOpenUpdateProductModal(product.id)}
            className="flex justify-center items-center w-6 h-6 text-white px-0 py-0 rounded-full bg-primary"
          >
            <MdEdit size={12} />
          </button>
          <button
            onClick={() => handleOpenConfirmDeleteModal(product.id)}
            className="text-white px-0 py-0 rounded-full flex justify-center items-center w-6 h-6 bg-red-700"
          >
            <FaTimes size={12} />
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
      <div className='flex justify-end mb-5 w-full'>
        <CreateProduct />
      </div>
      <div className="bg-white p-4 h-auto rounded-[5px]">
        <div className="overflow-auto max-h-[400px] relative">
          <table className="w-full border overflow-x-auto">
            <TableHead headers={tableHeaders} />
            <TableBody
              data={products}
              renderRow={renderRow}
              emptyMessage="No products found"
            />
          </table>
        </div>
      </div>
    </>
  );
};

export default InventoryManagement;
