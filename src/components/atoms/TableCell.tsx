import { cn } from '@/utils/cn';
import React from 'react'

const TableCell = ({ children, className }: {children:React.ReactNode, className?:string}) => (
    <td className={cn(`border-r py-2 ${className}`)}>{children}</td>
  );

export default TableCell