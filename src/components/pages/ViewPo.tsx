"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import useViewPO from '@/hooks/useViewPO';
import LoaderSpinner from '@/components/atoms/LoaderSpinner';
import { format_price } from '@/utils/helpers';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import { FaPrint, FaFileInvoice, FaBuilding, FaShippingFast, FaCreditCard, FaFileContract } from 'react-icons/fa';
import Image from 'next/image';
import TableHead from '@/components/atoms/TableHead';
import TableBody from '@/components/atoms/TableBody';
import TableRow from '@/components/molecules/TableRow';
import { ViewPOItem } from '@/types';

// Helper function to format payment terms for display
const formatPaymentTerm = (term: string) => {
  const termMap: Record<string, string> = {
    'pia': 'Payment in Advance',
    'cod': 'Cash on Delivery',
    'loc': 'Line of Credit',
    'nt00': 'Payment Immediately',
    'nt15': '15 Days After Invoice',
    'nt30': 'Net 30 Days',
    'nt45': 'Net 45 Days',
    'nt60': 'Net 60 Days',
    'nt90': 'Net 90 Days',
    'nt120': 'Net 120 Days'
  };
  
  return termMap[term] || term;
};

// Reusable section title component
const SectionTitle = ({ 
  icon, 
  title 
}: { 
  icon: React.ReactNode, 
  title: string 
}) => (
  <h3 className="text-base font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2 flex items-center">
    {icon}
    <span className="ml-2">{title}</span>
  </h3>
);

// Reusable section box component
const SectionBox = ({ 
  title, 
  icon, 
  children, 
  delay = 0 
}: { 
  title: string, 
  icon: React.ReactNode, 
  children: React.ReactNode,
  delay?: number 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-full"
  >
    <h3 className="text-sm uppercase font-semibold text-gray-600 mb-3 pb-2 border-b border-gray-200 flex items-center">
      {icon}
      <span className="ml-1">{title}</span>
    </h3>
    {children}
  </motion.div>
);

// Enhanced info row component with better typography for key-value pairs
const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center">
    <span className="font-bold text-primary">{label}:</span>
    <span className="text-gray-800 text-[16px] font-medium">{value}</span>
  </div>
);

// Reusable address component with improved typography
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AddressBlock = ({ entity }: { entity: any }) => (
  <>
    <p className="font-bold text-gray-800 text-base mb-1">{entity?.full_name || entity?.name || "N/A"}</p>
    <p className="text-gray-600">{entity?.address?.street || "N/A"}</p>
    <p className="text-gray-600">
      {entity?.address?.city || "N/A"}, {entity?.address?.state || "N/A"} {entity?.address?.zip_code || ""}
    </p>
    <p className="text-gray-600 mb-2">{entity?.address?.country || "N/A"}</p>
  </>
);

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
  
  // Calculate expected delivery date (default to 14 days from PO date)
  const expectedDeliveryDate = new Date(po.created_at);
  expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 14);
  const formattedDeliveryDate = expectedDeliveryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const totalAmount = items.reduce((sum: number, item: ViewPOItem) => {
    const quantity = item.pr_quantity || 0;
    return sum + (Number(item.unit_price) * quantity);
  }, 0) || parseFloat(po.total_amount) || 0;

  // Calculate tax amount (assuming 0% for now)
  const taxRate = 0;
  const taxAmount = totalAmount * (taxRate / 100);
  
  // Get status badge styles
  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const itemHeaders = ["S/N", "Item Code", "Description", "QTY", "Unit Price", "Total Amount"];

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
          quantity.toString(),
          format_price(Number(item.unit_price), po.currency),
          format_price(total, po.currency),
        ]}
        index={index}
        hasActions={false}
      />
    );
  };

  // Format payment term for display
  const displayPaymentTerm = formatPaymentTerm(po.supplier.payment_term);

  return (
    <div className=" mx-auto bg-white p-8 rounded-lg ">
      {/* Document Type Banner */}
      <div className="bg-primary/10 border-b-2 border-primary w-full text-center mb-8 pb-1 print:bg-transparent print:border-primary">
        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-wide">PURCHASE ORDER</h1>
      </div>
      
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
              width={160}
              height={80}
              priority
            />
          </div>
          <div className="mb-2">
            <h2 className="text-xl font-bold text-gray-800">{po.organisation?.name || "SimpliP2P Organization"}</h2>
            <p className="text-sm text-gray-600">123 Business Avenue, Suite 101</p>
            <p className="text-sm text-gray-600">Business City, BZ 12345</p>
            <p className="text-sm text-gray-600">Tel: <span className="font-medium">+1 (555) 123-4567</span></p>
            <p className="text-sm text-gray-600">Email: <span className="font-medium">info@simplip2p.com</span></p>
          </div>
        </motion.div>
        
        {/* Right side - PO Details */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-right"
        >
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm inline-block w-full">
            <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
              <h3 className="font-semibold text-gray-700">PURCHASE ORDER</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyles(po.status)}`}>
                {po.status}
              </div>
            </div>
            <div className="text-left space-y-2 text-sm">
              <InfoRow label="PO Number" value={po.po_number} />
              <InfoRow label="Issue Date" value={orderDate} />
              <InfoRow label="Expected Delivery" value={formattedDeliveryDate} />
              <InfoRow label="Payment Terms" value={displayPaymentTerm} />
              <InfoRow label="Reference" value={`PR-${po.id?.substring(0, 6) || "N/A"}`} />
              <InfoRow label="Currency" value={po.currency} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Supplier and Ship To Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Supplier Info */}
        <SectionBox 
          title="Supplier Information" 
          icon={<FaBuilding size={14} className="text-primary" />}
          delay={0.3}
        >
          <div className="text-sm">
            <AddressBlock entity={po.supplier} />
            <div className="space-y-2 mt-2">
              <InfoRow label="Email" value={po.supplier?.email || "N/A"} />
              <InfoRow label="Phone" value={po.supplier?.phone || "N/A"} />
              <InfoRow label="Payment Terms" value={displayPaymentTerm} />
            </div>
          </div>
        </SectionBox>
        
        {/* Ship To */}
        <SectionBox 
          title="Ship To" 
          icon={<FaShippingFast size={14} className="text-primary" />}
          delay={0.4}
        >
          <div className="text-sm">
            <AddressBlock entity={po.organisation} />
            <div className="space-y-2 mt-2">
              <InfoRow label="Contact Person" value="John Procurement" />
              <InfoRow label="Delivery Terms" value="FOB Destination" />
              <InfoRow label="Incoterms" value="DDP (Delivered Duty Paid)" />
              <InfoRow label="Required By" value={formattedDeliveryDate} />
            </div>
          </div>
        </SectionBox>
      </div>

      {/* Items Table */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <SectionTitle 
          icon={<FaFileInvoice className="text-primary" />} 
          title="Order Line Items" 
        />
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full border-collapse">
            <TableHead headers={itemHeaders} />
            <TableBody
              data={items}
              renderRow={renderItemRow}
              emptyMessage="No items found for this purchase order"
            />
            {/* Table Footer with Totals */}
            <tfoot>
              <tr className="bg-gray-50 border-t border-gray-200">
                <td colSpan={4} className="px-4 py-3 text-right font-medium text-gray-700">Subtotal:</td>
                <td colSpan={2} className="px-4 py-3 text-right font-medium">
                  {format_price(totalAmount, po.currency)}
                </td>
              </tr>
              <tr className="bg-gray-50 border-t border-gray-200">
                <td colSpan={4} className="px-4 py-3 text-right font-medium text-gray-700">Tax ({taxRate}%):</td>
                <td colSpan={2} className="px-4 py-3 text-right font-medium">
                  {format_price(taxAmount, po.currency)}
                </td>
              </tr>
              <tr className="bg-gray-50 border-t border-gray-200">
                <td colSpan={4} className="px-4 py-3 text-right font-medium text-gray-700">Shipping:</td>
                <td colSpan={2} className="px-4 py-3 text-right font-medium">
                  {format_price(0, po.currency)}
                </td>
              </tr>
              <tr className="bg-primary/5 border-t-2 border-primary">
                <td colSpan={4} className="px-4 py-3 text-right font-bold text-gray-900">TOTAL:</td>
                <td colSpan={2} className="px-4 py-3 text-right font-bold text-primary text-lg">
                  {format_price(totalAmount + taxAmount, po.currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.div>

      {/* Order Payment Details & Terms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Bank Details */}
        <SectionBox 
          title="Bank Details" 
          icon={<FaCreditCard size={14} className="text-primary" />}
          delay={0.7}
        >
          <div className="space-y-2 text-sm">
            <InfoRow 
              label="Bank Name" 
              value={po.supplier?.bank_details?.bank_name || "N/A"} 
            />
            <InfoRow 
              label="Account #" 
              value={po.supplier?.bank_details?.account_number || "N/A"} 
            />
            <InfoRow 
              label="Account Name" 
              value={po.supplier?.bank_details?.account_name || "N/A"} 
            />
          </div>
        </SectionBox>
        
        {/* Terms & Conditions */}
        <SectionBox 
          title="Terms & Conditions" 
          icon={<FaFileContract size={14} className="text-primary" />}
          delay={0.8}
        >
          <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
            <li>This purchase order is subject to the terms and conditions outlined in our Master Agreement.</li>
            <li>All prices are in <span className="font-semibold">{po.currency || 'the specified currency'}</span> and exclude applicable taxes unless otherwise stated.</li>
            <li>Payment will be processed according to the terms: <span className="font-semibold">{displayPaymentTerm}</span>.</li>
            <li>Please reference PO #<span className="font-semibold">{po.po_number}</span> on all invoices, shipping documents and correspondence.</li>
            <li>Delivery date is critical. Please notify us immediately of any potential delays.</li>
            <li>Any changes to this purchase order must be approved in writing by an authorized representative.</li>
            <li>All goods must meet specifications as outlined in this purchase order.</li>
            <li>The buyer reserves the right to inspect all goods upon delivery and reject those not meeting specifications.</li>
          </ul>
        </SectionBox>
      </div>

      {/* Signatures */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:mb-4"
      >
        <div>
          <div className="border-t-2 border-gray-300 pt-3 mt-6">
            <p className="text-gray-700 font-medium">Authorized By</p>
            <p className="text-sm text-gray-600">Procurement Manager</p>
            <p className="text-xs text-gray-500 mt-1">Date: {orderDate}</p>
          </div>
        </div>
        <div>
          <div className="border-t-2 border-gray-300 pt-3 mt-6">
            <p className="text-gray-700 font-medium">Accepted By</p>
            <p className="text-sm text-gray-600">{po.supplier?.full_name || "Supplier"} Representative</p>
            <p className="text-xs text-gray-500 mt-1">Date: ____________________</p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-end w-full gap-4 mt-8 print:hidden">
        <Button 
          onClick={handlePrint} 
          className="px-6 py-2.5 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <FaPrint className="w-4 h-4" />
          <span>Print</span>
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-sm text-gray-500 print:mt-4 print:fixed print:bottom-4 print:left-0 print:right-0">
        <div className="border-t border-gray-200 pt-4">
          <p>This purchase order was generated electronically and is valid without a signature.</p>
          <p className="mt-1">Generated from SimpliP2P on {new Date().toLocaleDateString()} | Reference: PO-{po.po_number}</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;