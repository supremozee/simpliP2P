/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import useFetchSuppliers from '@/hooks/useFetchSuppliers';
import useStore from '@/store';
import Loader from '../molecules/Loader';
import Pagination from '../molecules/Pagination';
import ActionBar from '../molecules/ActionBar';
import TableHead from '../atoms/TableHead';
import TableBody from '../atoms/TableBody';
import ConfirmDelete from '../molecules/ConfirmDelete';
import useDeleteSupplier from '@/hooks/useDeleteSupplier';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { BsTruck, BsTelephone, BsEnvelope, BsGlobe, BsShield, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { MdLocationPin, MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { Supplier } from '@/types';
import CreateSupplier from '../organisms/CreateSupplier';
import UpdateSupplier from '../organisms/UpdateSupplier';
import TableShadowWrapper from '../atoms/TableShadowWrapper';
import useExportSelected from '@/hooks/useExportSelected';
import SelectedItemForExport from '../organisms/SelectedItemForExport';
import ExportCheckBox from '../molecules/ExportCheckBox';

interface FilteredSupplier extends Supplier {
  category: {
    name: string;
  };
}

const RatingStars = ({ rating = 0 }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const stars = [];
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<BsStarFill key={`full-${i}`} className="text-yellow-400 w-3 h-3" />);
  }
  
  if (hasHalfStar) stars.push(<BsStarHalf key="half" className="text-yellow-400 w-3 h-3" />);
  
  while (stars.length < 5) {
    stars.push(<BsStarFill key={`empty-${stars.length}`} className="text-gray-300 w-3 h-3" />);
  }
  
  return <div className="flex items-center">{stars}</div>;
};

const SupplierPage = () => {
  const { currentOrg, setSupplierId, setIsUpdateSupplierOpen, setType, startDate, endDate } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const itemsPerPage = 8;
  const { data, isLoading, isError, error } = useFetchSuppliers(currentOrg, currentPage, itemsPerPage);
  const { mutateAsync: deleteSupplier } = useDeleteSupplier(currentOrg);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const { 
    selectedItems, 
    toggleSelectItem, 
    selectAll, 
    deselectAll, 
    isSelected, 
  } = useExportSelected();

  useEffect(() => {
    setType('suppliers');
  }, [setType]);

  const toggleView = () => {
    setView(prev => prev === 'list' ? 'grid' : 'list');
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

  const handleFilter = (filterType: string, value: string) => {
    if (filterType === 'category') {
      setCategoryFilter(value);
    } else if (filterType === 'rating') {
      setRatingFilter(value);
    }
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (suppliers && suppliers.length > 0) {
      if (selectedItems.length === suppliers.length) {
        deselectAll();
      } else {
        selectAll(suppliers.map(supplier => supplier.id));
      }
    }
  };

  const filterSuppliers = (suppliers: FilteredSupplier[]) => {
    return suppliers.filter(supplier => {
      // Text search filter
      const matchesSearch = !searchQuery || 
        supplier.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.category.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = categoryFilter === 'all' || 
        supplier.category.name.toLowerCase() === categoryFilter.toLowerCase();

      // Rating filter
      let matchesRating = true;
      if (ratingFilter !== 'all') {
        const rating = Number(supplier.rating) || 0;
        switch(ratingFilter) {
          case '4+':
            matchesRating = rating >= 4;
            break;
          case '3+':
            matchesRating = rating >= 3;
            break;
          case '2+':
            matchesRating = rating >= 2;
            break;
          default:
            matchesRating = true;
        }
      }

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

      return matchesSearch && matchesCategory && matchesRating && matchesDateRange;
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
    "Actions"
  ];

  const filterOptions = [
    { 
      label: "Category", 
      value: "category", 
      options: [
        { label: "All", value: "all" },
        { label: "Manufacturers", value: "manufacturer" },
        { label: "Distributors", value: "distributor" },
        { label: "Service Providers", value: "service" }
      ] 
    },
    { 
      label: "Rating", 
      value: "rating", 
      options: [
        { label: "All Ratings", value: "all" },
        { label: "4+ Stars", value: "4+" },
        { label: "3+ Stars", value: "3+" },
        { label: "2+ Stars", value: "2+" }
      ] 
    }
  ];

  return (
    <>
      <UpdateSupplier />
      {openConfirmDeleteModal && selectedSupplierId && (
        <ConfirmDelete
          isOpen={openConfirmDeleteModal}
          onClose={() => setOpenConfirmDeleteModal(false)}
          product={{ id: selectedSupplierId, name: suppliers.find(supplier => supplier.id === selectedSupplierId)?.full_name || 'Supplier' }}
          handleConfirm={() => handleDelete(selectedSupplierId)}
        />
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 flex items-center">
              <BsTruck className="mr-2" /> Supplier Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your suppliers and vendor information
            </p>
          </div>
           <CreateSupplier create={isCreateOpen} onClick={() => setIsCreateOpen(true)}/>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="w-full">
            <ActionBar
              onSearch={handleSearch}
              showDate
              viewMode
              toggleView={toggleView}
              view={view}
              type="suppliers"
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
          {view === 'list' ? (
             <TableShadowWrapper maxHeight="calc(100vh - 320px)">
              <table className="min-w-full bg-white border-collapse table-auto">
                <TableHead headers={headers} />
                <TableBody
                  data={suppliers}
                  renderRow={(supplier, i) => (
                    <TableRowWithSelectionActions
                      key={supplier.id}
                      item={supplier}
                      index={i}
                      onEdit={handleEdit}
                      onDelete={handleOpenConfirmDeleteModal}
                      isSelected={isSelected}
                      toggleSelectItem={toggleSelectItem}
                    />
                  )}
                  emptyMessage="No suppliers found."
                />
              </table>
           </TableShadowWrapper>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-320px)] overflow-y-auto">
              {suppliers.length > 0 ? suppliers.map((supplier) => (
                <SupplierCardWithSelection 
                  key={supplier.id}
                  supplier={supplier}
                  onEdit={handleEdit}
                  onDelete={handleOpenConfirmDeleteModal}
                  isSelected={isSelected(supplier.id)}
                  toggleSelect={() => toggleSelectItem(supplier.id)}
                />
              )) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <BsShield className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No suppliers found</h3>
                  <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}

          {data?.metadata && data.metadata.totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex justify-center">
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
    </>
  );
};

// New component for table row with selection
const TableRowWithSelectionActions = ({ 
  item, 
  index, 
  onEdit, 
  onDelete,
  isSelected,
  toggleSelectItem
}: { 
  item: any; 
  index: number; 
  onEdit: (id: string) => void; 
  onDelete: (id: string) => void;
  isSelected: (id: string) => boolean;
  toggleSelectItem: (id: string) => void;
}) => {
  const rowData = [
    <div key={`select-${item.id}`} className="flex items-center justify-center">
      <button 
        onClick={() => toggleSelectItem(item.id)}
        className="flex items-center justify-center w-5 h-5 focus:outline-none"
        aria-label={isSelected(item.id) ? "Deselect supplier" : "Select supplier"}
      >
        {isSelected(item.id) ? (
          <MdCheckBox size={20} className="text-primary" />
        ) : (
          <MdCheckBoxOutlineBlank size={20} className="text-gray-400 hover:text-gray-600" />
        )}
      </button>
    </div>,
    item.supplier_no,
    item.full_name,
    new Date(item.created_at).toLocaleDateString(),
    item.category.name,
    <div key={`rating-${item.id}`} className="flex items-center">
      <RatingStars rating={Number(item.rating) || 0} />
      <span className="ml-2 text-xs text-gray-500">{item.rating || 0}/5</span>
    </div>,
    <div key={`actions-${item.id}`} className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onEdit(item.id)}
        className="px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/80 transition-colors"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(item.id)}
        className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Delete
      </button>
    </div>,
  ];

  return (
    <tr className={`border-b border-gray-200 text-center transition-colors ${isSelected(item.id) ? 'bg-blue-50 hover:bg-blue-100' : index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
      {rowData.map((cell, i) => (
        <td key={`cell-${i}`} className="px-4 py-3 text-sm">
          {cell}
        </td>
      ))}
    </tr>
  );
};

// Enhanced SupplierCard with selection functionality
const SupplierCardWithSelection = ({ 
  supplier, 
  onEdit, 
  onDelete,
  isSelected,
  toggleSelect
}: { 
  supplier: FilteredSupplier, 
  onEdit: (id: string) => void, 
  onDelete: (id: string) => void,
  isSelected: boolean,
  toggleSelect: () => void
}) => {
  return (
    <Card className={`flex flex-col bg-white rounded-lg shadow-sm border transition-all duration-200 overflow-hidden h-auto ${isSelected ? 'border-primary bg-blue-50' : 'border-gray-200 hover:shadow-md'}`}>
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <button
              onClick={toggleSelect}
              className="mr-2 flex items-center justify-center focus:outline-none"
            >
              {isSelected ? (
                <MdCheckBox size={20} className="text-primary" />
              ) : (
                <MdCheckBoxOutlineBlank size={20} className="text-gray-400 hover:text-gray-600" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-gray-800 truncate">
                {supplier.full_name}
              </h3>
              <div className="flex items-center mt-1">
                <RatingStars rating={Number(supplier.rating) || 0} />
                <span className="text-xs text-gray-500 ml-2">{supplier.rating || 0}/5</span>
              </div>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            {supplier.category.name}
          </span>
        </div>
        
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center text-xs text-gray-600">
            <BsEnvelope className="w-3 h-3 mr-2 text-gray-400" />
            <span className="truncate">{supplier.email}</span>
          </div>
          {supplier.phone && (
            <div className="flex items-center text-xs text-gray-600">
              <BsTelephone className="w-3 h-3 mr-2 text-gray-400" />
              <span>{supplier.phone}</span>
            </div>
          )}
          {supplier.supplier_no && (
            <div className="flex items-center text-xs text-gray-600">
              <BsGlobe className="w-3 h-3 mr-2 text-gray-400" />
              <span className="truncate">{supplier.supplier_no}</span>
            </div>
          )}
          {supplier.address && (
            <div className="flex items-start text-xs text-gray-600">
              <MdLocationPin className="w-3 h-3 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {[
                  supplier.address.street,
                  supplier.address.city,
                  supplier.address.zip_code && supplier.address.state ? 
                    `${supplier.address.zip_code}, ${supplier.address.state}` : 
                    (supplier.address.zip_code || supplier.address.state)
                ].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            <BsTruck className="w-3 h-3 text-gray-400 mr-1" />
            <span className="text-xs text-gray-500">Since {new Date(supplier.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
        <Button
          onClick={() => onEdit(supplier.id)}
          kind="white"
          padding="xxs"
          radius="xs"
          className="text-xs border border-gray-200"
        >
          Edit
        </Button>
        <Button
          onClick={() => onDelete(supplier.id)}
          padding="xxs" 
          radius="xs"
          className="text-xs bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default SupplierPage;