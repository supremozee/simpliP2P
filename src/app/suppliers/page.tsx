"use client";

import React from 'react';
import SupplierGrid from '@/components/organisms/SupplierGrid';
import ActionBar from '@/components/molecules/ActionBar';
import { useState } from 'react';
import CreateSupplier from '@/components/organisms/CreateSupplier';

const SuppliersPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      {showCreateModal && (
        <CreateSupplier 
        />
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Suppliers</h1>
      </div>

      <ActionBar
        buttonName="Create Supplier"
        onClick={() => setShowCreateModal(true)}
        onSearch={() => {}}
        showDate={false}
        type="suppliers"
      />

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-700">
              View and manage your suppliers
            </h2>
          </div>

          <SupplierGrid />
        </div>
      </div>
    </div>
  );
};

export default SuppliersPage; 