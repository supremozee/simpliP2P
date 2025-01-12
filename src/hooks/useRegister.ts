/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";
import { RegisterFormData } from "@/types";

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successSignup, setSuccessSignup] = useState(false);
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: registerMutation } = useMutation({
    mutationFn: auth.register,
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
      setSuccessSignup(false);
    },
    onSuccess: (response) => {
      setLoading(false);
      if (response && response.status === 'success') {
        console.log(response)
        notifySuccess("Successfully registered");
        setSuccessSignup(true);
      } else {
        setErrorMessage(response?.message || 'Registration failed');
        notifyError(response?.message || 'Registration failed');
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'An error occurred during registration. Please try again.';
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const register = async (data: RegisterFormData) => {
    registerMutation(data);
  };

  return { register, loading, errorMessage, successSignup, setSuccessSignup };
}