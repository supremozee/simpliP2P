"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/api/auths";
import { FetchBranchResponse } from "@/types";

export default function useFetchBranch(orgId: string) {
  const { data, error, isLoading, isError } = useQuery<FetchBranchResponse, Error>({
    queryKey: ['fetchBranch', orgId],
    queryFn: () => auth.fetchBranch(orgId),
    enabled: !!orgId ,
    refetchOnWindowFocus: false
  });

  return { data, error, isLoading, isError };
}