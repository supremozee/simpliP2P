"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/helpers/auths";
import { ResetFormData, ResetResponse } from "@/types";
import { useRouter } from "next/navigation";

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("token");
    setToken(param);
  }, []);
  const { mutateAsync: resetPasswordMutation } = useMutation({
    mutationFn: auth.resetPassword,
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
    },
    onSuccess: (response: ResetResponse) => {
      setLoading(false);
      if (response.status === "success") {
        setSuccessMessage(response.message);
        notifySuccess(response.message);
        router.push("/login");
      } else {
        setErrorMessage(response.message || "Password reset failed");
        notifyError(response.message || "Password reset failed");
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during password reset. Please try again.";
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const resetPassword = async (data: ResetFormData) => {
    return resetPasswordMutation(data);
  };

  return { resetPassword, loading, errorMessage, successMessage, token };
};

export default useResetPassword;
