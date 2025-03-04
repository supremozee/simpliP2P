import TableRow from '../molecules/TableRow';
import { Budget } from '@/types';
import TableHead from '../atoms/TableHead';
import TableBody from '../atoms/TableBody';
import OpenBudget from './OpenBudget';
import { format_price } from '@/utils/helpers';
const BudgetTable = ({budgets}: {budgets:Budget[]}) => {
  
  const headers = [
    "Date Allocated",
    "Budget Name",
    "Branch",
    "Department",
    "Creator",
    "Budget Amount",
    "Currency",
    "Budget Balance",
    "Action"
  ];

  const renderRow = (budget: Budget, index: number) => (
    <TableRow
      key={budget.id}
      data={[
        new Date(budget.created_at).toLocaleDateString(),
        budget.name,
        budget.branch.name,
        budget.department.name,
        budget.name,
        format_price(Number(budget.amount_allocated), budget.currency),
        budget.currency,
        format_price(Number(budget.balance), budget.currency),,
        <div  key={`edit-button-${budget.id}`}  title='View Budget' className='flex justify-center w-full items-center'>
          <OpenBudget budgetId={budget.id} />
        </div>
      ]}
      index={index}
    />
  );


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-[#80808050]">
        <TableHead headers={headers} />
        <TableBody data={budgets || []} renderRow={renderRow} emptyMessage="No budgets available." />
      </table>
    </div>
  );
};

export default BudgetTable;