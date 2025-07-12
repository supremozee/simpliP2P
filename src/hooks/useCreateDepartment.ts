import { auth } from "@/helpers/auths";
import useStore from "@/store";
import { CreateDepartment } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";

const useCreateDepartment = () => {
  const { setLoading } = useStore();
  const { success, error: notifyError } = useNotify();
  const queryClient = useQueryClient();
  const { mutateAsync: createDepartmentMutation } = useMutation({
    onMutate: () => {
      setLoading(true);
    },
    mutationFn: async ({
      data,
      orgId,
    }: {
      data: CreateDepartment;
      orgId: string;
    }) => {
      return auth.createDepartment(data, orgId);
    },
    onSuccess: (response) => {
      setLoading(false);
      success(response?.success);
      queryClient.invalidateQueries({ queryKey: ["fetchDepartment"] });
    },
    onError: (error) => {
      setLoading(false);
      notifyError(error?.message);
    },
  });
  const createDepartment = async (data: CreateDepartment, orgId: string) => {
    return createDepartmentMutation({ data, orgId });
  };
  return {
    createDepartment,
  };
};

export default useCreateDepartment;
