/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";
import { PurchaseRequisitionSavedForLater } from "@/types";
import useNotify from "./useNotify";
import { useState } from "react";

const useSaveForLater = () => {
  const [loading, setLoading] = useState(false);
  const { success, error: notifyError } = useNotify();
  const queryClient = useQueryClient();

  const { mutateAsync: saveForLaterMutation } = useMutation({
    onMutate: () => {
      setLoading(true);
    },
    mutationFn: async ({
      orgId,
      data,
    }: {
      orgId: string;
      data: PurchaseRequisitionSavedForLater;
    }) => {
      return await auth.savedForLater(orgId, data);
    },
    onSuccess: (response) => {
      console.log(response);
      setLoading(false);
      success(response?.message);
      queryClient.invalidateQueries({ queryKey: ["fetchRequisition"] });
      queryClient.invalidateQueries({
        queryKey: ["fetchRequisitionSavedForLater"],
      });
    },
    onError: (error: any) => {
      setLoading(false);
      notifyError(
        error?.response?.data?.message || error.message || "An error occurred"
      );
    },
  });

  const saveForLater = async (
    orgId: string,
    data: PurchaseRequisitionSavedForLater
  ) => {
    return saveForLaterMutation({ orgId, data });
  };

  return {
    saveForLater,
    loading,
  };
};

export default useSaveForLater;
