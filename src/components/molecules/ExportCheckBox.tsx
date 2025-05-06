import React from 'react';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

interface ExportCheckBoxProps<T> {
  handleSelectAll: () => void;
  selectedItems: string[];
  items: T[];
}

function ExportCheckBox<T>({ handleSelectAll, selectedItems, items }: ExportCheckBoxProps<T>) {
  return (
    <div className="flex items-center justify-center">
      <button 
        onClick={handleSelectAll}
        className="flex items-center justify-center w-5 h-5 focus:outline-none"
        aria-label={selectedItems.length === items.length ? "Deselect all items" : "Select all items"}
      >
        {selectedItems.length > 0 && selectedItems.length === items.length ? (
          <MdCheckBox size={20} className="text-primary" />
        ) : (
          <MdCheckBoxOutlineBlank size={20} className="text-gray-400" />
        )}
      </button>
    </div>
  );
}

export default ExportCheckBox;