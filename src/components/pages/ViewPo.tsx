"use client";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import useViewPO from "@/hooks/useViewPO";
import LoaderSpinner from "@/components/atoms/LoaderSpinner";
import { format_price } from "@/utils/helpers";
import Button from "@/components/atoms/Button";
import {
  FaPrint,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaRegClock,
} from "react-icons/fa";
import Image from "next/image";
import { ViewPOItem } from "@/types";
import TableHead from "../atoms/TableHead";
import TableBody from "../atoms/TableBody";
import TableRow from "../molecules/TableRow";

const formatPaymentTerm = (term: string) => {
  const termMap: Record<string, string> = {
    pia: "Payment in Advance",
    cod: "Cash on Delivery",
    loc: "Line of Credit",
    nt00: "Payment Immediately",
    nt15: "15 Days After Invoice",
    nt30: "Net 30 Days",
    nt45: "Net 45 Days",
    nt60: "Net 60 Days",
    nt90: "Net 90 Days",
    nt120: "Net 120 Days",
  };
  return termMap[term?.toLowerCase()] || term || "Standard Terms";
};

const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = "bg-tertiary text-primary";
  let icon = <FaRegClock className="mr-1" />;

  switch (status) {
    case "APPROVED":
      bgColor = "bg-green-100 text-green-800";
      icon = <FaCheckCircle className="mr-1" />;
      break;
    case "PENDING":
      bgColor = "bg-yellow-100 text-yellow-800";
      icon = <FaExclamationCircle className="mr-1" />;
      break;
    case "REJECTED":
      bgColor = "bg-red-100 text-red-800";
      icon = <FaExclamationTriangle className="mr-1" />;
      break;
  }

  return (
    <span className={`px-3 py-1 rounded-full inline-flex items-center text-sm font-semibold ${bgColor}`}>
      {icon}
      {status}
    </span>
  );
};

const PurchaseOrderDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const resourceToken = searchParams.get("x-resource-token") || "";
  const [isLoading, setIsLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  const {
    data: poData,
    isLoading: isFetchingPO,
    error,
  } = useViewPO(resourceToken, orderId);
  const po = poData;

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

  if (isLoading || isFetchingPO || !po) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
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
          <p className="text-lg text-black mt-4">
            Please wait while we retrieve the purchase order information
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg border border-yellow-200 mb-4">
            <h1 className="text-lg font-bold mb-2 flex items-center">
              <FaExclamationTriangle className="mr-2" />
              Invalid Access Token
            </h1>
            <p>The resource token provided is invalid or has expired.</p>
          </div>
          <div className="text-center mt-4">
            <p className="text-black font-medium text-lg">
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
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 mb-4">
            <h1 className="text-lg font-bold mb-2 flex items-center">
              <FaExclamationCircle className="mr-2" />
              Error
            </h1>
            <p>{error.message || "Failed to load purchase order details"}</p>
          </div>
          <div className="text-center mt-4">
            <p className="text-black text-lg">
              Please try again later or contact support if the issue persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const items = po.items || [];
  const orderDate = new Date(po.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subtotal = items.reduce((sum: number, item: ViewPOItem) => {
    const quantity = item.pr_quantity || 0;
    return sum + Number(item.unit_price) * quantity;
  }, 0);

  return (
    <main className="min-h-screen bg-tertiary py-8 print:bg-white print:py-0">
      <section className="max-w-4xl mx-auto bg-white shadow-sm print:shadow-none flex flex-col gap-8">
        <div className="border-b-2 border-primary  pb-6 p-8 print:border-primary ">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Image
                src={po.organisation?.logo || "/logo-black.png"}
                alt="Company Logo"
                width={100}
                height={50}
                className="object-cover "
              />
              <div>
                <h1 className="text-2xl font-bold text-primary ">
                  {po.organisation?.name || "SimpliP2P Organization"}
                </h1>
                <p className="text-black">Procurement Management System</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-primary  mb-2">PURCHASE ORDER</h2>
              <StatusBadge status={po.status} />
            </div>
          </div>
        </div>

        {/* PO Details & Print Button */}
        <div className="px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2 items-center">
              <p className="text-sm text-primary">PO-Number:</p>
              <p className="text-xl font-bold text-primary ">{po.po_number}</p>
            </div>
            <div className="print:hidden">
              <Button
                onClick={handlePrint}
                className="px-4 py-2 bg-primary  text-white rounded-lg flex items-center gap-2 hover:bg-gray-800"
              >
                <FaPrint className="w-4 h-4" />
                Print
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-lg font-bold text-primary  uppercase tracking-wider">Order Date:</p>
              <p className="font-medium">{orderDate}</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary  uppercase tracking-wider">Payment Terms:</p>
              <p className="font-medium">{formatPaymentTerm(po.supplier?.payment_term || "")}</p>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="px-8 mb-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Bill To */}
            <div>
              <h1 className="text-lg font-bold text-primary uppercase tracking-wider mb-3">
                Bill To
              </h1>
              <div className="text-gray-700">
                <p className="font-medium">{po.organisation?.name}</p>
                <p>{po.branch?.name}</p>
                <p>{po.branch?.address}</p>
              </div>
            </div>

            {/* Supplier */}
            <div>
              <h1 className="text-lg font-bold text-primary  uppercase tracking-wider">
                Supplier
              </h1>
              <div className="text-gray-700">
                <p className="font-medium">{po.supplier?.full_name}</p>
                <p>{po.supplier?.address?.street}</p>
                <p>
                  {po.supplier?.address?.city}, {po.supplier?.address?.state} {po.supplier?.address?.zip_code}
                </p>
                <p>{po.supplier?.address?.country}</p>
                <p className="mt-2">Email: {po.supplier?.email}</p>
                <p>Phone: {po.supplier?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-8 mb-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full bg-white">
              <TableHead headers={["#", "Item Name", "Qty", "Unit Price", "Total"]} />
              <TableBody
                data={items}
                renderRow={(item: ViewPOItem, index: number) => {
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
                        <div key={`qty-${index}`}>{quantity}</div>,
                        <div key={`price-${index}`}>
                          {format_price(unitPrice, po.currency, "currency")}
                        </div>,
                        <div key={`total-${index}`}>{format_price(total, po.currency, "currency")}</div>,
                      ]}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      index={index}
                    />
                  );
                }}
                emptyMessage="No items found for this purchase order"
              />
            </table>
          </div>
        </div>

        <div className="px-8 mb-8">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="border-t-2 border-primary  pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary ">Total:</span>
                  <span className="text-2xl font-bold text-primary ">
                    {format_price(subtotal, po.currency, "currency")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        {/* <div className="px-8 pb-8">
          <h1 className="text-lg font-bold text-primary  uppercase tracking-wider mb-3">
            Terms & Conditions
          </h1>
          <div className="text-lg text-gray-700 space-y-1">
            <p>• This PO is subject to our standard terms & conditions.</p>
            <p>• Please quote PO #{po.po_number} on all correspondence.</p>
            <p>• Goods must match specifications exactly.</p>
            <p>• Notify us immediately of any potential delays.</p>
          </div>
        </div> */}

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t print:bg-white">
          <div className="text-center text-lg text-black">
            <p className="mt-1">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PurchaseOrderDetails;