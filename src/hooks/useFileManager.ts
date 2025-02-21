/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { auth } from "@/api/auths";
import useNotify from "./useNotify";
import { FileResponse } from "@/types";

export default function useFileManager() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: uploadFile } = useMutation({
    mutationFn: async (image: File) => {
      return auth.fileManager(image);
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response: FileResponse) => {
      setLoading(false);
      if (response && response.status === 'success') {
        notifySuccess(response?.message);
      } else {
        setError(response?.message);
        notifyError(response?.message);
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'An error occurred during file upload. Please try again.';
      setError(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  return { uploadFile, loading, error };
}