/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";
import { EditBranch } from "@/types";

export default function useEditBranch() {
  const queryClient = useQueryClient();
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: EditBranchMutation, isPending:isUpdateBranch } = useMutation({
    mutationFn: async ({ orgId, branchId, data }: { orgId: string; branchId: string, data: EditBranch }) => {
      return auth.editBranch(orgId, branchId, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['fetchBranch'] });
      queryClient.invalidateQueries({ queryKey: ['organizationDashboard'] });
      if (response && response.status === 'success') {
        notifySuccess(response.message);
      } else {
        notifyError(response.message);
      }
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || 'An error occurred during branch update. Please try again.';
      notifyError(message);
    },
  });

  const editBranch = async (orgId: string, branchId: string, data: EditBranch) => {
    await EditBranchMutation({ orgId, branchId, data });
  };

  return { editBranch, isUpdateBranch };
}