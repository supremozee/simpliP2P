import { useFetchOrders } from "./useDataFetch";

// Re-export for backward compatibility with parameter mapping
export default function useFetchAllOrders(
  orgId: string,
  status?: string,
  page: number = 1,
  pageSize: number = 10
) {
  return useFetchOrders(orgId, status, page, pageSize);
}
