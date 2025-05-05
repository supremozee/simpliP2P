import { useState } from 'react';
import { auth } from '@/api/auths';
import useStore from '@/store';
import { ExportSelected } from '@/types';
import useNotify from './useNotify';

const useExportSelected = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const { currentOrg } = useStore();
  const { success, error } = useNotify();

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAll = (ids: string[]) => {
    setSelectedItems(ids);
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const isSelected = (id: string) => selectedItems.includes(id);

  const exportSelectedItems = async (format: 'excel' | 'csv', entity: string) => {
    if (selectedItems.length === 0) {
      error('Please select at least one item to export');
      return;
    }

    try {
      setIsExporting(true);
      const exportData: ExportSelected = {
        entity,
        format,
        ids: selectedItems,
      };
      
      await auth.exportSelected(currentOrg, exportData);
      success(`Successfully exported ${selectedItems.length} items`);
      
    } catch (err) {
      error('Failed to export selected items');
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    selectedItems,
    isExporting,
    toggleSelectItem,
    selectAll,
    deselectAll,
    isSelected,
    exportSelectedItems,
  };
};

export default useExportSelected;