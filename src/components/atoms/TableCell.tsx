import { cn } from '@/utils/cn';
import React from 'react'

const TableCell = ({ children, className }: {children:React.ReactNode, className?:string}) => (
    <td className={cn(`px-4 py-3 text-sm whitespace-nowrap transition-colors group-hover:bg-gray-50`, className)}>{children}</td>
  );

export default TableCell