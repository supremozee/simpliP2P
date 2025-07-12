"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";
import { FetchProductsResponse } from "@/types";

export default function useFetchProducts(
  orgId: string,
  page: number = 1,
  pageSize: number = 10
) {
  const { data, error, isLoading, isError } = useQuery<
    FetchProductsResponse,
    Error
  >({
    queryKey: ["fetchProducts", orgId, page, pageSize],
    queryFn: () => auth.fetchProducts(orgId, page, pageSize),
    enabled: !!orgId,
    refetchOnWindowFocus: false,
  });

  return { data, error, isLoading, isError };
}
