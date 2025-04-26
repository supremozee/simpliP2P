"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/api/auths';
import { User, LoginFormData, LoginResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useNotify from './useNotify';
import { useRouter, usePathname } from 'next/navigation';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [loginResponse, setLoginRespone] = useState<User | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();
const router = useRouter()
const pathname = usePathname();
useEffect(() => {
  if (!['/login', '/register', '/reset-password', '/forgot-password', '/verify-email'].includes(pathname)) {
  }
}, [pathname]);
  const { mutateAsync: loginMutation } = useMutation({
    mutationKey: ['loginMutation'],
    mutationFn: auth.login,
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
      setLoginRespone(null)
    },
    onSuccess: (response:LoginResponse) => {
      setLoading(false);
      if (response?.status === 'success') {
        notifySuccess("Successfully logged in");
        setLoginRespone(response?.data?.user)
         router.push(`/${response.data.user.id}`);
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'An error occurred during login. Please try again.';
      setErrorMessage(message);
      notifyError(message);
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
    loginResponse
  };
};

export default useLogin;