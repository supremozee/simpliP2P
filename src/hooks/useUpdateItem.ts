import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";
import { UpdateData } from "@/types";
import useStore from "@/store";
import useNotify from "./useNotify";

const useUpdateItem = (orgId: string) => {
  const queryClient = useQueryClient();
  const { setLoading } = useStore();
  const { success, error: notifyError } = useNotify();

  const { mutateAsync: updateItemMutation } = useMutation({
    onMutate: () => {
      setLoading(true);
    },
    mutationFn: async ({ id, data }: { id: string; data: UpdateData }) => {
      return await auth.UpdateItem(orgId, id, data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (response: any) => {
      setLoading(false);
      success(response?.message);
      queryClient.invalidateQueries({
        queryKey: ["fetchItemsByPrNumber", orgId],
      });
      queryClient.invalidateQueries({
        queryKey: ["fetchRequisitionSavedForLater", orgId],
      });
    },
    onError: (error) => {
      setLoading(false);
      notifyError(error?.message);
    },
  });

  const updateItem = async (id: string, data: UpdateData) => {
    return updateItemMutation({ id, data });
  };

  return {
    updateItem,
  };
};

export default useUpdateItem;
