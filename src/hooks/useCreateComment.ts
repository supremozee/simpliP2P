/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/helpers/auths";
import { Comment } from "@/types";

export default function useCreateComment() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();
  const queryClient = useQueryClient();

  const { mutateAsync: createCommentMutation } = useMutation({
    mutationFn: async ({ data, orgId }: { data: Comment; orgId: string }) => {
      return auth.createComment(orgId, data);
    },
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
    },
    onSuccess: (response: any) => {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["singleComment"] });
      if (response && response.status === "success") {
        notifySuccess(response?.message);
      } else {
        setErrorMessage(response?.message);
        notifyError(response?.message);
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while creating the comment. Please try again.";
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const createComment = async (data: Comment, orgId: string) => {
    createCommentMutation({ data, orgId });
  };

  return { createComment, loading, errorMessage };
}
