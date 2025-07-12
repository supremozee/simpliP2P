/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/helpers/auths";
import { updateOrderStatus } from "@/types";

export default function useUpdateOrderStatus() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();
  const queryClient = useQueryClient();

  const { mutateAsync: updateOrderStatusMutation } = useMutation({
    mutationFn: async ({
      orgId,
      orderId,
      data,
    }: {
      orgId: string;
      orderId: string;
      data: updateOrderStatus;
    }) => {
      return auth.updateOrderStatus(orgId, orderId, data);
    },
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
    },
    onSuccess: (response: any) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["organizationDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["fetchOrders"] });
      if (response && response.status === "success") {
        notifySuccess(response?.message);
      } else {
        setErrorMessage(response?.message);
        notifyError(response?.message);
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during requisition status update. Please try again.";
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateOrderStatus = async (
    orgId: string,
    orderId: string,
    data: updateOrderStatus
  ) => {
    updateOrderStatusMutation({ orgId, orderId, data });
  };

  return { updateOrderStatus, loading, errorMessage };
}
