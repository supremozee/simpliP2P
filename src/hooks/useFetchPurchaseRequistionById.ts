import { auth } from "@/helpers/auths";
import { FetchPurchaseRequisitionById } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useFetchPurchaseRequisitionById = (orgId: string, reqId: string) => {
  const { data, error, isLoading, isError } = useQuery<
    FetchPurchaseRequisitionById,
    Error
  >({
    queryKey: ["fetchRequisitionById", orgId, reqId],
    queryFn: () => auth.fetchRequisitionById(orgId, reqId),
    refetchOnWindowFocus: false,
    enabled: !!orgId && !!orgId,
  });

  return { data, error, isLoading, isError };
};

export default useFetchPurchaseRequisitionById;
