import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "../helpers/auths";
import { useState } from "react";
import useNotify from "./useNotify";

const useDeactivateMember = () => {
  const queryClient = useQueryClient();
  const [loading, setIsLoading] = useState(false);
  const { success } = useNotify();
  const { mutateAsync: deactivateMutation } = useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    mutationFn: async ({
      orgId,
      memberId,
    }: {
      orgId: string;
      memberId: string;
    }) => {
      return auth.deactivateMember(orgId, memberId);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["fetchMembers"] });
        success(data?.message);
        setIsLoading(false);
      }
    },
  });
  const deactivateMember = (orgId: string, memberId: string) => {
    deactivateMutation({ orgId, memberId });
  };
  return {
    deactivateMember,
    loading,
  };
};

export default useDeactivateMember;
