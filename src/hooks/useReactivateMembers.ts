import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "../helpers/auths";
import { useState } from "react";
import useNotify from "./useNotify";

const useReactivateMember = () => {
  const queryClient = useQueryClient();
  const { success } = useNotify();
  const [loading, setIsLoading] = useState(false);
  const { mutateAsync: reactivateMutation } = useMutation({
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
      return auth.reactivateMember(orgId, memberId);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["fetchMembers"] });
        success(data?.message);
        setIsLoading(false);
      }
    },
  });
  const reactivateMember = (orgId: string, memberId: string) => {
    reactivateMutation({ orgId, memberId });
  };
  return {
    reactivateMember,
    loading,
  };
};

export default useReactivateMember;
