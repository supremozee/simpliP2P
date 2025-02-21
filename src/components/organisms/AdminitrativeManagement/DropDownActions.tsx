import useDeactivateCategory from "@/hooks/useDeactivateCategory";
import useEditCategory from "@/hooks/useEditCategory";
import useFetchCategories from "@/hooks/useFetchCategories";
import useReactivateCategory from "@/hooks/useReactivateCategory";
import useStore from "@/store";
import React, { useState, useEffect } from "react";

interface DropdownActionsProps {
  itemId: string;
}

const DropdownActions: React.FC<DropdownActionsProps> = ({ itemId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentOrg, setDeactivated, deactivated } = useStore();
  const { data: categoryData, isLoading } = useFetchCategories(currentOrg);
  const { editCategory } = useEditCategory();
  const { deactivateCategory } = useDeactivateCategory();
  const { reactivateCategory } = useReactivateCategory();
  const fetchCategory = categoryData?.data?.categories.find((category) => category.id === itemId);

  const isDeactivated = fetchCategory?.deactivated_at && new Date(fetchCategory.deactivated_at) <= new Date();

  const handleEdit = (id: string) => {
    editCategory(currentOrg, id);
    setIsOpen(false); 
  };

  const handleToggleActivation = (id: string) => {
    if (isDeactivated) {
      reactivateCategory(currentOrg, id);
      setDeactivated(false);
    } else {
      deactivateCategory(currentOrg, id);
      setDeactivated(true);
    }
    setIsOpen(false);
  };

  const handleOpenDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".dropdown-actions")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block dropdown-actions">
      <button
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={handleOpenDropdown}
        disabled={isLoading} 
      >
        {isLoading ? "Loading..." : "Actions"}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 shadow-lg rounded-md z-10">
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => handleEdit(itemId)}
          >
            Edit
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => handleToggleActivation(itemId)}
            disabled={isLoading} 
          >
            {deactivated ? "Reactivate" : "Deactivate"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownActions;