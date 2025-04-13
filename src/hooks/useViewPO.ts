"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/api/auths";

/**
 * Hook to fetch and view a specific purchase order by ID
 * @param orderId - The purchase order ID to fetch
 * @returns Query result with purchase order data
 */
export default function useViewPO(orderId: string) {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['viewPO', orderId],
    queryFn: () => auth.viewPO(orderId),
    enabled: !!orderId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return { data, error, isLoading, isError };
}