import React from "react";
import { Permission } from "@/types";
import MultiSelect, { MultiSelectOption } from "../atoms/MultiSelect";

const PERMISSIONS: {
  value: Permission;
  label: string;
  description: string;
  parent?: string;
}[] = [
  {
    value: "manage_users",
    label: "Manage Users",
    description: "Can manage users and their permissions",
  },
  {
    value: "create_users",
    label: "Create Users",
    description: "Can create new users",
    parent: "manage_users",
  },
  {
    value: "get_users",
    label: "Get Users",
    description: "Can view user information",
    parent: "manage_users",
  },
  {
    value: "manage_suppliers",
    label: "Manage Suppliers",
    description: "Can manage suppliers and their information",
  },
  {
    value: "create_suppliers",
    label: "Create Suppliers",
    description: "Can create new suppliers",
    parent: "manage_suppliers",
  },
  {
    value: "get_suppliers",
    label: "Get Suppliers",
    description: "Can view supplier information",
    parent: "manage_suppliers",
  },
  {
    value: "manage_purchase_requisitions",
    label: "Manage Purchase Requisitions",
    description: "Can manage purchase requisitions",
  },
  {
    value: "create_purchase_requisitions",
    label: "Create Purchase Requisitions",
    description: "Can create new purchase requisitions",
    parent: "manage_purchase_requisitions",
  },
  {
    value: "get_purchase_requisitions",
    label: "Get Purchase Requisitions",
    description: "Can view purchase requisitions",
    parent: "manage_purchase_requisitions",
  },
  {
    value: "manage_purchase_orders",
    label: "Manage Purchase Orders",
    description: "Can manage purchase orders",
  },
  {
    value: "create_purchase_orders",
    label: "Create Purchase Orders",
    description: "Can create new purchase orders",
    parent: "manage_purchase_orders",
  },
  {
    value: "get_purchase_orders",
    label: "Get Purchase Orders",
    description: "Can view purchase orders",
    parent: "manage_purchase_orders",
  },
  {
    value: "manage_products",
    label: "Manage Products",
    description: "Can manage products",
  },
  {
    value: "create_products",
    label: "Create Products",
    description: "Can create new products",
    parent: "manage_products",
  },
  {
    value: "get_products",
    label: "Get Products",
    description: "Can view products",
    parent: "manage_products",
  },
  {
    value: "manage_budgets",
    label: "Manage Budgets",
    description: "Can manage budgets",
  },
  {
    value: "create_budgets",
    label: "Create Budgets",
    description: "Can create new budgets",
    parent: "manage_budgets",
  },
  {
    value: "delete_budgets",
    label: "Delete Budgets",
    description: "Can Delete budgets",
    parent: "manage_budgets",
  },
  {
    value: "update_budgets",
    label: "Update Budgets",
    description: "Can Update budgets",
    parent: "manage_budgets",
  },
];
interface PermissionSelectProps {
  value: Permission[];
  onChange: (value: Permission[]) => void;
  error?: string;
}

const PermissionSelect: React.FC<PermissionSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  const options: MultiSelectOption<Permission>[] = PERMISSIONS.reduce(
    (acc, permission) => {
      if (!permission.parent) {
        const option: MultiSelectOption<Permission> = {
          label: permission.label,
          value: permission.value,
          description: permission.description,
          options: PERMISSIONS.filter((p) => p.parent === permission.value).map(
            (child) => ({
              label: child.label,
              value: child.value,
              description: child.description,
            })
          ),
        };
        acc.push(option);
      }
      return acc;
    },
    [] as MultiSelectOption<Permission>[]
  );

  const selectedOptions: MultiSelectOption<Permission>[] = PERMISSIONS.filter(
    (p) => value.includes(p.value)
  ).map((permission) => ({
    label: permission.label,
    value: permission.value,
    description: permission.description,
  }));

  const handleChange = (selected: MultiSelectOption<Permission>[]) => {
    const selectedValues = selected.map((option) => option.value);
    onChange([...new Set(selectedValues)]);
  };

  const CustomOption: React.FC<{
    data: MultiSelectOption<Permission>;
    isSelected: boolean;
  }> = ({ data, isSelected }) => {
    const isParent = !PERMISSIONS.find((p) => p.value === data.value)?.parent;

    return (
      <div
        className={`
          py-2 px-3 
          ${
            isParent
              ? "bg-blue-50 border-b border-blue-100"
              : "bg-white hover:bg-gray-50"
          } 
          ${isSelected ? (isParent ? "bg-blue-100" : "bg-gray-100") : ""}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isParent ? (
              <span className="text-blue-700 font-semibold">{data.label}</span>
            ) : (
              <div className="flex items-center">
                <span className="w-4 h-px bg-gray-300 mx-2" />
                <span className="#181819">{data.label}</span>
              </div>
            )}
          </div>
          {isSelected && (
            <span className={isParent ? "text-blue-600" : "text-gray-600"}>
              ✓
            </span>
          )}
        </div>
        {data.description && (
          <p
            className={`
            text-sm mt-1 
            ${isParent ? "text-blue-600 font-medium" : "text-gray-500 ml-8"}
          `}
          >
            {data.description}
          </p>
        )}
      </div>
    );
  };

  return (
    <MultiSelect<Permission>
      label="Permission Level"
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      error={error}
      isMulti
      customOptionComponent={CustomOption}
      className="w-full"
      placeholder="Select permissions..."
    />
  );
};

export default PermissionSelect;
