/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";
import { CreateSupplierData } from "@/types";

export default function useCreateSupplier() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successCreate, setSuccessCreate] = useState(false);
  const { success: notifySuccess, error: notifyError } = useNotify();
  const queryClient = useQueryClient()
  const { mutateAsync: createSupplierMutation } = useMutation({
    mutationFn: async ({ data, orgId }: { data: CreateSupplierData; orgId: string }) => {
        return auth.createSupplier(data, orgId);
      },
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
      setSuccessCreate(false);
    },
    onSuccess: (response: any) => {
      setLoading(false);
      queryClient.invalidateQueries({queryKey: ['fetchSuppliers']});
      queryClient.invalidateQueries({queryKey: ['organizationDashboard']});
      if (response && response.status === 'success') {
        notifySuccess(response?.message);
        setSuccessCreate(true);
      } else {
        setErrorMessage(response?.message);
        notifyError(response?.message);
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'An error occurred during supplier creation. Please try again.';
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const createSupplier = async (data: CreateSupplierData, orgId: string) => {
    createSupplierMutation({ data, orgId });
  };

  return { createSupplier, loading, errorMessage, successCreate, setSuccessCreate };
}