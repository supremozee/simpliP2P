"use client";

import useStore from "@/store";
import Button from "../atoms/Button";
import TableSkeleton from "../atoms/Skeleton/Table";
import ErrorComponent from "../molecules/ErrorComponent";
import { AllItems } from "@/types";
import useFetchItemsByPrNumber from "@/hooks/useFetchAllItemsByPrNumber";
import useRemoveItem from "@/hooks/useRemoveItems";
import UpdateItem from "./UpdateItem";
import TableCell from "../atoms/TableCell";
import TableHead from "../atoms/TableHead";
import Image from "next/image";
import {  FaTimes } from "react-icons/fa";
import { format_price } from "@/utils/helpers";
import { useGetRequisitions } from "@/hooks/useGetRequisition";

const FetchItemByPrNumber = () => {
  const { currentOrg, pr } = useStore();
  const {isDisabled} = useGetRequisitions()
  const { data, error, isLoading, isError } = useFetchItemsByPrNumber(currentOrg, pr?.pr_number || "", 100, 1);
  const products = data?.data?.data || [];
  const { removeItem } = useRemoveItem();
  const handleRemove = async (id: string) => {
    await removeItem(id, currentOrg);
  };

  if (isLoading) return <TableSkeleton />;
  if (isError) return <ErrorComponent text={error?.message || "Failed to fetch products."} />;

  const headers = ["Item Image", "Item Name", "Description", "Unit Price", "Quantity", "Actions"];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <TableHead headers={headers} />
        <tbody>
          {products?.map((item: AllItems) => (
            <tr key={item.id} className="border-b text-center">
              <TableCell className="flex justify-center items-center">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.item_name} width={25} height={25} className="object-cover rounded-full w-[30px] h-[30px] bg-cover" />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </TableCell>
              <TableCell>{item.item_name}</TableCell>
              <TableCell>{item.description || "No Description"}</TableCell>
              <TableCell>{format_price(item.unit_price, item.currency)}</TableCell>
              <TableCell>{item.pr_quantity}</TableCell>
              <TableCell className="flex gap-2 justify-center">
                <UpdateItem id={item.id}
                disabled={!!isDisabled}
                />
                <Button 
                    type="button"
                    disabled={!!isDisabled}
                    onClick={() => handleRemove(item.id)} className="bg-[#F10000] text-white p-2 flex justify-center items-center max-w-8  rounded-full">
                  <FaTimes />
                </Button>
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FetchItemByPrNumber;