import { auth } from "@/helpers/auths";
import { useDualDataFetch } from "./useDataFetch";

/**
 * Optimized hook that fetches both paginated suppliers and all suppliers data
 * This replaces the need for separate useFetchSuppliers and useFetchSuppliersComplete hooks
 */
const useSuppliersData = (orgId: string, page?: number, limit?: number) => {
  return useDualDataFetch(
    ["fetchSuppliers", orgId, page, limit],
    () => auth.fetchSuppliers(orgId, page, limit),
    ["fetchSuppliersComplete", orgId],
    () => auth.fetchSuppliers(orgId, 1, 10000), // Fetch all with high pageSize
    {
      enabled: !!orgId,
    }
  );
};

export default useSuppliersData;
