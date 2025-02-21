"use client";
import React, { useState } from 'react';
import useFetchProducts from '@/hooks/useFetchProducts';
import useStore from '@/store';
import { cn } from '@/utils/cn';
import TableSkeleton from '../atoms/Skeleton/Table';
import ErrorComponent from '../molecules/ErrorComponent';
import { MdEdit } from 'react-icons/md';
import { FaTimes } from 'react-icons/fa';
import useDeleteProduct from '@/hooks/useDeleteProduct';
import ConfirmDelete from '../molecules/ConfirmDelete';
import CreateProduct from '../organisms/CreateProduct';
import UpdateProduct from '../organisms/UpdateProduct';

const TableCell = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={cn(`p-2 border-b border-r py-2 ${className}`)}>{children}</td>
);

const StickyTableCell = ({ children }: { children: React.ReactNode }) => (
  <TableCell className="sticky top-0 bg-white shadow-md">{children}</TableCell>
);

const InventoryManagement = () => {
  const { currentOrg, setProductId, productId } = useStore();
  const { data, isLoading, isError } = useFetchProducts(currentOrg, 1, 10);
  const {deleteProduct} = useDeleteProduct()
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false)
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
  if (isError) {
    return <ErrorComponent text="No Inventory found"/>;
  }
   const products = data?.data || [];
  return (
    <>
    { openUpdateProductModal && <UpdateProduct showModal={openUpdateProductModal} setShowModal={setOpenUpdateProductModal} productId={productId} /> }
    {openConfirmDeleteModal && selectedProductId && (
        <ConfirmDelete
          isOpen={openConfirmDeleteModal}
          onClose={() => setOpenConfirmDeleteModal(false)}
          product={{ id: selectedProductId, name: products.find(product => product.id === selectedProductId)?.name || 'Product' }}
          handleConfirm={() => handleDelete(selectedProductId)}
        />)}
        <div className='flex justify-end mb-5 w-full'>
           { <CreateProduct />}
        </div>
     <div className="bg-white p-4 h-auto rounded-[5px]">
      <div className="overflow-auto max-h-[400px] relative">
        <table className="w-full border overflow-x-auto">
          <thead className="text-primary uppercase text-[12px] font-[700] leading-normal">
            <tr>
              <StickyTableCell>Product Name</StickyTableCell>
              <TableCell>Description</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Stock Alert Level</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={cn(
                  "text-center text-[10px] font-medium",
                  index && index % 2 ? 'bg-tertiary text-black border-r-0' : 'bg-white'
                )}
              >
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.unitPrice}</TableCell>
                <TableCell>{product.stockQty}</TableCell>
                <TableCell>{product.stockQtyAlert}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell className='flex items-center justify-center gap-4'>
                    <button
                     onClick={() => handleOpenUpdateProductModal(product.id)}
                     className="flex justify-center items-center w-6 h-6 text-white px-0 py-0 rounded-full bg-primary"><MdEdit size={12} /></button>
                    <button
                     onClick={() => handleOpenConfirmDeleteModal(product.id)}
                    className="text-white px-0 py-0  rounded-full flex justify-center items-center w-6 h-6 bg-red-700"><FaTimes size={12} /></button>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default InventoryManagement;
