"use client";
import React from "react";
import { motion } from "framer-motion";
import { format_price } from "@/utils/helpers";
import TableHead from "../atoms/TableHead";
import TableBody from "../atoms/TableBody";
import TableRow from "../molecules/TableRow";
interface LineItem {
  id?: string;
  item_name: string;
  pr_quantity: number;
  unit_price: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface LineItemsProps {
  prNumber: string;
  isLoading: boolean;
  lineItems: LineItem[] | undefined;
  currency?: string;
  headersLength: number;
  reqId: string;
}

const LineItems: React.FC<LineItemsProps> = ({
  prNumber,
  isLoading,
  lineItems,
  currency = "USD",
  headersLength,
  reqId,
}) => {
  const expandedHeading = ["Item", "Quantity", "Unit Price", "Cost"];

  return (
    <motion.tr
      key={`${reqId}-items`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <td
        colSpan={headersLength}
        className="bg-gray-50 border-b border-gray-300"
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="w-1 h-5 bg-primary mr-2"></div>
            <h3 className="font-semibold text-primary">
              Line Items for {prNumber}
            </h3>
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-3 py-2">
              <div className="h-8 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          ) : lineItems && lineItems.length > 0 ? (
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <table className="w-full table-auto text-left border-collapse">
                <TableHead headers={expandedHeading} />
                <TableBody
                  data={lineItems}
                  renderRow={(item, index) => (
                    <TableRow
                      key={`line-${item.id || index}`}
                      data={[
                        item.item_name,
                        item.pr_quantity,
                        format_price(item.unit_price, currency),
                        format_price(
                          item.unit_price * item.pr_quantity,
                          currency
                        ),
                      ]}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      index={index}
                    />
                  )}
                  emptyMessage="No line items available for this requisition"
                />
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">
                No line items available for this requisition
              </p>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

export default LineItems;
