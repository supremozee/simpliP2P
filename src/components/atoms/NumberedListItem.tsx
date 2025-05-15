import { useGetRequisitions } from '@/hooks/useGetRequisition';
import useStore from '@/store';
import React from 'react';

interface NumberedListItemProps {
  number: number;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const NumberedListItem: React.FC<NumberedListItemProps> = ({ 
  number, 
  children,
  title,
  description 
}) => {
  const {pr} = useStore()
    const {
      savedRequisitions,
    } = useGetRequisitions();
  const showSelectedItems = savedRequisitions.find((req)=>req.pr_number === pr?.pr_number)
  return (
    <li className="w-full list-none" onClick={(e)=>e.stopPropagation()}>
      <div className="flex items-start sm:gap-4 gap-2 mb-4">
        {showSelectedItems&&
       ( <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
          {number}
        </div>)
        }
        {(title || description) && (
          <div>
            {title && <h3 className="sm:text-lg text-sm font-medium text-gray-800">{title}</h3>}
            {description && <p className="sm:text-sm text-[12px] text-gray-600">{description}</p>}
          </div>
        )}
      </div>
      <div className="sm:pl-12">
        {children}
      </div>
    </li>
  );
};

export default NumberedListItem;