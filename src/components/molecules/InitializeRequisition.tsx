"use client";
import React from 'react';
import Button from '../atoms/Button';
import useStore from '@/store';
import useInitializePurchaseRequisition from "@/hooks/useInitializePurchaseRequisition";

const InitializeRequisition = () => {
  const { currentOrg, loading: initialiseLoading, setIsOpen } = useStore();
  const { initializePurchaseRequisition } = useInitializePurchaseRequisition();

  const initialisePurchaseRequisitionData = {
    organisationId: currentOrg,
  };

  const handleInitialisePurchaseRequisition = async () => {
    await initializePurchaseRequisition(initialisePurchaseRequisitionData);
    setIsOpen(true);
  };

  return (
    <div className="flex sm:justify-end sm:mb-4 mb-7 sm:mt-0 mt-6">
      <Button
        onClick={handleInitialisePurchaseRequisition}
        className="bg-primary text-white px-5 py-2 rounded-lg font-semibold z-10"
      >
        {initialiseLoading ? "Initializing..." : "Create Requisition"}
      </Button>
    </div>
  );
};

export default InitializeRequisition;