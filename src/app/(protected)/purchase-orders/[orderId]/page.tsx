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

// Define the item interface based on provided structure
interface Item {
  product_id?: string;
  item_name?: string;
  pr_quantity?: number;
  unit_price: number;
  image_url?: string;
  id?: string;
  description?: string;
  model?: string;
  type?: string;
  quantity?: number;
  unit?: string;
  item_code?: string;
}

const PurchaseOrderDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const resourceToken = searchParams.get('x-resource-token');
  const [isLoading, setIsLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  
  const { data: poData, isLoading: isFetchingPO, error } = useViewPO(orderId);
  
  useEffect(() => {
    if (resourceToken) {
      setTokenValid(true);
    } else if (resourceToken && resourceToken.length > 20) {
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

  const po = poData?.data || {
    id: "ba4bdf96-c121-4c32-a64f-4cce0dbfa17d",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    po_number: "PO-80n2yef7-2504-019",
    total_amount: "15000.00",
    currency: "NGN",
    status: "PENDING",
    attachment: "",
    items: [],
    supplier: {
      name: "Sample Supplier Ltd",
      address: {
        street: "123 Supplier Street",
        city: "Lagos",
        state: "Lagos State",
        country: "Nigeria"
      },
      contact_person: "John Supplier",
      phone: "+234 800 1234 567",
      email: "contact@supplier.com",
    },
    organization: {
      name: "SimpliP2P Organization",
      registration_number: "RC-123456",
      logo: "/big-logo.png"
    },
    shipping_address: {
      location: "Headquarters",
      address: "555 Main Building",
      city: "Lagos",
      state: "Lagos State"
    },
    billing_contact: {
      name: "Finance Department",
      email: "finance@simplip2p.com",
      phone: "+234 800 9876 543"
    },
    payment_terms: "Net 30 days",
    notes: "Please deliver items as soon as possible.",
    terms: "Standard terms and conditions apply. All items must be delivered in good condition.",
    project_name: "2023 Q2 Office Expansion"
  };

  const items = Array.isArray(po.items) && po.items.length > 0 ? po.items : [
    {
      id: "1",
      item_code: "",
      description: "PRIMARY BEAMS – 200 x 133 x 25KG/M Universal Beam (12M Lengths)",
      model: "MILD STEEL",
      quantity: 5,
      unit: "METERS",
      unit_price: 460000
    }
  ];

  const orderDate = new Date(po.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const totalAmount = items.reduce((sum: number, item: Item) => {
    const quantity = item.pr_quantity || item.quantity || 0;
    return sum + (item.unit_price * quantity);
  }, 0) || parseFloat(po.total_amount) || 0;

  const itemHeaders = ["S/N", "Item Code", "Description", "Model/Type", "QTY", "Unit", "Unit Price", "Total"];

  const renderItemRow = (item: Item, index: number) => {
    const quantity = item.pr_quantity || item.quantity || 0;
    const description = item.item_name || item.description || "No description";
    const model = item.model || item.type || "MILD STEEL";
    
    return (
      <TableRow
        key={item.id || `item-${index}`}
        data={[
          (index + 1).toString(),
          item.item_code || item.product_id || '-',
          description,
          model,
          quantity.toString(),
          item.unit || 'PCS',
          format_price(item.unit_price, po.currency),
          format_price(item.unit_price * quantity, po.currency),
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
              src={po.organization?.logo || "/logo-black.png"} 
              alt="Company Logo"
              className="h-16 w-auto" 
              width={100}
              height={100}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{po.organization?.name || "SimpliP2P Organization"}</h1>
            <p className="text-gray-600">RC: {po.organization?.registration_number || "1366973"}</p>
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
              <span className="text-gray-600">Created By:</span>
              <span className="font-medium">{po.created_by?.name || "Admin User"}</span>
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
            <div className="flex justify-between">
              <span className="text-gray-600">Project:</span>
              <span className="font-medium">{po.project_name || "N/A"}</span>
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
              <span className="font-medium">{po.supplier?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium">{po.supplier?.address?.street || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contact:</span>
              <span className="font-medium">{po.supplier?.contact_person || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{po.supplier?.phone || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{po.supplier?.email || "N/A"}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Shipping & Billing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Shipping Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-blue-700 border-b border-blue-200 pb-2">Ship To</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{po.shipping_address?.location || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium">{po.shipping_address?.address || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">City:</span>
              <span className="font-medium">{po.shipping_address?.city || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">State:</span>
              <span className="font-medium">{po.shipping_address?.state || "N/A"}</span>
            </div>
          </div>
        </motion.div>
        
        {/* Billing Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-purple-50 p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-purple-700 border-b border-purple-200 pb-2">Bill To</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Contact:</span>
              <span className="font-medium">{po.billing_contact?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{po.billing_contact?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{po.billing_contact?.phone || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Terms:</span>
              <span className="font-medium">{po.payment_terms || "70% upon order confirmation and 30% payable within 30 days from the invoice date."}</span>
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
            {po.tax_amount && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Tax ({po.tax_rate || 0}%):</span>
                <span className="font-medium">{format_price(po.tax_amount, po.currency)}</span>
              </div>
            )}
            {po.discount_amount && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Discount:</span>
                <span className="font-medium">-{format_price(po.discount_amount, po.currency)}</span>
              </div>
            )}
            {po.shipping_cost && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Shipping:</span>
                <span className="font-medium">{format_price(po.shipping_cost, po.currency)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 mt-2 border-t border-gray-300">
              <span className="font-bold text-gray-800">Total:</span>
              <span className="font-bold text-xl text-primary">
                {format_price(po.total_amount || totalAmount, po.currency)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notes and Terms */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Notes</h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 min-h-[100px]">
            {po.notes || "Please deliver items as soon as possible."}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Terms & Conditions</h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 min-h-[100px]">
            {po.terms || "Standard terms and conditions apply. 70% upon order confirmation and 30% payable within 30 days from the invoice date."}
          </div>
        </div>
      </motion.div>

      {/* Approval & Signatures */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-12 border-t border-gray-200 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="text-center">
          <div className="mb-8 h-20 border-b border-gray-300" />
          <p className="font-medium text-gray-700">Prepared By</p>
          <p className="text-sm text-gray-500">{po.prepared_by?.name || po.created_by?.name || "N/A"}</p>
        </div>
        <div className="text-center">
          <div className="mb-8 h-20 border-b border-gray-300" />
          <p className="font-medium text-gray-700">Approved By</p>
          <p className="text-sm text-gray-500">{po.approved_by?.name || "N/A"}</p>
        </div>
        <div className="text-center">
          <div className="mb-8 h-20 border-b border-gray-300" />
          <p className="font-medium text-gray-700">Supplier Signature</p>
          <p className="text-sm text-gray-500">Date: ________________</p>
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