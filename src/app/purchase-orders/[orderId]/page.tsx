"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import useViewPO from '@/hooks/useViewPO';
import LoaderSpinner from '@/components/atoms/LoaderSpinner';
import { format_price } from '@/utils/helpers';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import { FaDownload, FaPrint, FaFileInvoice } from 'react-icons/fa';
import Image from 'next/image';
import TableHead from '@/components/atoms/TableHead';
import TableBody from '@/components/atoms/TableBody';
import TableRow from '@/components/molecules/TableRow';
import { ViewPOItem } from '@/types';

const PurchaseOrderDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const resourceToken = searchParams.get('x-resource-token') || "";
  const [isLoading, setIsLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  
  const { data: poData, isLoading: isFetchingPO, error } = useViewPO(resourceToken, orderId);
  
  useEffect(() => {
    if (resourceToken) {
      setTokenValid(true);
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [resourceToken]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  if (isLoading || isFetchingPO) {
    return <LoaderSpinner size="lg" text="Loading purchase order details..." />;
  }

  if (!tokenValid) {
    return (
      <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg border border-yellow-300 my-5">
        <h3 className="text-lg font-semibold mb-2">Invalid Access Token</h3>
        <p>The resource token provided is invalid or has expired.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-300 my-5">
        <h3 className="text-lg font-semibold mb-2">Error</h3>
        <p>{error.message || "Failed to load purchase order details"}</p>
      </div>
    );
  }

  // Use the data from API response, or fallback to default if needed
  const po = poData || {
    id: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    po_number: "",
    total_amount: "0",
    currency: "NGN",
    status: "PENDING",
    attachment: null,
    items: [],
    supplier: {
      id: "",
      full_name: "",
      phone: "",
      email: "",
      bank_details: null,
      address: null
    },
    organisation: {
      name: "SimpliP2P",
      logo: "/big-logo.png"
    }
  };

  const items = po.items && po.items.length > 0 ? po.items : [];

  const orderDate = new Date(po.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const totalAmount = items.reduce((sum: number, item: ViewPOItem) => {
    const quantity = item.pr_quantity || 0;
    return sum + (Number(item.unit_price) * quantity);
  }, 0) || parseFloat(po.total_amount) || 0;

  const itemHeaders = ["S/N", "Item Code", "Description", "Model/Type", "QTY", "Unit", "Unit Price", "Total"];

  const renderItemRow = (item: ViewPOItem, index: number) => {
    const quantity = item.pr_quantity || 0;
    const total = Number(item.unit_price) * quantity;
    
    return (
      <TableRow
        key={item.id || `item-${index}`}
        data={[
          (index + 1).toString(),
          item.id?.substring(0, 8) || '-',
          item.item_name || "No description",
          "Standard", // Default as model/type is not in the response
          quantity.toString(),
          'PCS', // Default unit as it's not in the response
          format_price(Number(item.unit_price), po.currency),
          format_price(total, po.currency),
        ]}
        index={index}
        hasActions={false}
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg print:shadow-none">
      <div className="flex justify-end gap-4 mb-6 print:hidden">
        <Button 
          onClick={handlePrint} 
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
        >
          <FaPrint />
          <span>Print</span>
        </Button>
        <Button 
          onClick={handleDownload} 
          className="px-4 py-2 bg-secondary text-white rounded-lg flex items-center gap-2"
        >
          <FaDownload />
          <span>Download PDF</span>
        </Button>
      </div>

      {/* Purchase Order Header */}
      <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex-shrink-0">
            <Image
              src={po.organisation?.logo || "/logo-black.png"} 
              alt="Company Logo"
              className="h-16 w-auto" 
              width={100}
              height={100}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{po.organisation?.name || "SimpliP2P Organization"}</h1>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-right"
        >
          <h2 className="text-3xl font-bold text-primary">PURCHASE ORDER</h2>
          <p className="text-xl text-gray-700">PO #{po.po_number}</p>
        </motion.div>
      </div>

      {/* PO Info and Vendor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* PO Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Order Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PO Number:</span>
              <span className="font-medium">{po.po_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                po.status === "COMPLETED" ? "text-green-600" : 
                po.status === "PENDING" ? "text-yellow-600" : 
                po.status === "CANCELLED" ? "text-red-600" : "text-blue-600"
              }`}>
                {po.status}
              </span>
            </div>
          </div>
        </motion.div>
        
        {/* Vendor Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-green-700 border-b border-green-200 pb-2">Vendor Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Supplier:</span>
              <span className="font-medium">{po.supplier?.full_name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{po.supplier?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{po.supplier?.phone || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bank Name:</span>
              <span className="font-medium">{po.supplier?.bank_details?.bank_name|| "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Number:</span>
              <span className="font-medium">{po.supplier?.bank_details?.account_number || "N/A"}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Items Table */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <FaFileInvoice className="text-primary text-xl" />
          <h3 className="text-xl font-semibold text-gray-800">Order Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <TableHead headers={itemHeaders} />
            <TableBody
              data={items}
              renderRow={renderItemRow}
              emptyMessage="No items found for this purchase order"
            />
          </table>
        </div>
      </motion.div>

      {/* Totals */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-end mt-8"
      >
        <div className="w-full max-w-md">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-medium">{format_price(totalAmount, po.currency)}</span>
            </div>
            <div className="flex justify-between pt-2 mt-2 border-t border-gray-300">
              <span className="font-bold text-gray-800">Total:</span>
              <span className="font-bold text-xl text-primary">
                {format_price(Number(po.total_amount), po.currency)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500 print:fixed print:bottom-4 print:left-0 print:right-0">
        <p>This purchase order is subject to our terms and conditions.</p>
        <p className="mt-1">Generated from SimpliP2P on {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;