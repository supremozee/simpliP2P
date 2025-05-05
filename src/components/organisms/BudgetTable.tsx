import React from 'react';
import { Budget } from '@/types';
import { format_price } from '@/utils/helpers';
import TableShadowWrapper from '../atoms/TableShadowWrapper';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

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

  return (
    <TableShadowWrapper maxHeight="calc(100vh - 500px)">
      <table className="min-w-full bg-white border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">
              <button 
                onClick={handleSelectAll}
                className="flex items-center justify-center w-5 h-5 focus:outline-none"
                aria-label={selectedItems.length === budgets.length ? "Deselect all budgets" : "Select all budgets"}
              >
                {selectedItems.length > 0 && selectedItems.length === budgets.length ? (
                  <MdCheckBox size={20} className="text-primary" />
                ) : (
                  <MdCheckBoxOutlineBlank size={20} className="text-gray-400" />
                )}
              </button>
            </th>
            <th className="py-3 px-4 text-left">Budget Name</th>
            <th className="py-3 px-4 text-left">Allocated Amount</th>
            <th className="py-3 px-4 text-left">Available Balance</th>
            <th className="py-3 px-4 text-left">Reserved Amount</th>
            <th className="py-3 px-4 text-left">Created Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {budgets.map((budget) => (
            <tr 
              key={budget.id} 
              className={`hover:bg-gray-50 transition-colors ${
                isSelected(budget.id) ? 'bg-blue-50 hover:bg-blue-100' : ''
              }`}
            >
              <td className="py-3 px-4">
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
              </td>
              <td className="py-3 px-4 font-medium">{budget.name}</td>
              <td className="py-3 px-4">{format_price(parseFloat(budget.amount_allocated), budget.currency)}</td>
              <td className="py-3 px-4">
                <span className={`${
                  parseFloat(budget.amount_available) <= 0 
                    ? 'text-red-600' 
                    : parseFloat(budget.amount_available) < parseFloat(budget.amount_allocated) / 5 
                      ? 'text-amber-600' 
                      : 'text-green-600'
                }`}>
                  {format_price(parseFloat(budget.amount_available), budget.currency)}
                </span>
              </td>
              <td className="py-3 px-4">{format_price(parseFloat(budget.amount_reserved), budget.currency)}</td>
              <td className="py-3 px-4 text-gray-500">
                {new Date(budget.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShadowWrapper>
  );
};

export default BudgetTable;