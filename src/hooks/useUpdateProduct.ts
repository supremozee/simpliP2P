/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";
import { ProductData, ProductResponse } from "@/types";

export default function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: updateProductMutation } = useMutation({
    mutationFn: async ({ orgId, productId, productData }: { orgId: string; productId: string; productData: ProductData }) => {
      return auth.updateProduct(orgId, productId, productData);
    },
    onSuccess: (response: ProductResponse) => {
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

  const updateProduct = async (orgId: string, productId: string, productData: ProductData) => {
    await updateProductMutation({ orgId, productId, productData });
  };

  return { updateProduct };
}