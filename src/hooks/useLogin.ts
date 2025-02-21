"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/api/auths';
import { User, LoginFormData, LoginResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useNotify from './useNotify';
import { useRouter, usePathname } from 'next/navigation';
import useStore from '@/store';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [loginResponse, setLoginRespone] = useState<User | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();
const router = useRouter()
const pathname = usePathname();
 const {
  currentOrg, setCurrentOrg, setOrgName
} 
  = useStore()
useEffect(() => {
  if (!['/login', '/register', '/reset-password', '/forgot-password', '/verify-email'].includes(pathname)) {
    // setPreviousRoute(pathname);
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
        const adminOrg = response?.data?.user?.user_organisations?.find(o => o.is_creator);
        if (adminOrg?.is_creator === true) {
          setOrgName(adminOrg.name);
          setCurrentOrg(adminOrg.org_id);
          router.push(`/${adminOrg.name}/dashboard`);
        } else {
          const userOrgs = response?.data?.user?.user_organisations?.filter(o => !o.is_creator);
          if (userOrgs && userOrgs.length > 0) {
            if(currentOrg) {
               router.push(`/${response.data.user.id}`);
            } 
            else {
              router.push(`${response?.data?.user?.id}`);
            }
          } else {
            router.push(`${response?.data?.user?.id}`);
          }
        }
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
    loginResponse
  };
};

export default useLogin;