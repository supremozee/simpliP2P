"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/api/auths";
import { FetchOrdersResponse } from "@/types";

export default function useFetchAllOrders(orgId: string, status?: string) {
  const { data, error, isLoading, isError } = useQuery<FetchOrdersResponse, Error>({
    queryKey: ['fetchOrders', orgId],
    queryFn: () => auth.allOrders(orgId, status),
    enabled: !!orgId ,
    refetchOnWindowFocus: false
  });

  return { data, error, isLoading, isError };
}