import { auth } from '@/api/auths';
import { useMutation, useQueryClient } from '@tanstack/react-query';
export const useGoogleLogin = () => {
    const queryClient = useQueryClient();
    const {mutateAsync:initiateMutation} = useMutation({
        mutationFn: auth.initiateGoogle,
    });
    const {mutateAsync:callbackMutation} = useMutation({
        mutationFn: auth.handleGoogleCallback,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['customer'] });
      },
    });
  
    const initiate = () => {
      initiateMutation();
    };
  
    const handleCallback = (code: string) => {
      callbackMutation(code);
    };
  
    return {
      initiate,
      handleCallback,
    };
  };