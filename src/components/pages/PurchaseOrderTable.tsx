import React from 'react';
import TableHead from '../atoms/TableHead';
import TableBody from '../atoms/TableBody';
import useFetchAllOrders from '@/hooks/useFetchAllOrders';
import useStore from '@/store';
import { Order } from '@/types';
import TableCell from '../atoms/TableCell';
import { format_price } from '@/utils/helpers';


const PurchaseOrderTable= () => {
  const {currentOrg} = useStore()
  const { data, isLoading, isError } = useFetchAllOrders(currentOrg);
  const orders = data?.data.orders
  const headers = [
    'S/N',
    'Item Code',
    'Description',
    'QTY',
    'Unit',
    'Total Amount'
  ];

  const renderRow = (item: Order, index: number) => (
    <tr key={index} className="border-b">
      <TableCell>{index + 1}</TableCell>
      <TableCell>{item.po_number}</TableCell>
      <TableCell>{item.purchase_requisition.request_description}</TableCell>
      <TableCell>{item.purchase_requisition.quantity}</TableCell>
      <TableCell>0 unit</TableCell>
      <TableCell>
        {format_price(Number(item.total_amount), item.currency)}
      </TableCell>
    </tr>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading purchase orders</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <TableHead headers={headers} />
        <TableBody
          data={orders || []}
          renderRow={renderRow}
          emptyMessage="No purchase orders found"
        />
        {orders && orders.length > 0 && (
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={7} className="border px-4 py-2 text-right font-bold">
                Total Amount:
              </td>
              <td className="border px-4 py-2 text-right font-bold">
                {}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default PurchaseOrderTable; 