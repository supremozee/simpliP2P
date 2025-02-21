"use client";

import React, { useState } from "react";
import useFetchBranch from "@/hooks/useFetchBranch";
import useFetchDepartment from "@/hooks/useFetchDepartments";
import useStore from "@/store";
import CreateComponent from "./CreateComponent";
import TableHeaders from "./TableHeaders";
import Tabs from "@/components/molecules/Tabs";
import TableBody from "@/components/atoms/TableBody";
import TableRowWithActions from "./TableRowWithAction";
import useFetchCategories from "@/hooks/useFetchCategories";
import TableSkeleton from "@/components/atoms/Skeleton/Table";

const AdministrativeManagements = () => {
  const TabName = ["Branches", "Departments", "Categories"];
  const [activeTab, setActiveTab] = useState(TabName[0]);
  const { currentOrg } = useStore();
  const { data: branchData, isLoading: branchLoading } = useFetchBranch(currentOrg);
  const { data: departmentData, isLoading: departmentLoading } = useFetchDepartment(currentOrg);
  const { data: categoryData, isLoading: categoryLoading } = useFetchCategories(currentOrg);

  const branch = branchData?.data?.branches || [];
  const department = departmentData?.data?.departments || [];
  const category = categoryData?.data?.categories || [];

  const getDataForActiveTab = () => {
    switch (activeTab) {
      case "Branches":
        return branch;
      case "Departments":
        return department;
      case "Categories":
        return category;
      default:
        return [];
    }
  };

  return (
    <div className="p-6">
      <Tabs tabNames={TabName} active={activeTab} setActive={setActiveTab} counts={[9]} />
      <div className="flex justify-between items-center mt-4">
        <h2 className="text-xl font-bold">Manage {activeTab}</h2>
        <CreateComponent activeTab={activeTab} />
      </div>

      <div className="mt-6">
        {(branchLoading || departmentLoading || categoryLoading) ? (
          <TableSkeleton />
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <TableHeaders activeTab={activeTab} />
            <TableBody
              data={getDataForActiveTab()}
              renderRow={(item, index) => (
                <TableRowWithActions
                  index={index}
                  activeTab={activeTab}
                  key={item.id}
                  item={item}
                />
              )}
              emptyMessage={`No ${activeTab} found.`}
            />
          </table>
        )}
      </div>
    </div>
  );
};

export default AdministrativeManagements;