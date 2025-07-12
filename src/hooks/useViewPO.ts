"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";
import { ViewPOResponse } from "@/types";

/**
 * Hook to fetch and view a specific purchase order by ID
 * @param token - Authentication token for non-authenticated views
 * @param orderId - The purchase order ID to fetch
 * @returns Query result with purchase order data
 */
export default function useViewPO(token: string, orderId: string) {
  const { data, error, isLoading, isError } = useQuery<ViewPOResponse, Error>({
    queryKey: ["viewPO", orderId],
    queryFn: () => auth.viewPO(token, orderId),
    enabled: !!orderId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return { data, error, isLoading, isError };
}
