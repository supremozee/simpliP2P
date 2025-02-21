import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/api/auths';
import { EditMemberData, EditMemberResponse } from '@/types';
import { useState } from 'react';
import useNotify from './useNotify';

const useEditMember = () => {
   const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false);
      const [errorMessage, setErrorMessage] = useState<string | null>(null);
      const [successEditMember, setSuccessEditMember] = useState(false);
      const { success: notifySuccess, error: notifyError } = useNotify();
  const {mutateAsync:EditMemberMutation} = useMutation({
    mutationFn: async ({ data, orgId, membersId }: { data: EditMemberData; orgId: string; membersId: string }) => {
      return auth.editMembers(data, orgId, membersId);
    },
     onMutate: () => {
          setLoading(true);
          setErrorMessage(null);
          setSuccessEditMember(false);
        },
        onSuccess: (response:EditMemberResponse) => {
         queryClient.invalidateQueries({queryKey: ['fetchMembers']});
          setLoading(false);
          if (response && response.status === 'success') {
            notifySuccess(response?.message);
            setSuccessEditMember(true);
          } else {
            setErrorMessage(response?.message);
            notifyError(response?.message );
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const editMember = async (data: EditMemberData, orgId: string, membersId: string) => {
      EditMemberMutation({ data, orgId, membersId });
  };

  return {
    loading,
    errorMessage,
    successEditMember,
    setSuccessEditMember,
    editMember,
  };
};

export default useEditMember;