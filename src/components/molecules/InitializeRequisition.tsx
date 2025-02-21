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
    <div className="flex justify-end mb-4">
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