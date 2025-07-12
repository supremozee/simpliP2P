/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/helpers/auths";
import { forgotData } from "@/types";

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: forgotPasswordMutation } = useMutation({
    mutationFn: auth.forgotPassword,
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
    },
    onSuccess: (response) => {
      setLoading(false);
      if (response.status === "success") {
        setSuccessMessage(
          response.message || "Password reset link sent successfully"
        );
        notifySuccess(
          response.message || "Password reset link sent successfully"
        );
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

  const forgotPassword = async (email: forgotData) => {
    return forgotPasswordMutation(email);
  };

  return { forgotPassword, loading, errorMessage, successMessage };
};

export default useForgotPassword;
