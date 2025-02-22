import TableRow from "@/components/molecules/TableRow";
import React from "react";
import DropdownActions from "./DropDownActions";
import { Branch, Category, Department, Supplier } from "@/types";
import { VscEdit } from "react-icons/vsc";
import Button from "@/components/atoms/Button";
import { FaTimes } from "react-icons/fa";
import StarRating from "@/components/atoms/StarRating";

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
  const renderData = () => {
    switch (activeTab) {
      case "Branches":
        if ("name" in item) return [item.name];
        break;
      case "Departments":
        if ("organisation" in item) {
          const department = item as Department;
          const headOfDepartment = department.head_of_department
            ? `${department.head_of_department.first_name} ${department.head_of_department.last_name}`
            : "N/A";
          return [
            department.name,
            department.organisation?.tenant_code,
            headOfDepartment,
          ];
        }
        break;
      case "Categories":
        if ("name" in item) return [item.name];
        break;
      default:
        if ("full_name" in item) return [
          item.full_name,
          item.created_at.split('T')[0],
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
    if (activeTab === "Categories" && "deactivated_at" in item) {
      return <DropdownActions itemId={item.id || ""} />;
    }
    if (!activeTab && "full_name" in item) {
      return (
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => onEdit?.(item.id)}
            className="flex justify-center items-center w-6 h-6 text-white px-0 py-0 rounded-full bg-primary"
          >
            <VscEdit size={12} />
          </Button>
          <Button
            onClick={() => onDelete?.(item.id)}
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