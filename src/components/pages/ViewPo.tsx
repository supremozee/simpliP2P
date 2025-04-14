"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import useViewPO from '@/hooks/useViewPO';
import LoaderSpinner from '@/components/atoms/LoaderSpinner';
import { format_price } from '@/utils/helpers';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import { FaDownload, FaPrint } from 'react-icons/fa';
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
      payment_term: "",
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
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg print:shadow-none print:p-0 print:max-w-none">
      {/* Header with Company Info and PO Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left side - Company logo and info */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-left"
        >
          <div className="flex-shrink-0 mb-4">
            <Image
              src={po.organisation?.logo || "/logo-black.png"} 
              alt="Company Logo"
              className="object-cover" 
              width={150}
              height={80}
            />
          </div>
          <div className="mb-2">
            <h2 className="text-xl font-bold text-gray-800">{po.organisation?.name || "SimpliP2P Organization"}</h2>
            <p className="text-sm text-gray-600">123 Business Avenue, Suite 101</p>
            <p className="text-sm text-gray-600">Business City, BZ 12345</p>
            <p className="text-sm text-gray-600">Tel: <span className="font-medium">+1 (555) 123-4567</span></p>
            <p className="text-sm text-gray-600">Email: <span className="font-medium">info@simplip2p.com</span></p>
            <p className="text-sm text-gray-600 mt-2"><span className="font-semibold">Payment Terms:</span> <span className="font-medium">{po.supplier.payment_term}</span></p>
          </div>
        </motion.div>
        
        {/* Right side - PO Details */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-right"
        >
          <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary inline-block">
            <h1 className="text-3xl font-bold text-primary mb-4">PURCHASE ORDER</h1>
            <div className="text-left space-y-2">
              <p className="text-gray-600"><span className="font-semibold">Date:</span> <span className="font-medium">{orderDate}</span></p>
              <p className="text-gray-600"><span className="font-semibold">PO No:</span> <span className="font-medium">{po.po_number}</span></p>
              <p className="text-gray-600"><span className="font-semibold">Bill to Email:</span> <span className="font-medium">{po.supplier?.email || "N/A"}</span></p>
              <p className="text-gray-600"><span className="font-semibold">Project:</span> <span className="font-medium">Standard Procurement</span></p>
              <p className="text-gray-600"><span className="font-semibold">Status:</span> 
                <span className={`ml-1 font-bold ${
                  po.status === "COMPLETED" ? "text-green-600" : 
                  po.status === "PENDING" ? "text-yellow-600" : 
                  po.status === "CANCELLED" ? "text-red-600" : "text-blue-600"
                }`}>
                  {po.status}
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Supplier and Ship To Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Supplier Info */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Supplier:</h3>
          <div>
            <p className="font-bold text-gray-800">{po.supplier?.full_name || "N/A"}</p>
            <p className="text-gray-600">{po.supplier?.address?.street || "N/A"}</p>
            <p className="text-gray-600">
              {po.supplier?.address?.city || "N/A"}, {po.supplier?.address?.state || "N/A"} {po.supplier?.address?.zip_code || ""}
            </p>
            <p className="text-gray-600">{po.supplier?.address?.country || "N/A"}</p>
            <p className="text-gray-600"><span className="font-medium">Email:</span> {po.supplier?.email || "N/A"}</p>
            <p className="text-gray-600"><span className="font-medium">Phone:</span> {po.supplier?.phone || "N/A"}</p>
          </div>
        </motion.div>
        
        {/* Ship To */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">Ship To:</h3>
          <div>
            <p className="font-bold text-gray-800">{po.organisation?.name || "SimpliP2P Organization"}</p>
            <p className="text-gray-600">456 Warehouse Street</p>
            <p className="text-gray-600">Receiving Dept, Floor 2</p>
            <p className="text-gray-600">Business City, BZ 12345</p>
            <p className="text-gray-600 mt-2"><span className="font-semibold">Delivery Terms:</span> <span className="font-medium">FOB Destination</span></p>
            <p className="text-gray-600"><span className="font-semibold">Required By:</span> <span className="font-medium">ASAP</span></p>
          </div>
        </motion.div>
      </div>

      {/* Items Table */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
          Order Items
        </h3>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
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

      {/* Order Summary */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Payment Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex-1 order-2 md:order-1"
        >
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-full">
            <h3 className="text-sm uppercase font-semibold text-gray-600 mb-3">Bank Details</h3>
            <div className="space-y-1 text-gray-600">
              <p><span className="font-semibold">Bank:</span> <span className="font-medium">{po.supplier?.bank_details?.bank_name || "N/A"}</span></p>
              <p><span className="font-semibold">Account Number:</span> <span className="font-medium">{po.supplier?.bank_details?.account_number || "N/A"}</span></p>
              <p><span className="font-semibold">Account Name:</span> <span className="font-medium">{po.supplier?.bank_details?.account_name || "N/A"}</span></p>
            </div>
            
            <h3 className="text-sm uppercase font-semibold text-gray-600 mb-3 mt-4">Terms & Conditions</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>All prices are in <span className="font-medium">{po.currency || 'the specified currency'}</span>.</li>
              <li>Payment is due within <span className="font-medium">30 days</span> of receipt.</li>
              <li>Please reference PO #<span className="font-medium">{po.po_number}</span> on all invoices.</li>
              <li>Any changes to this purchase order must be approved in writing.</li>
            </ul>
          </div>
        </motion.div>
        
        {/* Totals */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="md:w-1/3 order-1 md:order-2"
        >
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-3">
              <h3 className="text-sm uppercase font-semibold text-gray-700">Order Summary</h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Subtotal:</span>
                <span className="font-medium">{format_price(totalAmount, po.currency)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Tax (0%):</span>
                <span>{format_price(0, po.currency)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="font-medium">Shipping:</span>
                <span>{format_price(0, po.currency)}</span>
              </div>
              <div className="h-[1px] bg-gray-200 my-2"></div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{format_price(totalAmount, po.currency)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Signatures */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:mb-4"
      >
        <div>
          <div className="border-t-2 border-gray-300 pt-2 mt-6">
            <p className="text-gray-700 font-medium">Authorized By</p>
            <p className="text-xs text-gray-500">Procurement Manager</p>
          </div>
        </div>
        <div>
          <div className="border-t-2 border-gray-300 pt-2 mt-6">
            <p className="text-gray-700 font-medium">Accepted By</p>
            <p className="text-xs text-gray-500">Supplier Signature & Date</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8 print:hidden">
        <Button 
          onClick={handlePrint} 
          className="px-6 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <FaPrint />
          <span>Print</span>
        </Button>
        <Button 
          onClick={handleDownload} 
          className="px-6 py-2 bg-secondary text-white rounded-lg flex items-center gap-2 hover:bg-secondary/90 transition-colors"
        >
          <FaDownload />
          <span>Download PDF</span>
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-sm text-gray-500 print:mt-0 print:fixed print:bottom-4 print:left-0 print:right-0">
        <div className="border-t border-gray-200 pt-4">
          <p>This purchase order was generated electronically and is valid without a signature.</p>
          <p className="mt-1">Generated from SimpliP2P on {new Date().toLocaleDateString()} | Reference: PO-{po.po_number}</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;