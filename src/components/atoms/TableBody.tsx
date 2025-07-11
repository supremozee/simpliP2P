import React from 'react';

interface TableBodyProps<T> {
  data: T[];
  renderRow: (item: T, i: number) => React.ReactNode;
  emptyMessage: string;
}

const TableBody = <T,>({ data, renderRow, emptyMessage }: TableBodyProps<T>) => {
  return (
    <tbody className='divide-y divide-gray-200'>
      {data.length > 0 ? (
        data.map(renderRow)
      ) : (
        <tr>
          <td colSpan={10} className="px-6 py-10 text-left">
            <section className="flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="text-gray-500 font-medium">{emptyMessage}</p>
            </section>
          </td>
        </tr>
      )}
    </tbody>
  );
};

export default TableBody;