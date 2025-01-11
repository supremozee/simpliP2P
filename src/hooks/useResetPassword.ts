/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import useNotify from './useNotify';
import { auth } from '@/api/auths';
import { ResetFormData } from '@/types';

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: resetPasswordMutation } = useMutation({
    mutationFn: auth.resetPassword,
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
    },
    onSuccess: (response) => {
      setLoading(false);
      if (response.status === 'success') {
        setSuccessMessage(response.message || 'Password reset successfully');
        notifySuccess(response.message || 'Password reset successfully');
      } else {
        setErrorMessage(response.message || 'Password reset failed');
        notifyError(response.message || 'Password reset failed');
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'An error occurred during password reset. Please try again.';
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

  return { resetPassword, loading, errorMessage, successMessage };
};

export default useResetPassword;