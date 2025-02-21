import React from 'react';

interface TableHeadProps {
  headers: string[];
}

const TableHead: React.FC<TableHeadProps> = ({ headers }) => {
  return (
    <thead>
      <tr className="bg-gray-100">
        {headers.map((header) => (
          <th key={header} className="border border-gray-300 px-4 py-2 text-left text-[10px] ">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;