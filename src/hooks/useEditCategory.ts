/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";

export default function useEditCategory() {
  const queryClient = useQueryClient();
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: EditCategoryMutation } = useMutation({
    mutationFn: async ({ orgId, categoryId }: { orgId: string; categoryId: string; }) => {
      return auth.editCategory(orgId, categoryId);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['fetchProducts'] });
      queryClient.invalidateQueries({ queryKey: ['organizationDashboard'] });
      if (response && response.status === 'success') {
        notifySuccess(response.message);
      } else {
        notifyError(response.message);
      }
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || err.message || 'An error occurred during product update. Please try again.';
      notifyError(message);
    },
  });

  const editCategory = async (orgId: string, categoryId:string) => {
    await EditCategoryMutation({ orgId, categoryId });
  };

  return { editCategory };
}