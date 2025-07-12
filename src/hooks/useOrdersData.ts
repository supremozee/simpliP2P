import { auth } from "@/helpers/auths";
import { useDualDataFetch } from "./useDataFetch";

/**
 * Optimized hook that fetches both paginated orders and all orders data
 * This replaces the need for separate useFetchAllOrders and useFetchAllOrdersComplete hooks
 */
const useOrdersData = (orgId: string, page?: number, limit?: number) => {
  return useDualDataFetch(
    ["allOrders", orgId, page, limit],
    () => auth.allOrders(orgId, undefined, page, limit),
    ["allOrdersComplete", orgId],
    () => auth.allOrders(orgId, undefined, 1, 10000), // Fetch all with high pageSize
    {
      enabled: !!orgId,
    }
  );
};

export default useOrdersData;
