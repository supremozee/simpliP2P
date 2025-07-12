import { auth } from "@/helpers/auths";
import { FetchPurchaseRequisition } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useFetchPurchaseRequisition = (orgId: string, status?: string) => {
  const { data, error, isLoading, isError, refetch } = useQuery<
    FetchPurchaseRequisition,
    Error
  >({
    queryKey: ["fetchRequisition", orgId, status],
    queryFn: () => auth.fetchRequisition(orgId, status),
    enabled: !!orgId,
  });

  return { data, error, isLoading, isError, refetch };
};

export default useFetchPurchaseRequisition;
