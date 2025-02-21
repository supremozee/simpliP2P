"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import useNotify from './useNotify';
import { auth } from '@/api/auths';
import { AcceptInvitationData, AcceptInvitationResponse } from '@/types';
import { usePathname, useRouter } from 'next/navigation';
import useStore from '@/store';

const useAcceptInvitation = () => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname()
  const currentOrg = pathname.split('/').pop() || ''
  const {setCurrentOrg} = useStore()
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();
  const [token, setToken] = useState<string | null>(null);
  const [pathnameId, setPathnameId] = useState<string | null>(null);
const router = useRouter()
useEffect(() => {
  const param = new URLSearchParams(window.location.search).get('invite');
  setToken(param);
  setPathnameId(pathname.split('/').pop() || null);
}, [pathname]);
  const { mutateAsync: acceptInvitationMutation } = useMutation({
      mutationFn: async (data: AcceptInvitationData) => {
            return auth.acceptInvitation(data, currentOrg);
          },
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
    },
    onSuccess: (response: AcceptInvitationResponse) => {
      setLoading(false);
      if (response.status === 'success') {
        setSuccessMessage(response.message);
        notifySuccess(response.message);
        setCurrentOrg(currentOrg);
        router.push(`/${currentOrg}/dashboard`);
      } else {
        setErrorMessage(response.message || 'Invitation acceptance failed');
        notifyError(response.message || 'Invitation acceptance failed');
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'An error occurred during invitation acceptance. Please try again.';
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const acceptInvitation = async (data: AcceptInvitationData) => {
    return acceptInvitationMutation(data);
  };

  return {
     acceptInvitation, 
     loading, 
     errorMessage, 
     successMessage,
      token,
      pathnameId
    };
};

export default useAcceptInvitation;