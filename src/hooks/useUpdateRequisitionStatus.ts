/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";
import { updateRequisitionStatus } from "@/types";

export default function useUpdateRequisitionStatus() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();
  const queryClient = useQueryClient();
  
  const { mutateAsync: updateRequisitionStatusMutation } = useMutation({
    mutationFn: async ({ orgId, reqId, data }: { orgId: string; reqId: string; data: updateRequisitionStatus }) => {
      return auth.updateRequisitionStatus(orgId, reqId, data);
    },
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
    },
    onSuccess: (response:any) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ['organizationDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['fetchRequisition'] });
      queryClient.invalidateQueries({ queryKey: ['fetchRequisitionById'] });
      if (response && response.status === 'success') {
        notifySuccess(response?.message);
      } else {
        setErrorMessage(response?.message);
        notifyError(response?.message);
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'An error occurred during requisition status update. Please try again.';
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateRequisitionStatus = async (orgId: string, reqId: string, data: updateRequisitionStatus) => {
    updateRequisitionStatusMutation({ orgId, reqId, data });
  };

  return { updateRequisitionStatus, loading, errorMessage };
}