"use client";
import React, { useState } from 'react';
import CreateSupplier from '../organisms/CreateSupplier';
import useFetchSuppliers from '@/hooks/useFetchSuppliers';
import useStore from '@/store';
import Loader from '../molecules/Loader';
import Pagination from '../molecules/Pagination';
import UpdateSupplier from '../organisms/UpdateSupplier';
import ActionBar from '../molecules/ActionBar';
import TableHead from '../atoms/TableHead';
import TableBody from '../atoms/TableBody';
import TableRowWithActions from '../organisms/AdminitrativeManagement/TableRowWithAction';
import ConfirmDelete from '../molecules/ConfirmDelete';
import useDeleteSupplier from '@/hooks/useDeleteSupplier';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { BsGrid3X3GapFill, BsListUl } from 'react-icons/bs';
import { Supplier } from '@/types';

interface FilteredSupplier extends Supplier {
  category: {
    name: string;
  };
}

const SupplierPage = () => {
  const { currentOrg, setSupplierId } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 8;

  const { data, isLoading, isError, error } = useFetchSuppliers(currentOrg, currentPage, itemsPerPage);
  const { mutateAsync: deleteSupplier } = useDeleteSupplier(currentOrg);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  
  const headers = ["Name", "Date created", "Category", "Rating", "Actions"];

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleView = () => {
    setView(prev => prev === 'list' ? 'grid' : 'list');
  };

  const toggleUpdateModal = (supplierId: string) => {
    setSupplierId(supplierId);
    setShowUpdateModal(true);
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
      console.error('Error deleting supplier:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filterSuppliers = (suppliers: FilteredSupplier[]) => {
    return suppliers.filter(supplier => {
      const matchesSearch = !searchQuery || 
        supplier.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.category.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  };

  const suppliers = data?.data ? filterSuppliers(data.data) : [];

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500">{error.message}</p>;

  const ViewIcon = view === 'list' ? BsGrid3X3GapFill : BsListUl;

  return (
    <>
      {showModal && <CreateSupplier showModal={showModal} setShowModal={setShowModal} />}
      {showUpdateModal && <UpdateSupplier showModal={showUpdateModal} setShowModal={setShowUpdateModal} />}
      {openConfirmDeleteModal && selectedSupplierId && (
        <ConfirmDelete
          isOpen={openConfirmDeleteModal}
          onClose={() => setOpenConfirmDeleteModal(false)}
          product={{ id: selectedSupplierId, name: suppliers.find(supplier => supplier.id === selectedSupplierId)?.full_name || 'Supplier' }}
          handleConfirm={() => handleDelete(selectedSupplierId)}
        />
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Suppliers</h1>
          <button
            onClick={toggleView}
            className="p-2 rounded-lg z-20 hover:bg-gray-100 transition-colors"
            title={`Switch to ${view === 'list' ? 'grid' : 'list'} view`}
          >
            <ViewIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <ActionBar
          buttonName="Create Supplier"
          onClick={toggleModal}
          onSearch={handleSearch}
          showDate
          type="suppliers"
        />

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-700">
                View and edit supplier details seamlessly
              </h2>
            </div>

            {view === 'list' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <TableHead headers={headers} />
                  <TableBody
                    data={suppliers}
                    renderRow={(supplier, i) => (
                      <TableRowWithActions
                        key={supplier.id}
                        item={supplier}
                        index={i}
                        onEdit={toggleUpdateModal}
                        onDelete={handleOpenConfirmDeleteModal}
                      />
                    )}
                    emptyMessage="No suppliers found."
                  />
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {suppliers.map((supplier) => (
                  <Card 
                    key={supplier.id} 
                    className="h-[200px] flex flex-col bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-800 truncate">
                            {supplier.full_name}
                          </h3>
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {supplier.email}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                          {new Date(supplier.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {supplier.category.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Orders:</span>
                          <span className="text-xs font-medium text-gray-700">0 completed</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
                      <Button
                        onClick={() => toggleUpdateModal(supplier.id)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleOpenConfirmDeleteModal(supplier.id)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {data?.metadata && data.metadata.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={data.metadata.page}
                  totalItems={data.metadata.total}
                  pageSize={data.metadata.pageSize}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplierPage;