/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/api/auths';
import { LoginFormData } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import useNotify from './useNotify';
import { useRouter } from 'next/navigation';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();
const router = useRouter()
  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: auth.login,
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
    },
    onSuccess: (response) => {
      setLoading(false);
      if (response?.status === 'success') {
        notifySuccess("Successfully logged in");
        router.push('/');
      } else {
        setErrorMessage(response?.message || 'Login failed');
        notifyError(response?.message || 'Login failed');
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'An error occurred during login. Please try again.';
      setErrorMessage(message);
      notifyError(message);
      console.error("Login error:", err);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const login = async (data: LoginFormData) => {
    return loginMutation(data);
  };

  return {
    loading,
    errorMessage,
    login,
  };
};

export default useLogin;