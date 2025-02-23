/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { auth } from "@/api/auths";
import { CreateOrganizationResponse, OrganizationData } from "@/types";
import { useRouter } from "next/navigation";
import useStore from "@/store";

export default function useCreateOrganization() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createOrganization, setCreateOrganization] = useState(false);
  const { error: notifyError } = useNotify();
  const [successMessage, setSuccessMessage] = useState("")
  const {setOrgName, setCurrentOrg} = useStore()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { mutateAsync: organizationMutation } = useMutation({
    mutationFn: auth.createOrganization,
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
      setCreateOrganization(false);
      setSuccessMessage("")
    },
    onSuccess: (response:CreateOrganizationResponse) => {
      queryClient.invalidateQueries({queryKey: ['customer']})
      queryClient.invalidateQueries({queryKey: ['organizationById']})
      setLoading(false);
      if (response && response.status === 'success') {
        setCreateOrganization(true);
        setOrgName(response?.data?.name)
        setCurrentOrg(response?.data?.id)
        setSuccessMessage(response?.data?.name + " " + response?.message);
      } else {
        setErrorMessage(response?.message || 'Registration failed');
        notifyError(response?.message || 'Registration failed');
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || err.message || 'An error occurred during registration. Please try again.';
      if(err?.error === "Unauthorized") {
        router.push("/login")
      }
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const organization = async (data: OrganizationData) => {
    organizationMutation(data);
  };

  return { organization,
    successMessage,
     loading,
      errorMessage, 
      createOrganization,
       setCreateOrganization };
}