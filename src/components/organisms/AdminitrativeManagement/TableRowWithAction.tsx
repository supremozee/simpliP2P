import TableRow from "@/components/molecules/TableRow";
import React from "react";
import { Branch, Category, Department, Supplier } from "@/types";
import { VscEdit } from "react-icons/vsc";
import Button from "@/components/atoms/Button";
import { FaTimes } from "react-icons/fa";
import StarRating from "@/components/atoms/StarRating";
import useUserPermissions from "@/hooks/useUserPermissions";

type Item = Branch | Department | Category | Supplier;

interface TableRowWithActionsProps<T extends Item> {
  item: T;
  activeTab?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  index?: number;
}

const TableRowWithActions = <T extends Item>({
  item,
  activeTab,
  onEdit,
  onDelete,
  index = 0,
}: TableRowWithActionsProps<T>) => {
  const {checkPermission} = useUserPermissions()
  const renderData = () => {
    switch (activeTab) {
      case "Branches":
        if ("name" in item) return [item.name];
        break;
      case "Departments":
        if ("name" in item)  return [
            item.name
          ];
        break;
      case "Categories":
        if ("name" in item) return [item.name];
        break;
      default:
        if ("full_name" in item) return [
          `${item.supplier_no?.split("-")[0]}-${item.supplier_no?.split("-").pop()}`,
          item.full_name,
          new Date(item.created_at.split("T")[0]).toLocaleDateString('en-US', {year:'numeric', month: 'short', day: 'numeric'}),
          item?.category.name,
          <div key={item.id}>
            <StarRating
              isTable={true}
              rating={Number(item.rating)}
              setRating={() => {}}
              showLabel={false}
            />
          </div>
        ];
    }
    return [];
  };

  const renderActions = () => {
    if (!activeTab && "full_name" in item) {
      return (
        <div className="flex gap-3 justify-center">
         <Button
            onClick={() => onEdit?.(item.id)}
            disabled= {!checkPermission(['update_suppliers', 'manage_suppliers'])}
            className="flex justify-center items-center w-6 h-6 text-white px-0 py-0 rounded-full bg-primary"
          >
            <VscEdit size={12} />
          </Button>
        <Button
            onClick={() => onDelete?.(item.id)}
            disabled={!checkPermission(['delete_suppliers', 'manage_suppliers'])}
            className="text-white px-0 py-0 rounded-full flex justify-center items-center w-6 h-6 bg-red-700"
          >
            <FaTimes size={12} />
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <TableRow data={renderData()} index={index} className="">
      {renderActions()}
    </TableRow>
  );
};

export default TableRowWithActions;