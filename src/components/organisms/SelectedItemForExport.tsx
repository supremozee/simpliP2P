import React, { useEffect, useState, useRef } from 'react'
import { MdCheckBox, MdFileDownload, MdExpandMore } from 'react-icons/md'
import { FiCheck } from 'react-icons/fi'
import Button from '../atoms/Button'
import useExportSelected from '@/hooks/useExportSelected'

interface SelectedItemForExportProps<T> {
    selectedItems: string[];
    items: T[];
    deselectAll: () => void;
    entityType: string; 
    exportSelected?: (format: 'excel' | 'csv') => void;
}

const SelectedItemForExport = <T,>({
  selectedItems, 
  deselectAll, 
  items, 
  entityType,
  exportSelected
}: SelectedItemForExportProps<T>) => {
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const exportDropdownRef = useRef<HTMLDivElement>(null);
    const { exportSelectedItems, isExporting } = useExportSelected();

    const handleExport = (format: 'excel' | 'csv') => {
      if (exportSelected) {
        exportSelected(format);
      } else {
        exportSelectedItems(format, entityType, selectedItems);
      }
      setShowExportDropdown(false);
    };
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
          setShowExportDropdown(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    if (selectedItems.length === 0) return null;
    
    return (
      <div>
        <div className="bg-blue-50 border border-blue-200 p-3 mb-4 rounded-md text-sm flex items-center justify-between">
          <div className="flex items-center">
            <MdCheckBox size={18} className="text-primary mr-2" />
            <span className="text-gray-800">
              <span className="font-medium">{selectedItems.length}</span> of <span className="font-medium">{items.length}</span> items selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center relative" ref={exportDropdownRef}>
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="inline-flex justify-center items-center gap-1 bg-primary text-white rounded-md px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                disabled={isExporting}
              >
                <MdFileDownload size={18} />
                Export {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
                <MdExpandMore size={18} />
              </button>
              
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-40 top-10 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <button
                      onClick={() => handleExport('excel')}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-900 hover:bg-primary hover:text-white"
                      disabled={isExporting}
                    >
                      <FiCheck className="text-green-500 mr-2" />
                      Excel
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-900 hover:bg-primary hover:text-white"
                      disabled={isExporting}
                    >
                      <FiCheck className="text-green-500 mr-2" />
                      CSV
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Button
              onClick={deselectAll}
              className="text-xs bg-white text-gray-700 hover:bg-gray-100"
              padding="xxs"
            >
              Clear selection
            </Button>
          </div>
        </div>
      </div>
    )
}

export default SelectedItemForExport