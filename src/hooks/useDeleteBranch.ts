/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";

export default function useDeleteBranch() {
  const queryClient = useQueryClient();
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: DeleteBranchMutation, isPending: isDeleting } = useMutation({
    mutationFn: async ({ orgId, branchId }: { orgId: string; branchId: string }) => {
      return auth.deleteBranch(orgId, branchId);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['fetchBranches'] });
      queryClient.invalidateQueries({ queryKey: ['organizationDashboard'] });
      if (response && response.status === 'success') {
        notifySuccess(response.message || 'Branch deleted successfully');
      } else {
        notifyError(response.message || 'Failed to delete branch');
      }
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || 'An error occurred while deleting the branch. Please try again.';
      notifyError(message);
    },
  });

  const deleteBranch = async (orgId: string, branchId: string) => {
    await DeleteBranchMutation({ orgId, branchId });
  };

  return { deleteBranch, isDeleting };
}