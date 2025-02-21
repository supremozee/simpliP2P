"use client";
import React, { useState } from "react";
import useFetchPurchaseRequisition from "@/hooks/useFetchPurchaseRequisition";
import useStore from "@/store";
import TableSkeleton from "../atoms/Skeleton/Table";
import ApprovalModal from "./ApprovalModal";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { IoFilterOutline, IoTimeOutline } from "react-icons/io5";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";
import { Requisition } from "@/types";

type SortField = 'date' | 'amount' | 'requestor';
type SortOrder = 'asc' | 'desc';

const RequisitionsApprovalPage = () => {
  const { currentOrg, setPr, pr, setIsOpen, isOpen } = useStore();
  const { data: pendingData, isLoading: pendingLoading } = useFetchPurchaseRequisition(currentOrg, "PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const viewRequisitions = pendingData?.data.requisitions || [];

  const filterByTime = (requisitions: typeof viewRequisitions) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    return requisitions.filter(req => {
      const reqDate = new Date(req.created_at);
      switch (timeFilter) {
        case 'today':
          return reqDate >= today;
        case 'week':
          return reqDate >= weekAgo;
        case 'month':
          return reqDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const sortRequisitions = (requisitions: typeof viewRequisitions) => {
    return [...requisitions].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        case 'amount':
          comparison = Number(b.estimated_cost) - Number(a.estimated_cost);
          break;
        case 'requestor':
          comparison = (a.requestor_name || '').localeCompare(b.requestor_name || '');
          break;
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  };

  const filteredRequisitions = sortRequisitions(
    filterByTime(
      viewRequisitions.filter(req =>
        req.pr_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requestor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.department?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleRequisitionClick = (requisition: Requisition) => {
                           setPr({
                            pr_number: requisition.pr_number,
                            id: requisition.id,
    });
    setIsOpen(true);
  };

  if (pendingLoading) return <TableSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Purchase Requisition Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve purchase requisitions for your organization</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search requisitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
            />
          </div>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {isOpen && <ApprovalModal pr_id={pr?.id || ""} />}

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <IoTimeOutline className="w-4 h-4" />
                Pending Approvals
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleSort('date')}
                  className={`flex items-center gap-1 text-sm ${sortField === 'date' ? 'text-primary' : 'text-gray-500'} hover:text-primary transition-colors`}
                >
                  Date {sortField === 'date' && (sortOrder === 'asc' ? <BsArrowUp /> : <BsArrowDown />)}
                </button>
                <button
                  onClick={() => handleSort('amount')}
                  className={`flex items-center gap-1 text-sm ${sortField === 'amount' ? 'text-primary' : 'text-gray-500'} hover:text-primary transition-colors`}
                >
                  Amount {sortField === 'amount' && (sortOrder === 'asc' ? <BsArrowUp /> : <BsArrowDown />)}
                </button>
                <button
                  onClick={() => handleSort('requestor')}
                  className={`flex items-center gap-1 text-sm ${sortField === 'requestor' ? 'text-primary' : 'text-gray-500'} hover:text-primary transition-colors`}
                >
                  Requestor {sortField === 'requestor' && (sortOrder === 'asc' ? <BsArrowUp /> : <BsArrowDown />)}
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredRequisitions.length} requisitions pending approval
            </div>
          </div>
        </div>

        {(!pendingLoading && filteredRequisitions.length > 0) ? (
          <div className="divide-y divide-gray-100">
            {filteredRequisitions.map((requisition) => (
              <motion.div
                key={requisition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group relative"
                onClick={() => handleRequisitionClick(requisition)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleRequisitionClick(requisition);
                  }
                }}
              >
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-4 flex-grow">
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-2 bg-primary text-white rounded-lg group-hover:bg-primary/90 transition-colors">
                        <span className="text-sm font-medium">PR-{requisition?.pr_number.split('-').pop()}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{requisition.requestor_name}</h3>
                        <p className="text-sm text-gray-500">
                          Created on {new Date(requisition.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-sm text-gray-500">Department</p>
                        <p className="text-base font-medium text-gray-700">
                          {requisition.department?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Branch</p>
                        <p className="text-base font-medium text-gray-700">
                          {requisition.branch?.name}
                        </p>
                      </div>
                        <div>
                        <p className="text-sm text-gray-500">Needed By</p>
                        <p className="text-base font-medium text-gray-700">
                          {new Date(requisition.needed_by_date).toLocaleDateString()}
                        </p>
                        </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      {requisition.status}
                      </span>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm text-primary">Click to review →</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <IoFilterOutline className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">No Pending Requisitions</h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery ? "No requisitions match your search criteria" : "There are no requisitions pending approval"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequisitionsApprovalPage;