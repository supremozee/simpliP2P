"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";
import { FetchBranchResponse } from "@/types";

export default function useFetchBranchById(orgId: string, BranchId: string) {
  const { data, error, isLoading, isError } = useQuery<
    FetchBranchResponse,
    Error
  >({
    queryKey: ["fetchBranchById", orgId, BranchId],
    queryFn: () => auth.fetchBranchById(orgId, BranchId),
    enabled: !!orgId && !!BranchId,
    refetchOnWindowFocus: false,
  });

  return { data, error, isLoading, isError };
}
