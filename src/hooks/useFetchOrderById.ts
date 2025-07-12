"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";
import { FetchOrderResponseById } from "@/types";

export default function useFetchAllOrderById(orgId: string, orderId: string) {
  const { data, error, isLoading, isError } = useQuery<
    FetchOrderResponseById,
    Error
  >({
    queryKey: ["fetchOrders", orgId, orderId],
    queryFn: () => auth.fetchOrderById(orgId, orderId),
    enabled: !!orgId && !!orderId,
    refetchOnWindowFocus: false,
  });

  return { data, error, isLoading, isError };
}
