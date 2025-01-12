import { auth } from '@/api/auths';
import { CallbackResponse, CallbackType, InitiateGoogleResponse } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotify from './useNotify';
import { useState } from 'react';
export const useGoogleLogin = () => {
  const {success, error} = useNotify()
  const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient();
    const {mutateAsync:initiateMutation} = useMutation({
        mutationFn: auth.initiateGoogle,
        onSuccess: (response:InitiateGoogleResponse) => {
          if(response?.status === "success") {
              success(response?.message)
              setLoading(true)
              window.location.href = response?.data?.url;
          } else {
            error(response?.message)
          }
        },
    });
    const {mutateAsync:callbackMutation} = useMutation({
        mutationFn: auth.handleGoogleCallback,
    onSuccess: (response:CallbackResponse) => {
            if(response?.status === "success") {
              success(response?.message)
          } else {
            error(response?.message)
          }
        queryClient.invalidateQueries({ queryKey: ['customer'] });
      },
    });
  
    const initiate = () => {
      initiateMutation();
    };
  
    const handleCallback = (code: CallbackType) => {
      callbackMutation(code);
    };
  
    return {
      loading,
      initiate,
      handleCallback,
    };
  };