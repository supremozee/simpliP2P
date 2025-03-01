/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";
import { inviteMemberData, inviteMemberResponse } from "@/types";

export default function useInviteMember() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInvite, setSuccessInvite] = useState(false);
  const { success: notifySuccess, error: notifyError } = useNotify();
  const queryClient = useQueryClient()
  const { mutateAsync: inviteMemberMutation } = useMutation({
    mutationFn: async ({ data, orgId }: { data: inviteMemberData; orgId: string }) => {
        return auth.inviteMember(data, orgId);
      },
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
      setSuccessInvite(false);
    },
    onSuccess: (response:inviteMemberResponse) => {
      setLoading(false);
      if (response && response.status === 'success') {
        notifySuccess(response?.message);
        setSuccessInvite(true);
        queryClient.invalidateQueries({queryKey: ['fetchMembers']}); 
      } else {
        setErrorMessage(response?.message);
        notifyError(response?.message );
      }
    },
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

  const inviteMember = async (data: inviteMemberData, orgId:string) => {
    inviteMemberMutation({data, orgId});
  };

  return { inviteMember,
     loading,
      errorMessage, 
      successInvite,
       setSuccessInvite };
}