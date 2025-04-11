import React from 'react';

interface TableBodyProps<T> {
  data: T[];
  renderRow: (item: T, i:number) => React.ReactNode;
  emptyMessage: string;
}

const TableBody = <T,>({ data, renderRow, emptyMessage }: TableBodyProps<T>) => {
  return (
    <tbody className='divide-y divide-gray-200'>
      {data.length > 0 ? (
        data.map(renderRow)
      ) : (
        <tr>
          <td colSpan={8} className="text-center py-4">
            {emptyMessage}
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default TableBody;