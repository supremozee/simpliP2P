"use client";

import { useEffect, useState } from "react";
import Modal from "../atoms/Modal";
import Button from "../atoms/Button";
import TableHead from "../atoms/TableHead";
import TableBody from "../atoms/TableBody";
import TableRow from "../molecules/TableRow";
import useFetchProducts from "@/hooks/useFetchProducts";
import useStore from "@/store";
import ErrorComponent from "../molecules/ErrorComponent";
import useAddItemsToRequistion from "@/hooks/useAddItemsToRequisition";
import { AllItems, FetchProduct } from "@/types";
import useRemoveItem from "@/hooks/useRemoveItems";
import useFetchItemsByPrNumber from "@/hooks/useFetchAllItemsByPrNumber";
import LoaderSpinner from "../atoms/LoaderSpinner";

const OpenInventory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentOrg, pr, loading } = useStore();
  const fetchItemByPrNumber = useFetchItemsByPrNumber(currentOrg, pr?.pr_number || "", 10, 1);
  const itemsByPrNumber = fetchItemByPrNumber?.data?.data?.data;
  const [selectedItems, setSelectedItems] = useState<AllItems[]>([]);
  const { data, error, isLoading, isError } = useFetchProducts(currentOrg, 1, 10);
  const { addItemsToRequisition } = useAddItemsToRequistion();
  const { removeItem } = useRemoveItem();
  const products = data?.data || [];
  const headers = [
    "Name",
    "Description",
    "Unit Price",
    "Category",
    "Stock Qty",
    "Select"
  ];

  useEffect(() => {
    if (itemsByPrNumber) {
      setSelectedItems(itemsByPrNumber);
    }
  }, [itemsByPrNumber]);

  const toggleItemSelection = async (product: FetchProduct) => {
    const existingItem = selectedItems.find(item => item?.product?.id === product.id);

    if (existingItem) {
      await removeItemFromSelect(product);
    } else {
      await addItem(product);
    }
  };

  const removeItemFromSelect = async (product: FetchProduct) => {
    const itemToRemove = selectedItems?.find(item => item?.product.id === product?.id);
    if (itemToRemove) {
      await removeItem(itemToRemove?.id, currentOrg);
      setSelectedItems(prevItems => prevItems.filter(item => item?.id !== itemToRemove?.id));
    }
  };

  const addItem = async (product: FetchProduct) => {
    const response = await addItemsToRequisition(
      {
        pr_id: pr?.id || "",
        product_id: product?.id,
        item_name: product?.name,
        pr_quantity: product?.stockQty,
        unit_price: Number(product?.unitPrice),
        image_url: product?.image_url || "",
      },
      currentOrg
    );
    setSelectedItems(prevItems => [...prevItems, response.data.item]);
  };

  return (
    <>
      <Button
        type="button"
        className="px-4 py-2 text-sm bg-[#181819] text-white rounded-lg hover:bg-[#181819]/90 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        Add from Inventory
      </Button>

      {isOpen && (
        <Modal 
          onClose={() => setIsOpen(false)} 
          isOpen={isOpen}
          title="Select Items from Catalog"
          contentClassName="max-w-5xl"
        >
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <LoaderSpinner size="lg" text="Loading inventory items..." />
              </div>
            ) : isError ? (
              <ErrorComponent text={error?.message || "Failed to fetch products."} />
            ) : products?.length > 0 ? (
              <div className="flex flex-col gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Selected items: <span className="font-medium text-primary">{selectedItems.length}</span>
                  </p>
                </div>

                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <TableHead headers={headers} />
                    <TableBody
                      data={products}
                      renderRow={(prod, index) => (
                        <TableRow
                          key={prod?.id}
                          data={[
                            prod?.name,
                            prod?.description || "No description",
                            new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            }).format(prod?.unitPrice),
                            prod?.category?.name,
                            prod?.stockQty,
                            <div key="checkbox" className="flex justify-center">
                              <input
                                type="checkbox"
                                className="w-5 h-5 rounded text-primary border-gray-300 focus:ring-primary"
                                checked={selectedItems.some(item => item.product?.id === prod?.id)}
                                onChange={() => toggleItemSelection(prod)}
                                disabled={loading === !!prod?.id}
                              />
                            </div>
                          ]}
                          index={index}
                          className={selectedItems.some(item => item.product?.id === prod?.id) ? 'bg-primary/5' : ''}
                        />
                      )}
                      emptyMessage="No items available in inventory"
                    />
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No items available in inventory</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default OpenInventory;