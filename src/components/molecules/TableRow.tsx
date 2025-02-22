import React from 'react';
import { cn } from '@/utils/cn';
import TableCell from '../atoms/TableCell';

interface TableRowProps {
  data: (string | React.ReactNode)[];
  index?: number;
  className?: string;
  children?: React.ReactNode;
  hasActions?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({ data, index = 0, className, children, hasActions = true }) => {
  return (
    <tr className={cn("text-center text-[10px] font-medium", index % 2 ? 'bg-tertiary text-black border-r-0' : 'bg-white', className)}>
      {data?.map((cell, idx) => (
        <TableCell key={idx}>{cell}</TableCell>
      ))}
      {hasActions && children && <TableCell>{children}</TableCell>}
    </tr>
  );
};

export default TableRow;