import { useQuery } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";

interface UseDataFetchOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
}

interface UseDataFetchResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseDualDataFetchResult<TPagedData, TCompleteData> {
  paginatedData: TPagedData | undefined;
  allData: TCompleteData | undefined;
  isPaginatedLoading: boolean;
  isAllDataLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Generic hook for fetching data with pagination support
 * Can be used for both paginated and complete data fetching
 */
export function useDataFetch<T>(
  queryKey: (string | number | undefined)[],
  queryFn: () => Promise<T>,
  options: UseDataFetchOptions = {}
): UseDataFetchResult<T> {
  const {
    enabled = true,
    staleTime = 1 * 60 * 1000, // 1 minute default
    gcTime = 5 * 60 * 1000, // 5 minutes default
    refetchOnWindowFocus = false,
  } = options;

  const { data, isLoading, isError, error, refetch } = useQuery<T, Error>({
    queryKey,
    queryFn,
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

/**
 * Enhanced hook that fetches both paginated and complete data in one hook
 * This eliminates the need for separate "complete" hooks
 */
export function useDualDataFetch<TPagedData, TCompleteData>(
  paginatedQueryKey: (string | number | undefined)[],
  paginatedQueryFn: () => Promise<TPagedData>,
  completeQueryKey: (string | number | undefined)[],
  completeQueryFn: () => Promise<TCompleteData>,
  options: UseDataFetchOptions = {}
): UseDualDataFetchResult<TPagedData, TCompleteData> {
  const {
    enabled = true,
    staleTime = 1 * 60 * 1000, // 1 minute default
    gcTime = 5 * 60 * 1000, // 5 minutes default
    refetchOnWindowFocus = false,
  } = options;

  // Fetch paginated data
  const {
    data: paginatedData,
    isLoading: isPaginatedLoading,
    isError: isPaginatedError,
    error: paginatedError,
    refetch: refetchPaginated,
  } = useQuery<TPagedData, Error>({
    queryKey: paginatedQueryKey,
    queryFn: paginatedQueryFn,
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
  });

  // Fetch complete data
  const {
    data: allData,
    isLoading: isAllDataLoading,
    isError: isAllDataError,
    error: allDataError,
    refetch: refetchAll,
  } = useQuery<TCompleteData, Error>({
    queryKey: completeQueryKey,
    queryFn: completeQueryFn,
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
  });

  const refetch = () => {
    refetchPaginated();
    refetchAll();
  };

  return {
    paginatedData,
    allData,
    isPaginatedLoading,
    isAllDataLoading,
    isError: isPaginatedError || isAllDataError,
    error: paginatedError || allDataError,
    refetch,
  };
}

/**
 * Hook for fetching paginated suppliers
 */
export function useFetchSuppliers(
  orgId: string,
  page: number = 1,
  pageSize: number = 10
) {
  return useDataFetch(
    ["fetchSuppliers", orgId, page, pageSize],
    () => auth.fetchSuppliers(orgId, page, pageSize),
    {
      enabled: !!orgId,
      staleTime: 1 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    }
  );
}

/**
 * Hook for fetching all suppliers (complete dataset)
 */
export function useFetchSuppliersComplete(orgId: string) {
  return useDataFetch(
    ["fetchSuppliersComplete", orgId],
    () => auth.fetchSuppliers(orgId, 1, 10000), // High page size to get all
    {
      enabled: !!orgId,
      staleTime: 5 * 60 * 1000, // Longer stale time for complete data
      gcTime: 10 * 60 * 1000,
    }
  );
}

/**
 * Hook for fetching paginated products
 */
export function useFetchProducts(
  orgId: string,
  page: number = 1,
  pageSize: number = 10
) {
  return useDataFetch(
    ["fetchProducts", orgId, page, pageSize],
    () => auth.fetchProducts(orgId, page, pageSize),
    {
      enabled: !!orgId,
      staleTime: 1 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    }
  );
}

/**
 * Hook for fetching all products (complete dataset)
 */
export function useFetchProductsComplete(orgId: string) {
  return useDataFetch(
    ["fetchProductsComplete", orgId],
    () => auth.fetchProducts(orgId, 1, 10000), // High page size to get all
    {
      enabled: !!orgId,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
}

/**
 * Hook for fetching paginated orders
 */
export function useFetchOrders(
  orgId: string,
  statusFilter?: string,
  page: number = 1,
  pageSize: number = 10
) {
  return useDataFetch(
    ["fetchOrders", orgId, statusFilter, page, pageSize],
    () => auth.allOrders(orgId, statusFilter, page, pageSize),
    {
      enabled: !!orgId,
      staleTime: 1 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    }
  );
}

/**
 * Hook for fetching all orders (complete dataset)
 */
export function useFetchOrdersComplete(orgId: string) {
  return useDataFetch(
    ["fetchOrdersComplete", orgId],
    () => auth.allOrders(orgId, undefined, 1, 10000), // High page size to get all
    {
      enabled: !!orgId,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
}
