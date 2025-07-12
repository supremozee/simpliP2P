import { auth } from "@/helpers/auths";
import useStore from "@/store";
import { CreateItemResponse, PurchaseItems } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useNotify from "./useNotify";

const useAddItemsToRequistion = () => {
  const { setLoading } = useStore();
  const { success, error: notifyError } = useNotify();
  const queryClient = useQueryClient();
  const { mutateAsync: addItemToRequisitionMutation } = useMutation({
    onMutate: () => {
      setLoading(true);
    },
    mutationFn: async ({
      data,
      orgId,
    }: {
      data: PurchaseItems;
      orgId: string;
    }): Promise<CreateItemResponse> => {
      return await auth.purchaseItems(data, orgId);
    },
    onSuccess: (response: CreateItemResponse) => {
      console.log(response);
      setLoading(false);
      success(response?.message);
      queryClient.invalidateQueries({ queryKey: ["fetchItemsByPrNumber"] });
      queryClient.invalidateQueries({
        queryKey: ["fetchRequisitionSavedForLater"],
      });
    },
    onError: (error) => {
      setLoading(false);
      notifyError(error?.message);
    },
  });
  const addItemsToRequisition = async (data: PurchaseItems, orgId: string) => {
    return addItemToRequisitionMutation({ data, orgId });
  };
  return {
    addItemsToRequisition,
  };
};

export default useAddItemsToRequistion;
