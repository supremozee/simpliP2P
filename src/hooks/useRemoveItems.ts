import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "../helpers/auths";
import { useState } from "react";
import useNotify from "./useNotify";

const useRemoveItem = () => {
  const queryClient = useQueryClient();
  const [loading, setIsLoading] = useState(false);
  const { success } = useNotify();
  const { mutateAsync: removeItemMutation } = useMutation({
    onMutate: () => {
      setIsLoading(true);
    },
    mutationFn: async ({ id, orgId }: { id: string; orgId: string }) => {
      return await auth.removeItems(id, orgId);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["fetchItemsByPrNumber"] });
        queryClient.invalidateQueries({
          queryKey: ["fetchRequisitionSavedForLater"],
        });
        success(data?.message);
        setIsLoading(false);
      }
    },
  });
  const removeItem = (id: string, orgId: string) => {
    removeItemMutation({ id, orgId });
  };
  return {
    removeItem,
    loading,
  };
};

export default useRemoveItem;
