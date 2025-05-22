import React from 'react';
import { Budget } from '@/types';
import { format_price } from '@/utils/helpers';
import TableShadowWrapper from '../atoms/TableShadowWrapper';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import TableHead from '../atoms/TableHead';
import TableBody from '../atoms/TableBody';
import TableRow from '../molecules/TableRow';
import OpenBudget from './OpenBudget';
import ExportCheckBox from '../molecules/ExportCheckBox';

interface BudgetTableProps {
  budgets: Budget[];
  selectedItems: string[];
  toggleSelectItem: (id: string) => void;
  isSelected: (id: string) => boolean;
  handleSelectAll: () => void;
}

const BudgetTable: React.FC<BudgetTableProps> = ({ 
  budgets, 
  selectedItems, 
  toggleSelectItem, 
  isSelected, 
  handleSelectAll 
}) => {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
        <p className="text-gray-500">No budgets found. Create a budget to get started.</p>
      </div>
    );
  }

  const headers = [
    <ExportCheckBox
      handleSelectAll={handleSelectAll}
      items={budgets}
      selectedItems={selectedItems}
      key="select-all"
    />,
    "Budget Name",
    "Allocated Amount",
    "Available Balance",
    "Reserved Amount",
    "Created Date",
    "Actions"
  ];

  const renderRow = (budget: Budget, index: number) => (
    <TableRow
      key={budget.id}
      data={[
        <div key={`select-${budget.id}`} className="flex items-center justify-center">
          <button 
            onClick={() => toggleSelectItem(budget.id)}
            className="flex items-center justify-center w-5 h-5 focus:outline-none"
            aria-label={isSelected(budget.id) ? "Deselect budget" : "Select budget"}
          >
            {isSelected(budget.id) ? (
              <MdCheckBox size={20} className="text-primary" />
            ) : (
              <MdCheckBoxOutlineBlank size={20} className="text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>,
        budget.name,
        format_price(parseFloat(budget.amount_allocated), budget.currency),
        <span key={`balance-${budget.id}`} className={`${
          parseFloat(budget.amount_available) <= 0 
            ? 'text-red-600' 
            : parseFloat(budget.amount_available) < parseFloat(budget.amount_allocated) / 5 
              ? 'text-amber-600' 
              : 'text-green-600'
        }`}>
          {format_price(parseFloat(budget.balance), budget.currency)}
        </span>,
        format_price(parseFloat(budget.amount_reserved), budget.currency),
        <span key={`date-${budget.id}`} className="text-gray-500">
          {new Date(budget.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>,
        <div key={`actions-${budget.id}`} className="flex items-center justify-center">
          <OpenBudget budgetId={budget.id} />
        </div>
      ]}
      className={`${isSelected(budget.id) ? 'bg-blue-50 hover:bg-blue-100' : index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}`}
      index={index}
    />
  );

  return (
    <TableShadowWrapper maxHeight="calc(100vh - 500px)">
      <table className="min-w-full bg-white border-collapse table-auto">
        <TableHead headers={headers} />
        <TableBody
          data={budgets}
          renderRow={renderRow}
          emptyMessage="No budgets found."
        />
      </table>
    </TableShadowWrapper>
  );
};

export default BudgetTable;