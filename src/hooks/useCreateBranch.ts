import { auth } from "@/helpers/auths";
import useStore from "@/store";
import { CreateBranch, CreateBranchResponse } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";

const useCreateBranch = () => {
  const { setLoading } = useStore();
  const { success, error: notifyError } = useNotify();
  const queryClient = useQueryClient();
  const { mutateAsync: createBranchMutation } = useMutation({
    onMutate: () => {
      setLoading(true);
    },
    mutationFn: async ({
      data,
      orgId,
    }: {
      data: CreateBranch;
      orgId: string;
    }) => {
      return auth.createBranch(data, orgId);
    },
    onSuccess: (response: CreateBranchResponse) => {
      if (response?.status === "success") {
        setLoading(false);
        success(response?.message || "Branch created successfully");
        queryClient.invalidateQueries({ queryKey: ["fetchBranch"] });
      }
    },
    onError: (error) => {
      setLoading(false);
      notifyError(error?.message);
    },
  });
  const createBranch = async (data: CreateBranch, orgId: string) => {
    return createBranchMutation({ data, orgId });
  };
  return {
    createBranch,
  };
};

export default useCreateBranch;
