"use client"
import React from 'react'
import SupplierGrid from './SupplierGrid'


const SupplierDetails = () => {

  return (
    <div className="space-y-6">
    
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
         
         <SupplierGrid />
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;