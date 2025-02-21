/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";
import { CreateBudget } from "@/types";

export default function useCreateBudget() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();
  const queryClient = useQueryClient();

  const { mutateAsync: createBudgetMutation } = useMutation({
    mutationFn: async ({ data, orgId }: { data: CreateBudget; orgId: string }) => {
      return auth.createBudget(orgId, data);
    },
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
    },
    onSuccess: (response: any) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ['fetchBudget'] });
      if (response && response.status === 'success') {
        notifySuccess(response?.message);
      } else {
        setErrorMessage(response?.message);
        notifyError(response?.message);
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'An error occurred while creating the budget. Please try again.';
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const createBudget = async (data: CreateBudget, orgId: string) => {
    createBudgetMutation({ data, orgId });
  };

  return { createBudget, loading, errorMessage };
}