import React from 'react';

interface TableHeadProps {
  headers: (string | React.ReactNode)[];
  index?: number;
}

const TableHead: React.FC<TableHeadProps> = ({ headers, index }) => {
  return (
    <thead className="sticky top-0 z-50" >
      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm" key={index}>
        {headers.map((header, idx) => (
          <th 
            key={idx}
            className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-xs text-gray-700 uppercase tracking-wider "
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;