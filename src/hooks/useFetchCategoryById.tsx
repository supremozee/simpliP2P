"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";
import { FetchCategoryByIdResponse } from "@/types";

export default function useFetchCategoryById(
  orgId: string,
  categoryId: string
) {
  const { data, error, isLoading, isError } = useQuery<
    FetchCategoryByIdResponse,
    Error
  >({
    queryKey: ["fetchBranchById", orgId, categoryId],
    queryFn: () => auth.fetchCategoryById(orgId, categoryId),
    enabled: !!orgId && !!categoryId,
    refetchOnWindowFocus: false,
  });

  return { data, error, isLoading, isError };
}
