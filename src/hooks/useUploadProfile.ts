/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import useNotify from './useNotify';
import { auth } from '@/api/auths';

const useUploadProfilePicture = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: uploadProfilePictureMutation } = useMutation({
    mutationFn: auth.uploadProfilePicture,
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
    },
    onSuccess: (response) => {
      setLoading(false);
      if (response.status === 'success') {
        notifySuccess("Profile picture uploaded successfully");
      } else {
        setErrorMessage(response.message || 'Profile picture upload failed');
        notifyError(response.message || 'Profile picture upload failed');
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'An error occurred during profile picture upload. Please try again.';
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const uploadProfilePicture = async (formData: FormData) => {
    return uploadProfilePictureMutation(formData);
  };

  return { uploadProfilePicture, loading, errorMessage };
};

export default useUploadProfilePicture;