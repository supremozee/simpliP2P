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
  return (
    <li className="w-full list-none">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
          {number}
        </div>
        {(title || description) && (
          <div>
            {title && <h3 className="text-lg font-medium text-gray-800">{title}</h3>}
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        )}
      </div>
      <div className="pl-12">
        {children}
      </div>
    </li>
  );
};

export default NumberedListItem;