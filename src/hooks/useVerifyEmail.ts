/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/helpers/auths";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import useNotify from "./useNotify";
import { verifyData } from "@/types";

const useVerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: verifyEmailMutation } = useMutation({
    mutationFn: auth.verifyEmail,
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
      setSuccess(null);
    },
    onSuccess: (response) => {
      setLoading(false);
      if (response.status === "success") {
        setSuccess("Account successfully Verified!");
        notifySuccess("Account verified!");
      } else {
        setErrorMessage(response.message || "Verification failed");
        notifyError(response.message || "Verification failed");
      }
    },
    onError: (error: any) => {
      setLoading(false);
      const message =
        error.response?.data?.message || error.message || "An error occurred";
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const verifyEmail = (token: verifyData) => {
    return verifyEmailMutation(token);
  };

  return {
    loading,
    errorMessage,
    success,
    verifyEmail,
  };
};

export default useVerifyEmail;
