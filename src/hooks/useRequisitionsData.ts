import { auth } from "@/helpers/auths";
import { useDualDataFetch } from "./useDataFetch";

/**
 * Optimized hook that fetches both paginated requisitions and all requisitions data
 * This can be used with different status filters
 */
const useRequisitionsData = (
  orgId: string,
  status?: string,
  page?: number,
  limit?: number
) => {
  return useDualDataFetch(
    ["fetchRequisition", orgId, status, page, limit],
    () => auth.fetchRequisition(orgId, status, page, limit),
    ["fetchRequisitionComplete", orgId, status],
    () => auth.fetchRequisition(orgId, status, 1, 10000), // Fetch all with high pageSize
    {
      enabled: !!orgId,
    }
  );
};

export default useRequisitionsData;
