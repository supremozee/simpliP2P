/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/helpers/auths";

export default function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: DeleteCategoryMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: async ({
        orgId,
        categoryId,
      }: {
        orgId: string;
        categoryId: string;
      }) => {
        return auth.deleteCategory(orgId, categoryId);
      },
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ["fetchCategory"] });
        queryClient.invalidateQueries({ queryKey: ["organizationDashboard"] });
        if (response && response.status === "success") {
          notifySuccess(response.message || "Category Deleted successfully");
        } else {
          notifyError(response.message || "Failed to deactivate category");
        }
      },
      onError: (err: any) => {
        const message =
          err.response?.data?.message ||
          err.message ||
          "An error occurred while deactivating the category. Please try again.";
        notifyError(message);
      },
    });

  const deleteCategory = async (orgId: string, categoryId: string) => {
    await DeleteCategoryMutation({ orgId, categoryId });
  };

  return { deleteCategory, isDeleting };
}
