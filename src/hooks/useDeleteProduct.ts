/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/helpers/auths";

export default function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: deleteProductMutation } = useMutation({
    mutationFn: async ({
      orgId,
      productId,
    }: {
      orgId: string;
      productId: string;
    }) => {
      return auth.deleteProduct(orgId, productId);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
      queryClient.invalidateQueries({ queryKey: ["organizationDashboard"] });
      if (response && response.status === "success") {
        notifySuccess(response.message);
      } else {
        notifyError(response.message);
      }
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during product deletion. Please try again.";
      notifyError(message);
    },
  });

  const deleteProduct = async (orgId: string, productId: string) => {
    await deleteProductMutation({ orgId, productId });
  };

  return { deleteProduct };
}
