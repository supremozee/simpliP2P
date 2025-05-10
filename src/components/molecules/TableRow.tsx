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
    <tr className={cn(
      "group transition-all duration-200 text-center ease-in-out border-b", 
      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50',
      "hover:bg-blue-50/30",
      className
    )}>
      {data?.map((cell, idx) => (
        <TableCell key={idx}>{cell}</TableCell>
      ))}
      {hasActions && children && <TableCell>{children}</TableCell>}
    </tr>
  );
};

export default TableRow;