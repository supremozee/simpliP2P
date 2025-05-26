"use client";
import React, { useState, useEffect} from "react";
import useFetchPurchaseRequisition from "@/hooks/useFetchPurchaseRequisition";
import useStore from "@/store";
import TableSkeleton from "../atoms/Skeleton/Table";
import ApprovalModal from "./ApprovalModal";
import { motion } from "framer-motion";
import { FiSearch, FiClock, FiFilter } from "react-icons/fi";
import { IoFilterOutline, IoDocumentTextOutline } from "react-icons/io5";
import { BsArrowUp, BsArrowDown, BsCalendarCheck, BsBuilding } from "react-icons/bs";
import { MdOutlineAttachMoney, MdOutlinePriceCheck, MdPersonOutline } from "react-icons/md";
import { Requisition } from "@/types";
import { format_price } from "@/utils/helpers";

type SortField = 'date' | 'amount' | 'requestor' | 'priority';
type SortOrder = 'asc' | 'desc';
type PriorityLevel = 'high' | 'medium' | 'low';

// Function to determine priority based on needed_by_date
const calculatePriority = (neededByDate: string): PriorityLevel => {
  const today = new Date();
  const neededBy = new Date(neededByDate);
  const daysUntilNeeded = Math.ceil((neededBy.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilNeeded <= 3) return 'high';
  if (daysUntilNeeded <= 7) return 'medium';
  return 'low';
};

// Priority label component
const PriorityBadge = ({ priority }: { priority: PriorityLevel }) => {
  const colors = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-orange-50 text-orange-700 border-orange-200",
    low: "bg-green-50 text-green-700 border-green-200"
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
    </span>
  );
};

const RequisitionsApprovalPage = () => {
  const { currentOrg, setPr, pr, setIsOpen, isOpen } = useStore();
  const { data: pendingData, isLoading: pendingLoading, refetch:refetchPendingRequisitions } = useFetchPurchaseRequisition(currentOrg, "PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterPriority, setFilterPriority] = useState<'all' | PriorityLevel>('all');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

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

  useEffect(() => {
    if (!isOpen && pr?.id) {
      refetchPendingRequisitions();
      setPr(null);
    }
  }, [isOpen, refetchPendingRequisitions, setPr, pr]);

  const filterByPriority = (requisitions: typeof viewRequisitions) => {
    if (filterPriority === 'all') return requisitions;
    
    return requisitions.filter(req => {
      const priority = calculatePriority(req.needed_by_date);
      return priority === filterPriority;
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
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          const priorityA = calculatePriority(a.needed_by_date);
          const priorityB = calculatePriority(b.needed_by_date);
          comparison = priorityOrder[priorityA] - priorityOrder[priorityB];
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const filteredRequisitions = sortRequisitions(
    filterByPriority(
      filterByTime(
        viewRequisitions.filter(req =>
          req.pr_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.requestor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          req.department?.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Purchase Requisition Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve pending purchase requests</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFilterExpanded(!isFilterExpanded)} 
            className={`px-4 py-2 border rounded-lg text-sm flex items-center gap-2 ${
              isFilterExpanded ? "bg-primary/10 border-primary/30 text-primary" : "border-gray-200 text-gray-600 hover:bg-gray-50"
            } transition-colors`}
          >
            <FiFilter className="w-4 h-4" />
            Filters {isFilterExpanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {isFilterExpanded && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-lg p-4 border border-gray-200 mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="search"
                  type="text"
                  placeholder="PR number, requestor, department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full"
                />
              </div>
            </div>
            <div>
              <label htmlFor="time-filter" className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select
                id="time-filter"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white w-full"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div>
              <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                id="priority-filter"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as typeof filterPriority)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white w-full"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {isOpen && <ApprovalModal pr_id={pr?.id || ""} />}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <FiClock className="w-4 h-4 text-primary" />
                Pending Approvals
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleSort('priority')}
                  className={`flex items-center gap-1 text-sm ${sortField === 'priority' ? 'text-primary font-medium' : 'text-gray-500'} hover:text-primary transition-colors`}
                >
                  Priority {sortField === 'priority' && (sortOrder === 'asc' ? <BsArrowUp /> : <BsArrowDown />)}
                </button>
                <button
                  onClick={() => handleSort('date')}
                  className={`flex items-center gap-1 text-sm ${sortField === 'date' ? 'text-primary font-medium' : 'text-gray-500'} hover:text-primary transition-colors`}
                >
                  Date {sortField === 'date' && (sortOrder === 'asc' ? <BsArrowUp /> : <BsArrowDown />)}
                </button>
                <button
                  onClick={() => handleSort('amount')}
                  className={`flex items-center gap-1 text-sm ${sortField === 'amount' ? 'text-primary font-medium' : 'text-gray-500'} hover:text-primary transition-colors`}
                >
                  Amount {sortField === 'amount' && (sortOrder === 'asc' ? <BsArrowUp /> : <BsArrowDown />)}
                </button>
                <button
                  onClick={() => handleSort('requestor')}
                  className={`flex items-center gap-1 text-sm ${sortField === 'requestor' ? 'text-primary font-medium' : 'text-gray-500'} hover:text-primary transition-colors`}
                >
                  Requestor {sortField === 'requestor' && (sortOrder === 'asc' ? <BsArrowUp /> : <BsArrowDown />)}
                </button>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600">
              {filteredRequisitions.length} {filteredRequisitions.length === 1 ? 'requisition' : 'requisitions'} pending approval
            </div>
          </div>
        </div>

        {(!pendingLoading && filteredRequisitions.length > 0) ? (
          <div className="divide-y divide-gray-100">
            {filteredRequisitions.map((requisition) => {
              const priority = calculatePriority(requisition.needed_by_date);
              
              return (
                <motion.div
                  key={requisition.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer group relative
                    ${priority === 'high' ? 'border-l-4 border-l-red-500' : 
                      priority === 'medium' ? 'border-l-4 border-l-orange-400' : 
                        'border-l-4 border-l-green-500'}`
                  }
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
                    <div className="space-y-4 flex-grow pr-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full">
                          <IoDocumentTextOutline className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-medium text-gray-800">{requisition.request_description.length > 40 ? 
                              requisition.request_description.substring(0, 40) + '...' : 
                              requisition.request_description || "Purchase Requisition"}
                            </h3>
                            <span className="text-sm font-medium text-primary">
                              PR-{requisition?.pr_number.split('-').pop()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MdPersonOutline className="w-4 h-4" />
                              {requisition.requestor_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock className="w-4 h-4" />
                              {new Date(requisition.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <BsBuilding className="w-3 h-3" /> Department
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {requisition.department?.name || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <MdOutlineAttachMoney className="w-3 h-3" /> Estimated Cost
                          </p>
                          <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            <p>{requisition.currency}</p>
                            {format_price(Number(requisition.estimated_cost) || 0, requisition.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <BsCalendarCheck className="w-3 h-3" /> Needed By
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {new Date(requisition.needed_by_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <MdOutlinePriceCheck className="w-3 h-3" /> Items
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            {requisition.total_items || 0} items
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="space-y-2">
                        <PriorityBadge priority={priority} />
                        
                        <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-xs font-medium flex items-center justify-center">
                          {requisition.status}
                        </span>
                      </div>
                      
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRequisitionClick(requisition);
                          }}
                        >
                          Review Now
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <IoFilterOutline className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800">No Pending Requisitions</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-md text-center">
              {searchQuery || filterPriority !== 'all' || timeFilter !== 'all' ? 
                "No requisitions match your search criteria. Try adjusting your filters." : 
                "There are no requisitions pending approval at this time."}
            </p>
            {(searchQuery || filterPriority !== 'all' || timeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterPriority("all");
                  setTimeFilter("all");
                }}
                className="mt-4 px-4 py-2 text-sm text-primary hover:text-primary-dark transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequisitionsApprovalPage;