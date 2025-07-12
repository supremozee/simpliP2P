import React from 'react'
import { FaFileInvoiceDollar } from 'react-icons/fa'
import ErrorComponent from '../molecules/ErrorComponent'
import TableHead from '../atoms/TableHead'
import TableSkeleton from '../atoms/Skeleton/Table'
import TableBody from '../atoms/TableBody'
import TableRow from '../molecules/TableRow'
import { format_price } from '@/utils/helpers'
import useFetchItemsByPrNumber from '@/hooks/useFetchAllItemsByPrNumber'
import useStore from '@/store'
import { OrderRequisitionType} from '@/types'

const OrderTable = ({requisition}: {requisition:OrderRequisitionType}) => {
  const { currentOrg, pr } = useStore();
   const {
    data: itemData,
    error,
    isLoading: isLoadingItem,
  } = useFetchItemsByPrNumber(currentOrg, pr?.pr_number || "", 100, 1);
  const items = itemData?.data?.data;
      const calculateTotal = (): number => {
    return requisition?.estimated_cost || 0;
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaFileInvoiceDollar className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-primary"></h3>
                </div>
                <div className="overflow-x-auto">
                  <div className="overflow-x-auto">
                    {error ? (
                      <ErrorComponent text="Error fetching items" />
                    ) : (
                      <table className="w-full border border-[#80808050]">
                        <TableHead
                          headers={[
                            "Item Name",
                            "Quantity",
                            "Unit Price",
                            "Total",
                          ]}
                        />
                        {isLoadingItem ? (
                          <TableSkeleton />
                        ) : (
                          <TableBody
                            data={items || []}
                            renderRow={(item, i) => (
                              <TableRow
                                key={item.id || i}
                                data={[
                                  item.item_name || "Unnamed Item",
                                  item.pr_quantity,
                                  format_price(
                                    item.unit_price || 0,
                                    item?.currency
                                  ),
                                  format_price(
                                    (item.unit_price || 0) *
                                      (item.pr_quantity || 0),
                                    item?.currency
                                  ),
                                ]}
                                index={i}
                              />
                            )}
                            emptyMessage="No items found"
                          />
                        )}
                      </table>
                    )}
                  </div>
                  <div className="flex justify-end mt-4">
                    <div className="bg-gray-50 px-4 py-2 rounded-lg">
                      <span className="text-sm text-gray-500">
                        Total Amount:{" "}
                      </span>
                      <span className="text-lg font-semibold text-primary">
                        {format_price(calculateTotal(), requisition?.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
  )
}

export default OrderTable