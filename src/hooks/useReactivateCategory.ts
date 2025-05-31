/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";

export default function useReactivateCategory() {
  const queryClient = useQueryClient();
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: ReactivateCategoryMutation, isPending: isReactivating } = useMutation({
    mutationFn: async ({ orgId, categoryId }: { orgId: string; categoryId: string }) => {
      return auth.reactivateCategory(orgId, categoryId);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['fetchCategory'] });
      queryClient.invalidateQueries({ queryKey: ['organizationDashboard'] });
      if (response && response.status === 'success') {
        notifySuccess(response.message || 'Category reactivated successfully');
      } else {
        notifyError(response.message || 'Failed to reactivate category');
      }
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || 'An error occurred while reactivating the category. Please try again.';
      notifyError(message);
    },
  });

  const reactivateCategory = async (orgId: string, categoryId: string) => {
    await ReactivateCategoryMutation({ orgId, categoryId });
  };

  return { reactivateCategory, isReactivating };
}