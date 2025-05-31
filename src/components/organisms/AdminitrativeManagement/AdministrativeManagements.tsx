/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import useFetchBranch from "@/hooks/useFetchBranch";
import useFetchDepartment from "@/hooks/useFetchDepartments";
import useStore from "@/store";
import CreateComponent from "./CreateComponent";
import TableHeaders from "./TableHeaders";
import Tabs from "@/components/molecules/Tabs";
import TableBody from "@/components/atoms/TableBody";
import useFetchCategories from "@/hooks/useFetchCategories";
import TableSkeleton from "@/components/atoms/Skeleton/Table";
import useDeleteBranch from "@/hooks/useDeleteBranch";
import useDeleteDepartment from "@/hooks/useDeleteDepartment";
import useDeactivateCategory from "@/hooks/useDeactivateCategory";
import useReactivateCategory from "@/hooks/useReactivateCategory";
import { HiOutlinePencil, HiCheck, HiXMark } from "react-icons/hi2";
import ConfirmActionModal from "./ConfirmActionModal";
import EditCategoryModal from "../Edit/EditCategoryModal";
import EditBranchModal from "../Edit/EditBranchModal";
import EditDepartmentModal from "../Edit/EditDepartmentModal";
import { Branch, Category, Department } from "@/types";
import Button from "@/components/atoms/Button";
import { FaTimes } from "react-icons/fa";

const EnhancedTableRowWithActions = ({ 
  index, 
  activeTab, 
  item 
}: { 
  index: number;
  activeTab: string;
  item: any;
}) => {
  const { currentOrg } = useStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const { deleteBranch, isDeleting: isDeletingBranch } = useDeleteBranch();
  const { deleteDepartment, isDeleting: isDeletingDepartment } = useDeleteDepartment();
  const { deactivateCategory, isDeactivating } = useDeactivateCategory();
  const { reactivateCategory, isReactivating } = useReactivateCategory();

  const isActive =  item.deactivated_at === null;
  
  const handleDelete = async () => {
    try {
      if (activeTab === "Branches") {
        await deleteBranch(currentOrg, item.id);
      } else if (activeTab === "Departments") {
        await deleteDepartment(currentOrg, item.id);
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error(`Error deleting ${activeTab.slice(0, -1)}:`, error);
    }
  };

  const handleStatusChange = async () => {
    try {
      if (activeTab === "Categories") {
        if (isActive) {
          await deactivateCategory(currentOrg, item.id);
        } else {
          await reactivateCategory(currentOrg, item.id);
        }
      }
      setShowStatusModal(false);
    } catch (error) {
      console.error(`Error changing status:`, error);
    }
  };

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-50">
      <td className="px-4 py-2 text-center">{index + 1}</td>
      <td className="px-4 py-2">{item.name}</td>
      
      {activeTab === "Branches" && (
        <td className="px-4 py-2">{item.address || "N/A"}</td>
      )}
      
      {activeTab === "Departments" && (
        <>
          <td className="px-4 py-2">{item.department_code || "N/A"}</td>
          <td className="px-4 py-2">
            {item.head_of_department ? (
              <span className="text-sm font-medium">
                {item.head_of_department.first_name} {item.head_of_department.last_name}
              </span>
            ) : (
              <span className="text-sm text-gray-500">Not assigned</span>
            )}
          </td>
        </>
      )}

      {activeTab === "Categories" && (
        <td className="px-4 py-2 text-center">
          <span 
            className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
              isActive 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? (
              <HiCheck className="mr-1 h-3 w-3" />
            ) : (
              <HiXMark className="mr-1 h-3 w-3" />
            )}
            {isActive ? "Active" : "Inactive"}
          </span>
        </td>
      )}
      
      <td className="px-4 py-2 text-center">
        <div className="flex gap-2 justify-center items-center">
          <Button
            onClick={() => setShowEditModal(true)}
            className="text-white p-2 flex justify-center items-center max-w-8 rounded-full bg-primary"
          >
            <HiOutlinePencil className="h-4 w-4" />
          </Button>
          
          {activeTab !== "Categories" ? (
            <Button
              onClick={() => setShowDeleteModal(true)}
              className="bg-[#F10000] text-white p-2 flex justify-center items-center max-w-8 rounded-full"
              disabled={isDeletingBranch || isDeletingDepartment}
            >
              <FaTimes className="h-4 w-4" />
            </Button>
          ) : (
            <Button
          onClick={() => setShowStatusModal(true)}
          className={`p-2 flex justify-center items-center max-w-8 rounded-full text-white ${
            isActive 
              ? "bg-amber-500 hover:bg-amber-600" 
              : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={isDeactivating || isReactivating}
  >
    {isActive ? <HiXMark className="h-4 w-4" /> : <HiCheck className="h-4 w-4" />}
  </Button>
          )}
        </div>
      </td>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmActionModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={`Delete ${activeTab.slice(0, -1)}`}
          message={`Are you sure you want to delete this ${activeTab.slice(0, -1)}? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDelete}
          isProcessing={isDeletingBranch || isDeletingDepartment}
        />
      )}

      {/* Status Change Confirmation Modal */}
      {showStatusModal && (
        <ConfirmActionModal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          title={isActive ? "Deactivate Category" : "Activate Category"}
          message={`Are you sure you want to ${isActive ? "deactivate" : "activate"} this category?`}
          confirmText={isActive ? "Deactivate" : "Activate"}
          onConfirm={handleStatusChange}
          isProcessing={isDeactivating || isReactivating}
        />
      )}

      {/* Edit Modals */}
      {showEditModal && activeTab === "Branches" && (
        <EditBranchModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          branch={item as Branch}
        />
      )}

      {showEditModal && activeTab === "Departments" && (
        <EditDepartmentModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          department={item as Department}
        />
      )}

      {showEditModal && activeTab === "Categories" && (
        <EditCategoryModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          category={item as Category}
        />
      )}
    </tr>
  );
};

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

  const getTabCount = (tabName: string) => {
    switch (tabName) {
      case "Branches":
        return branch.filter(req => req.name).length;
      case "Departments":
        return department.filter(req => req.name).length;
      case "Categories":
        return category.filter(req => req.name).length;
      default:
        return 0;
    }
  }
  
  const tabCounts = TabName.map(getTabCount);

  return (
    <div className="p-6">
      <Tabs
        tabNames={TabName}
        active={activeTab}
        setActive={setActiveTab}
        counts={tabCounts}
      />
      
      <div className="flex justify-between items-center mt-4">
        <h2 className="text-xl font-semibold text-gray-800">Manage {activeTab}</h2>
        <CreateComponent activeTab={activeTab} />
      </div>

      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        {(branchLoading || departmentLoading || categoryLoading) ? (
          <TableSkeleton />
        ) : (
          <table className="w-full table-auto">
            <TableHeaders activeTab={activeTab} />
            <TableBody
              data={getDataForActiveTab()}
              renderRow={(item, index) => (
                <EnhancedTableRowWithActions
                  index={index}
                  activeTab={activeTab}
                  key={item.id}
                  item={item}
                />
              )}
              emptyMessage={`No ${activeTab.toLowerCase()} found. Click 'Add New' to create one.`}
            />
          </table>
        )}
      </div>
    </div>
  );
};

export default AdministrativeManagements;