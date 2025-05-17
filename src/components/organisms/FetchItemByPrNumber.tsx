"use client";

import useStore from "@/store";
import Button from "../atoms/Button";
import TableSkeleton from "../atoms/Skeleton/Table";
import ErrorComponent from "../molecules/ErrorComponent";
import { AllItems } from "@/types";
import useFetchItemsByPrNumber from "@/hooks/useFetchAllItemsByPrNumber";
import useRemoveItem from "@/hooks/useRemoveItems";
// import UpdateItem from "./UpdateItem";
import TableCell from "../atoms/TableCell";
import TableHead from "../atoms/TableHead";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { format_price } from "@/utils/helpers";
import { useGetRequisitions } from "@/hooks/useGetRequisition";
import TableBody from "../atoms/TableBody";
import TableRow from "../molecules/TableRow";
import { useMemo } from "react";

const FetchItemByPrNumber = () => {
  const { currentOrg, pr } = useStore();
  const { isDisabled, showForSavedOnly } = useGetRequisitions();
  const { data, error, isLoading, isError } = useFetchItemsByPrNumber(currentOrg, pr?.pr_number || "", 100, 1);
  const products = useMemo(() => data?.data?.data || [], [data]);
  const { removeItem } = useRemoveItem();
  
  // Calculate totals
  const totals = useMemo(() => {
    if (!products.length) return { quantity: 0, cost: 0, currency: 'USD' };
    
    const totalQuantity = products.reduce((acc, item) => acc + item.pr_quantity, 0);
    const totalCost = products.reduce((acc, item) => acc + (item.pr_quantity * item.unit_price), 0);
    // Get currency from first item (assuming all items have same currency)
    const currency = products[0]?.currency || 'USD';
    
    return { quantity: totalQuantity, cost: totalCost, currency };
  }, [products]);

  const handleRemove = async (id: string) => {
    await removeItem(id, currentOrg);
  };

  if (isLoading) return <TableSkeleton />;
  if (isError) return <ErrorComponent text={error?.message || "Failed to fetch products."} />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headers: string | any = ["Item Image", "Item Name", "Description", "Unit Price", "Quantity", (showForSavedOnly && "Actions")];
  const renderRow = (item: AllItems, index: number) => {
    const rowData = [
      <TableCell key="image" className="flex justify-center items-center text-center">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.item_name}
            width={25}
            height={25}
            className="object-cover rounded-full w-[30px] h-[30px] bg-cover"
          />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
      </TableCell>,
      <TableCell key="name" className="flex justify-center items-center text-center">{item.item_name}</TableCell>,
      <TableCell key="description" className="flex justify-center items-center text-center">{item.description || "No Description"}</TableCell>,
      <TableCell key="price" className="flex justify-center items-center text-center">{format_price(item.unit_price, item.currency)}</TableCell>,
      <TableCell key="quantity" className="flex justify-center items-center text-center">{item.pr_quantity}</TableCell>,
      showForSavedOnly && (<TableCell key="actions" className="flex gap-2 justify-center">
        <Button
          key={item.id}
          type="button"
          disabled={!!isDisabled}
          onClick={() => handleRemove(item.id)} className="bg-[#F10000] text-white p-2 flex justify-center items-center max-w-8 rounded-full">
          <FaTimes />
        </Button>
      </TableCell>)
    ]
    return (
      <TableRow
        key={item.id}
        data={rowData}
        index={index}
        className={`transition-colors text-center`}
      />
    )
  }
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-[#808080] border-opacity-50 text-center">
          <TableHead headers={headers} key={headers.length} />
          <TableBody
            data={products}
            renderRow={renderRow}
            emptyMessage="No items found."
          />
        </table>
      </div>
      
      {products.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-end gap-4 px-4 py-3 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
            <div className="flex items-center">
              <span className="text-gray-600 font-medium mr-2">Total Quantity:</span>
              <span className="font-bold text-gray-800">{totals.quantity.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-600 font-medium mr-2">Estimated Cost:</span>
              <span className="font-bold text-primary">
                {format_price(totals.cost, totals.currency)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchItemByPrNumber;