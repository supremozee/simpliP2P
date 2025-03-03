/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { auth } from '@/api/auths';
import { FinalizePurchaseRequisition } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useNotify from './useNotify';

const useFinaliseRequisition = () => {
  const [loading, setLoading  ] = useState(false);
  const { success, error: notifyError } = useNotify();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: finaliseRequisitionMutation } = useMutation({
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null); 
    },
    mutationFn: async ({ data, orgId }: { data: FinalizePurchaseRequisition; orgId: string }): Promise<any> => {
      return await auth.finaliseRequistion(orgId, data);
    },
    onSuccess: (response) => {
      setLoading(false);
      success(response?.message);
      queryClient.invalidateQueries({ queryKey: ['fetchRequisition'] });
      queryClient.invalidateQueries({ queryKey: ['fetchRequisitionSavedForLater'] });
    },
    onError: (error: any) => {
      setLoading(false);
      const errorMessage = error?.response?.data?.message || error.message || 'An error occurred';
      setErrorMessage(errorMessage);
      notifyError(errorMessage);
    },
  });

  const finaliseRequisition = async (data: FinalizePurchaseRequisition, orgId: string) => {
    return finaliseRequisitionMutation({ data, orgId });
  };

  return {
    finaliseRequisition,
    errorMessage, 
    loading
  };
};

export default useFinaliseRequisition;