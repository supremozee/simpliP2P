/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/helpers/auths";
import {
  CreatePurchaseRequisitionData,
  CreatePurchaseRequisitionResponse,
} from "@/types";

export default function useCreatePurchaseRequisition() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();
  const queryClient = useQueryClient();
  const { mutateAsync: createPurchaseRequisitionMutation } = useMutation({
    mutationFn: async ({
      data,
      orgId,
    }: {
      data: CreatePurchaseRequisitionData;
      orgId: string;
    }) => {
      return auth.createRequisition(data, orgId);
    },
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
    },
    onSuccess: (response: CreatePurchaseRequisitionResponse) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["organizationDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["fetchRequisition"] });
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
        "An error occurred during supplier creation. Please try again.";
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const createPurchaseRequisition = async (
    data: CreatePurchaseRequisitionData,
    orgId: string
  ) => {
    createPurchaseRequisitionMutation({ data, orgId });
  };

  return { createPurchaseRequisition, loading, errorMessage };
}
