/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useNotify from "./useNotify";
import { auth } from "@/helpers/auths";

const useUploadOrganizationLogo = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { success: notifySuccess, error: notifyError } = useNotify();

  const { mutateAsync: uploadOrganizationLogoMutation } = useMutation({
    mutationFn: async ({
      formData,
      orgId,
    }: {
      formData: File;
      orgId: string;
    }) => {
      return auth.uploadOrganizationLogo(formData, orgId);
    },
    onMutate: () => {
      setLoading(true);
      setErrorMessage(null);
    },
    onSuccess: (response: {
      status: string;
      message: string;
      data: {
        url: string;
      };
    }) => {
      queryClient.invalidateQueries({ queryKey: ["organizationById"] });
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      setLoading(false);
      if (response?.status === "success") {
        notifySuccess(response?.message);
      } else {
        setErrorMessage(response?.message || "Profile picture upload failed");
        notifyError(response?.message || "Profile picture upload failed");
      }
    },
    onError: (err: any) => {
      setLoading(false);
      const message =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during profile picture upload. Please try again.";
      setErrorMessage(message);
      notifyError(message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const uploadOrganizationLogo = async (formData: File, orgId: string) => {
    return uploadOrganizationLogoMutation({ formData, orgId });
  };

  return { uploadOrganizationLogo, loading, errorMessage };
};

export default useUploadOrganizationLogo;
