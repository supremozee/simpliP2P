/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { ProductData, ProductResponse } from "@/types";
import { auth } from "@/helpers/auths";

export default function useCreateProduct() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successCreate, setSuccessCreate] = useState(false);
  const { success: notifySuccess, error: notifyError } = useNotify();
  const queryClient = useQueryClient();

  const { mutateAsync: createProductMutation } = useMutation({
    mutationFn: async ({
      data,
      orgId,
    }: {
      data: ProductData;
      orgId: string;
    }) => {
      return auth.createProduct(orgId, data);
    },
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
      setSuccessCreate(false);
    },
    onSuccess: (response: ProductResponse) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
      queryClient.invalidateQueries({ queryKey: ["organizationDashboard"] });
      if (response && response.status === "success") {
        notifySuccess(response.message);
        setSuccessCreate(true);
      } else {
        setErrorMessage(response.message);
        notifyError(response.message);
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during product creation. Please try again.";
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const createProduct = async (data: ProductData, orgId: string) => {
    await createProductMutation({ data, orgId });
  };

  return {
    createProduct,
    loading,
    errorMessage,
    successCreate,
    setSuccessCreate,
  };
}
