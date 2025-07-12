import { auth } from "@/helpers/auths";
import { useDualDataFetch } from "./useDataFetch";

/**
 * Optimized hook that fetches both paginated products and all products data
 * This replaces the need for separate useFetchProducts and useFetchAllProductsComplete hooks
 */
const useProductsData = (orgId: string, page?: number, limit?: number) => {
  return useDualDataFetch(
    ["fetchProducts", orgId, page, limit],
    () => auth.fetchProducts(orgId, page, limit),
    ["fetchProductsComplete", orgId],
    () => auth.fetchProducts(orgId, 1, 10000), // Fetch all with high pageSize
    {
      enabled: !!orgId,
    }
  );
};

export default useProductsData;
