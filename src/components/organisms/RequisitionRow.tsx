"use client";
import React from "react";
import TableRow from "../molecules/TableRow";
import Button from "../atoms/Button";
import { cn } from "@/utils/cn";
import { format_price } from "@/utils/helpers";
import { Requisition } from "@/types";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import LineItems from "./LineItems";

interface RequisitionRowProps {
  req: Requisition;
  index: number;
  isSelected: (id: string) => boolean;
  toggleSelectItem: (id: string) => void;
  handleViewRequisition: (props: { pr_number: string; id: string }) => void;
  toggleRow: (prNumber: string) => void;
  expandedRows: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lineItems: any[] | undefined;
  isLineItemsLoading: boolean;
  activeTab: string;
  headersLength: number;
}

const getStatusStyle = (status: string) => {
  switch(status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'APPROVED':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'REQUESTED MODIFICATION':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'SAVED_FOR_LATER':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const RequisitionRow: React.FC<RequisitionRowProps> = ({
  req,
  index,
  isSelected,
  toggleSelectItem,
  handleViewRequisition,
  toggleRow,
  expandedRows,
  lineItems,
  isLineItemsLoading,
  activeTab,
  headersLength,
}) => {
  return (
    <React.Fragment key={`row-${req.id}`}>
      <TableRow
        key={req.id}
        data={[
          <div key={`select-${req.id}`} className="flex items-center justify-center">
            <button 
              onClick={() => toggleSelectItem(req.id)}
              className="flex items-center justify-center w-5 h-5 focus:outline-none"
              aria-label={isSelected(req.id) ? "Deselect requisition" : "Select requisition"}
            >
              {isSelected(req.id) ? (
                <MdCheckBox size={20} className="text-primary" />
              ) : (
                <MdCheckBoxOutlineBlank size={20} className="text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>,
          `${req.pr_number}`,
          new Date(req.created_at.split("T")[0]).toLocaleDateString('en-US', {year:'numeric', month: 'short', day: 'numeric'}),
          req.supplier?.full_name,
          req.department?.name,
          req.requestor_name,
          req.quantity,
          format_price(Number(req.estimated_cost), req.currency, "currency"),
          <span key={`date-${req.id}`} className="whitespace-nowrap">{req.needed_by_date}</span>,
          <span 
            key={`status-${req.id}`} 
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(req.status)}`}
          >
            {req.status}
          </span>,
          <div className="flex w-full justify-center items-center" key={`action-${req.id}`}>
            <Button 
              key={req.id}
              onClick={() => handleViewRequisition({ pr_number: req.pr_number, id: req.id })} 
              className={cn(
                "p-2 px-3 rounded-md transition-colors z-20",
                activeTab === "SAVED APPROVAL" || req.status === "SAVED_FOR_LATER" 
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : req.status === "PENDING" 
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : req.status === "APPROVED" 
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-600 hover:bg-gray-700'
              )}
            >
              <p className="text-white text-xs">
                {(activeTab === "SAVED APPROVAL" || req.status === "SAVED_FOR_LATER") 
                  ? "Complete" 
                  : (activeTab === "REQUEST_MODIFICATION" || req.status === "REQUESTED MODIFICATION") 
                    ? "View Request" 
                    : "View Details"}
              </p>
            </Button>
          </div>,
          <div
            key={`toggle-${req.id}`}
            className="flex justify-center items-center"
          >
            <Button
              className={cn(
                "p-2 rounded-full transition-colors flex items-center justify-center",
                expandedRows.includes(req.pr_number) 
                  ? "bg-secondary/90 hover:bg-secondary" 
                  : "bg-secondary hover:bg-secondary/90"
              )}
              onClick={() => toggleRow(req.pr_number)}
            >
              {expandedRows.includes(req.pr_number) 
                ? <HiChevronUp className="text-white" /> 
                : <HiChevronDown className="text-white" />}
            </Button>
          </div>,
        ]}
        className={`${expandedRows.includes(req.pr_number) ? "border-b-0" : ""} ${isSelected(req.id) ? 'bg-blue-50' : ''}`}
        index={index}
      />
      
      {expandedRows.includes(req.pr_number) && (
        <LineItems
          prNumber={req.pr_number}
          isLoading={isLineItemsLoading}
          lineItems={lineItems}
          currency={req.currency}
          headersLength={headersLength}
          reqId={req.id}
        />
      )}
    </React.Fragment>
  );
};

export default RequisitionRow;