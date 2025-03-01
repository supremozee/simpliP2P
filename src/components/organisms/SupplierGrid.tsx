import React from 'react';
import useFetchSuppliers from '@/hooks/useFetchSuppliers';
import useStore from '@/store';
import Card from '../atoms/Card';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IoTrendingUp } from 'react-icons/io5';
import SupplierDetails from './SupplierDetails';
import { cn } from '@/utils/cn';
import useUserPermissions from '@/hooks/useUserPermissions';
import Button from '../atoms/Button';

const SupplierGrid = () => {
  const { currentOrg, supplierId, setSupplierId } = useStore();
  const { data: supplierData, isLoading } = useFetchSuppliers(currentOrg);
  const { checkPermission } = useUserPermissions();

  const handleSupplierClick = (id: string) => {
    setSupplierId(id);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-[200px] animate-pulse bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      "grid gap-6",
      supplierId ? "grid-cols-[1fr,400px]" : "grid-cols-1"
    )}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {supplierData?.data?.map((supplier) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={cn(
                "p-6 cursor-pointer transition-all duration-200",
                supplierId === supplier.id ? "ring-2 ring-primary/20 shadow-lg" : "hover:shadow-md"
              )}
              onClick={() => handleSupplierClick(supplier.id)}
            >
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={ '/testsupplier.png'}
                    alt={supplier.full_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {supplier.full_name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{supplier.email}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium text-gray-700">
                    {supplier.category?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Rating:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">
                      {supplier.rating || 'N/A'}
                    </span>
                    {supplier.rating && (
                      <IoTrendingUp className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button
                      disabled= {!checkPermission(['update_suppliers', 'manage_suppliers'])}
                      onClick={() =>{
                        handleSupplierClick(supplier.id);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        // Add delete handler here
                      }}
                      disabled={!checkPermission(['delete_suppliers', 'manage_suppliers'])}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {supplierId && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <SupplierDetails />
        </motion.div>
      )}
    </div>
  );
};

export default SupplierGrid; 