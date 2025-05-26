"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import useViewPO from '@/hooks/useViewPO';
import LoaderSpinner from '@/components/atoms/LoaderSpinner';
import { format_price } from '@/utils/helpers';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import { 
  FaPrint, 
  FaFileInvoice, 
  FaShippingFast, 
  FaCreditCard, 
  FaFileContract,
  FaRegCalendarAlt,
  FaRegClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import Image from 'next/image';
import TableHead from '@/components/atoms/TableHead';
import TableBody from '@/components/atoms/TableBody';
import TableRow from '@/components/molecules/TableRow';
import { ViewPOItem } from '@/types';

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
  
  return termMap[term?.toLowerCase()] || term || "Standard Terms";
};

// Enhanced Address Block
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AddressBlock = ({ entity, title }: { entity: any; title: string }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
    <h3 className="text-sm uppercase font-semibold text-gray-600 mb-3 pb-2 border-b border-gray-200">
      {title}
    </h3>
    <div className="font-bold text-gray-800 text-base mb-1">{entity?.full_name || entity?.name || "N/A"}</div>
    <div className="text-gray-600">{entity?.address?.street || "N/A"}</div>
    <div className="text-gray-600">
      {entity?.address?.city || "N/A"}, {entity?.address?.state || "N/A"} {entity?.address?.zip_code || ""}
    </div>
    <div className="text-gray-600 mb-2">{entity?.address?.country || "N/A"}</div>
    
    {entity?.email && <div className="text-gray-600 mt-2">Email: <span className="text-gray-800">{entity.email}</span></div>}
    {entity?.phone && <div className="text-gray-600">Phone: <span className="text-gray-800">{entity.phone}</span></div>}
  </div>
);

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = "bg-gray-100 text-gray-800 border-gray-300";
  let icon = <FaRegClock className="mr-1" />;
  
  switch (status) {
    case 'APPROVED':
      bgColor = "bg-green-100 text-green-800 border-green-300";
      icon = <FaCheckCircle className="mr-1" />;
      break;
    case 'PENDING':
      bgColor = "bg-yellow-100 text-yellow-800 border-yellow-300";
      icon = <FaExclamationCircle className="mr-1" />;
      break;
    case 'REJECTED':
      bgColor = "bg-red-100 text-red-800 border-red-300";
      icon = <FaExclamationTriangle className="mr-1" />;
      break;
  }
  
  return (
    <div className={`px-3 py-1.5 rounded-full inline-flex items-center text-sm font-medium ${bgColor}`}>
      {icon}
      {status}
    </div>
  );
};

const OrderDetailBox = ({ 
  label, 
  value, 
  icon 
}: { 
  label: string;
  value: string | React.ReactNode;
  icon: React.ReactNode;
}) => (
  <div className="bg-gray-50 p-3 rounded-lg flex items-center border border-gray-200">
    <div className="mr-3 bg-white p-2 rounded-full">
      {icon}
    </div>
    <div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  </div>
);

const PurchaseOrderDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const resourceToken = searchParams.get('x-resource-token') || "";
  const [isLoading, setIsLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="mb-4">
            <Image 
              src="/big-logo.png" 
              alt="SimpliP2P Logo" 
              width={120} 
              height={40} 
              className="mx-auto" 
            />
          </div>
          <LoaderSpinner size="lg" text="Loading purchase order details..." />
          <p className="text-sm text-gray-500 mt-4">Please wait while we retrieve the purchase order information</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg border border-yellow-300 mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FaExclamationTriangle className="mr-2" />
              Invalid Access Token
            </h3>
            <p>The resource token provided is invalid or has expired.</p>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">
              Please contact your procurement administrator for assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-300 mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FaExclamationCircle className="mr-2" />
              Error
            </h3>
            <p>{error.message || "Failed to load purchase order details"}</p>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-500 text-sm">
              Please try again later or contact support if the issue persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Use the provided PO data
  const po = poData || {
    id: "22eefb21-4b92-4c1a-b025-a6ba403aedd0",
    created_at: "2025-05-23T14:19:34.703Z",
    updated_at: "2025-05-23T14:19:34.703Z",
    po_number: "PO-010",
    total_amount: "32000.00",
    currency: "NGN",
    status: "PENDING",
    attachment: "",
    supplier: {
      id: "5c1bf9a5-1784-423d-b342-fac7da9a08ba",
      created_at: "2025-04-14T13:25:11.647Z",
      updated_at: "2025-04-14T13:25:11.647Z",
      supplier_no: "SUP-004",
      full_name: "Sabr Ariyibi",
      email: "zeesoftwaredev@gmail.com",
      phone: "09161425017",
      address: {
        city: "Abuja",
        state: "Abuja Federal Capital Territory",
        street: "sabr street",
        country: "Nigeria",
        zip_code: "1000022"
      },
      rating: "5.0",
      bank_details: {
        bank_name: "Eco bank",
        account_name: "Sabr Ariyibi",
        account_number: "1234567890"
      },
      meta_data: null,
      payment_term: "Line of Credit",
      lead_time: "2 days",
      notification_channel: "email"
    },
    items: [
      {
        id: "8512e241-a566-4612-a9d4-7543e9c523d8",
        created_at: "2025-05-21T18:36:24.147Z",
        updated_at: "2025-05-23T14:19:34.973Z",
        item_name: "Sample Product 1",
        unit_price: "1000.00",
        currency: "NGN",
        image_url: "https://example.com/image.jpg",
        pr_quantity: 12,
        po_quantity: null,
        status: "PENDING"
      },
      {
        id: "98f180f9-8d02-47b6-aaa6-1af58f64c920",
        created_at: "2025-05-22T13:42:02.385Z",
        updated_at: "2025-05-23T14:19:34.973Z",
        item_name: "Test 2",
        unit_price: "20000.00",
        currency: "NGN",
        image_url: "",
        pr_quantity: 1,
        po_quantity: null,
        status: "PENDING"
      }
    ],
    organisation: {
      name: "azeezend(sub)",
      logo: "http://api-simplip2p.onrender.com/files/de05aefe2a7f4ccfb770932590e6873d"
    },
    branch: {
      id: "4a83682b-5821-4329-b46d-32211c96cc2e",
      name: "Epe",
      address: "Sango Ota"
    }
  };

  const items = po.items || [];

  const orderDate = new Date(po.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Calculate expected delivery date (default to 14 days from PO date)
  const expectedDeliveryDate = new Date(po.created_at);
  expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + parseInt(po.supplier.lead_time?.split(' ')[0] || '14'));
  const formattedDeliveryDate = expectedDeliveryDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Calculate order totals
  const subtotal = items.reduce((sum: number, item: ViewPOItem) => {
    const quantity = item.pr_quantity || 0;
    return sum + (Number(item.unit_price) * quantity);
  }, 0);
  
  const taxRate = 7.5; // VAT rate in Nigeria
  const taxAmount = subtotal * (taxRate / 100);
  const shippingCost = 0; // Assuming no shipping cost for this example
  const totalAmount = subtotal + taxAmount + shippingCost;

  // Format payment term for display
  const displayPaymentTerm = formatPaymentTerm(po.supplier.payment_term || "");
  
  // Lead time from supplier data
  const leadTime = po.supplier.lead_time || "2-3 days";

  // Item table headers
  const itemHeaders = ["Item #", "Description", "Quantity", "Unit Price", "Currency", "Total"];

  const renderItemRow = (item: ViewPOItem, index: number) => {
    const quantity = item.pr_quantity || 0;
    const unitPrice = Number(item.unit_price);
    const total = unitPrice * quantity;
    
    return (
      <TableRow
        key={item.id || `item-${index}`}
        data={[
          (index + 1).toString(),
          <div key={`desc-${index}`} className="text-left">
            <div className="font-medium">{item.item_name}</div>
          </div>,
          <div key={`qty-${index}`} >{quantity}</div>,
          <div key={`price-${index}`}>{format_price(unitPrice, po.currency)}</div>,
          <div key={`curr-${index}`}>{po.currency}</div>,
          <div key={`total-${index}`}>{format_price(total, po.currency)}</div>,
        ]}
        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
        index={index}
      />
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 print:bg-white print:p-0">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden print:shadow-none print:w-full">
        {/* Document Header */}
        <div className="bg-primary p-6 text-white print:bg-white print:text-primary print:border-b-2 print:border-primary">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">PURCHASE ORDER</h1>
              <p className="opacity-75 mt-1">PO #{po.po_number}</p>
            </div>
            <StatusBadge status={po.status} />
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-white print:hidden">
          <div className="flex max-w-6xl mx-auto">
            <button 
              className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('details')}
            >
              Order Details
            </button>
            <button 
              className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('history')}
            >
              Activity History
            </button>
          </div>
        </div>

        {/* Document Number Banner */}
        <div className="bg-gray-50 px-6 py-3 print:hidden">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white p-1.5 rounded-md border border-gray-200 mr-3">
                <FaFileInvoice className="text-primary w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Purchase Order</p>
                <p className="text-base font-bold text-gray-800">{po.po_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 print:hidden">
              <Button 
                onClick={handlePrint} 
                className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-lg flex items-center gap-1.5 hover:bg-primary/20 transition-colors"
              >
                <FaPrint className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </Button>
            </div>
          </div>
        </div>
        
        {activeTab === 'details' && (
          <div className="p-6 md:p-8">
            {/* Top Section: Company & Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              {/* Company Logo & Information */}
              <motion.div 
                className="md:col-span-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src={po.organisation?.logo || "/big-logo.png"} 
                      alt="Company Logo"
                      width={120}
                      height={60}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {po.organisation?.name || "SimpliP2P Organization"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Procurement Management System
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <OrderDetailBox
                    label="PO Number"
                    value={po.po_number}
                    icon={<FaFileInvoice className="text-primary w-4 h-4" />}
                  />
                  <OrderDetailBox
                    label="Order Date"
                    value={orderDate}
                    icon={<FaRegCalendarAlt className="text-primary w-4 h-4" />}
                  />
                  <OrderDetailBox
                    label="Expected Delivery"
                    value={formattedDeliveryDate}
                    icon={<FaShippingFast className="text-primary w-4 h-4" />}
                  />
                  <OrderDetailBox
                    label="Lead Time"
                    value={leadTime}
                    icon={<FaRegClock className="text-primary w-4 h-4" />}
                  />
                </div>
              </motion.div>
              
              {/* Order Summary Box */}
              <motion.div
                className="md:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-full">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      {/* <span className="font-medium">{format_price(subtotal, po.currency)}</span> */}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax ({taxRate}%):</span>
                      <span className="font-medium">{format_price(taxAmount, po.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">{format_price(shippingCost, po.currency)}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-800">Total:</span>
                        <span className="font-bold text-primary text-xl">
                          {format_price(totalAmount, po.currency)}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Currency:</span>
                        <span className="font-medium">{po.currency}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Payment Terms:</span>
                        <span className="font-medium">{displayPaymentTerm}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Address Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-4 h-full">
                    <h3 className="text-sm uppercase font-semibold text-gray-600 mb-3 pb-2 border-b border-gray-200">
                      BUYER / SHIP TO
                    </h3>
                    <div className="font-bold text-gray-800 text-base mb-1">{po.branch?.name || "N/A"}</div>
                    <div className="text-gray-600">{po.branch?.address || "N/A"}</div>
                  </div>
                </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <AddressBlock 
                  entity={po.supplier} 
                  title="SUPPLIER / VENDOR"
                />
              </motion.div>
            </div>
            
            {/* Line Items Table */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FaFileInvoice className="mr-2 text-primary" />
                  Order Line Items
                </h3>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full bg-white">
                  <TableHead headers={itemHeaders} />
                  <TableBody
                    data={items}
                    renderRow={renderItemRow}
                    emptyMessage="No items found for this purchase order"
                  />
                  
                  {/* Table Footer with Totals */}
                  <tfoot>
                    <tr className="bg-gray-50 border-t border-gray-200">
                      <td colSpan={3} className="px-6 py-3"></td>
                      <td colSpan={2} className="px-6 py-3 text-right font-medium text-gray-700">Subtotal:</td>
                      <td className="px-6 py-3 text-right font-medium">
                        {format_price(subtotal, po.currency)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-6 py-3"></td>
                      <td colSpan={2} className="px-6 py-3 text-right font-medium text-gray-700">VAT ({taxRate}%):</td>
                      <td className="px-6 py-3 text-right font-medium">
                        {format_price(taxAmount, po.currency)}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-6 py-3"></td>
                      <td colSpan={2} className="px-6 py-3 text-right font-medium text-gray-700">Shipping:</td>
                      <td className="px-6 py-3 text-right font-medium">
                        {format_price(shippingCost, po.currency)}
                      </td>
                    </tr>
                    <tr className="bg-primary/5 border-t-2 border-primary">
                      <td colSpan={3} className="px-6 py-3"></td>
                      <td colSpan={2} className="px-6 py-3 text-right font-bold text-gray-900">TOTAL:</td>
                      <td className="px-6 py-3 text-right font-bold text-primary text-lg">
                        {format_price(totalAmount, po.currency)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </motion.div>
            
            {/* Additional Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Payment Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-5 h-full">
                  <h3 className="text-sm uppercase font-semibold text-gray-600 mb-3 pb-2 border-b border-gray-200 flex items-center">
                    <FaCreditCard className="mr-2 text-primary" />
                    Payment Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Payment Terms:</span>
                      <span className="font-medium text-sm">{displayPaymentTerm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Bank Name:</span>
                      <span className="font-medium text-sm">{po.supplier?.bank_details?.bank_name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Account Name:</span>
                      <span className="font-medium text-sm">{po.supplier?.bank_details?.account_name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Account Number:</span>
                      <span className="font-medium text-sm">{po.supplier?.bank_details?.account_number || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-5 h-full">
                  <h3 className="text-sm uppercase font-semibold text-gray-600 mb-3 pb-2 border-b border-gray-200 flex items-center">
                    <FaShippingFast className="mr-2 text-primary" />
                    Delivery Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Expected Delivery:</span>
                      <span className="font-medium text-sm">{formattedDeliveryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Lead Time:</span>
                      {/* <span className="font-medium text-sm">{leadTime}</span> */}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Shipping Method:</span>
                      <span className="font-medium text-sm">Standard Delivery</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Incoterms:</span>
                      <span className="font-medium text-sm">DDP (Delivered Duty Paid)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Terms & Conditions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-5 h-full">
                  <h3 className="text-sm uppercase font-semibold text-gray-600 mb-3 pb-2 border-b border-gray-200 flex items-center">
                    <FaFileContract className="mr-2 text-primary" />
                    Terms & Conditions
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                    <li>This PO is subject to our standard terms & conditions.</li>
                    <li>Prices and payment in {po.currency}.</li>
                    <li>Please quote PO #{po.po_number} on all correspondence.</li>
                    <li>Goods must match specifications exactly.</li>
                    <li>Notify us immediately of any potential delays.</li>
                  </ul>
                </div>
              </motion.div>
            </div>
            
            {/* Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            </div>
          </div>
        )}
  
        {activeTab === 'history' && (
          <div className="p-6 md:p-8">
            <div className="border-b-2 border-gray-200 pb-2 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaRegClock className="mr-2 text-primary" />
                Order Activity History
              </h3>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="space-y-6">
                {/* Current status */}
                <div className="flex">
                  <div className="mr-4 relative">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FaFileInvoice className="text-primary" />
                    </div>
                    <div className="absolute top-10 left-1/2 w-0.5 h-full -translate-x-1/2 bg-gray-200"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-800">Purchase Order Created</h4>
                      <StatusBadge status={po.status} />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      PO #{po.po_number} was created and sent to supplier
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{orderDate}</p>
                  </div>
                </div>
              
                {/* Future activities - these would be populated from real data */}
                <div className="flex opacity-40">
                  <div className="mr-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-400">Awaiting Supplier Acknowledgment</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Supplier has not yet acknowledged this purchase order
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Empty state for when there's no history yet */}
              {po.status === 'PENDING' && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">This purchase order is new and waiting for supplier action.</p>
                  <p className="text-sm text-gray-500 mt-2">Activity history will be updated as the order progresses.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center text-sm text-gray-500 border-t border-gray-200 print:bg-white">
          <p>This purchase order was generated electronically by SimpliP2P on {new Date().toLocaleDateString()}</p>
          <p className="mt-1">PO #{po.po_number} | Document ID: {po.id?.substring(0, 8)}</p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;