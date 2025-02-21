/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";
import { InviteUserData, InviteUserResponse } from "@/types";

export default function useInviteMember() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInvite, setSuccessInvite] = useState(false);
  const { success: notifySuccess, error: notifyError } = useNotify();
  const queryClient = useQueryClient()
  const { mutateAsync: inviteUserMutation } = useMutation({
    mutationFn: async ({ data, orgId }: { data: InviteUserData; orgId: string }) => {
        return auth.inviteUser(data, orgId);
      },
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
      setSuccessInvite(false);
    },
    onSuccess: (response:InviteUserResponse) => {
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

  const inviteUser = async (data: InviteUserData, orgId:string) => {
    inviteUserMutation({data, orgId});
  };

  return { inviteUser,
     loading,
      errorMessage, 
      successInvite,
       setSuccessInvite };
}