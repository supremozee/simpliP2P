/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";

export default function useDeactivateCategory() {
  const queryClient = useQueryClient();
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: DeactivateCategoryMutation, isPending: isDeactivating } = useMutation({
    mutationFn: async ({ orgId, categoryId }: { orgId: string; categoryId: string }) => {
      return auth.deactivateCategory(orgId, categoryId);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['fetchCategory'] });
      queryClient.invalidateQueries({ queryKey: ['organizationDashboard'] });
      if (response && response.status === 'success') {
        notifySuccess(response.message || 'Category deactivated successfully');
      } else {
        notifyError(response.message || 'Failed to deactivate category');
      }
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || 'An error occurred while deactivating the category. Please try again.';
      notifyError(message);
    },
  });

  const deactivateCategory = async (orgId: string, categoryId: string) => {
    await DeactivateCategoryMutation({ orgId, categoryId });
  };

  return { deactivateCategory, isDeactivating };
}