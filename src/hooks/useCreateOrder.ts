/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";
import { PurchaseOrder } from "@/types";

export default function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();
  const queryClient = useQueryClient();
  
  const { mutateAsync: createOrderMutation } = useMutation({
    mutationFn: async ({ data, orgId }: { data: PurchaseOrder; orgId: string }) => {
      return auth.createOrder(orgId, data);
    },
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
    },
    onSuccess: (response) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ['organizationDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['fetchOrders'] });
      if (response && response.status === 'success') {
        notifySuccess(response?.message);
      } else {
        setErrorMessage(response?.message);
        notifyError(response?.message);
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'An error occurred during order creation. Please try again.';
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const createOrder = async (orgId: string, data: PurchaseOrder,) => {
    createOrderMutation({ data, orgId });
  };

  return { createOrder, loading, errorMessage };
}