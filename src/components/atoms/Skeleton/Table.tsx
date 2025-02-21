import React from "react";

const TableSkeleton = () => (
  <div className="animate-pulse">
    <table className="w-full border">
      <thead>
        <tr>
          {["Product Name", "Description", "Unit Price", "Quantity", "Stock Alert", "Category"].map((header) => (
            <th key={header} className="p-2 border-b bg-gray-200">
              <div className="h-4 bg-gray-300 rounded-md w-32"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: 6 }).map((_, colIndex) => (
              <td key={colIndex} className="p-4 border-b">
                <div className="h-4 bg-gray-300 rounded-md w-full"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableSkeleton;
