import React from 'react';
import Card from '../atoms/Card';
import { MdCheckBox, MdCheckBoxOutlineBlank, MdLocationPin } from 'react-icons/md';
import Rating from '../atoms/Rating';
import { BsEnvelope, BsGlobe, BsTelephone, BsTruck } from 'react-icons/bs';
import Button from '../atoms/Button';
import { Supplier } from '@/types';
interface FilteredSupplier extends Supplier {
  category: {
    name: string;
  };
}
const SupplierGrid = ({ 
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
                <Rating rating={Number(supplier.rating) || 0} />
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

export default SupplierGrid; 