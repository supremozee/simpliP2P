/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/helpers/auths";
import { User } from "@/types";
import { useState } from "react";

export default function useUpdateUser() {
  const queryClient = useQueryClient();
  const { success: notifySuccess, error: notifyError } = useNotify();
  const [loading, setLoading] = useState(false);
  const { mutateAsync: updateUserMutation } = useMutation({
    mutationFn: async ({ update }: { update: User }) => auth.updateUser(update),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      if (response && response.status === "success") {
        setLoading(false);
        notifySuccess(response.message);
      } else {
        notifyError(response.message);
      }
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during product update. Please try again.";
      notifyError(message);
    },
  });

  const updateUser = async (update: User) => {
    await updateUserMutation({ update });
  };

  return { updateUser, loading };
}
