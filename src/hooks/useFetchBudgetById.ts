"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/api/auths";
import { Budget } from "@/types";

export default function useFetchBudgetById(orgId: string, id: string) {
  const { data, error, isLoading, isError } = useQuery<Budget, Error>({
    queryKey: ['fetchBudgetById', orgId, id],
    queryFn: () => auth.fetchBudgetById(orgId, id),
    enabled: !!orgId && !!id,
    refetchOnWindowFocus: false
  });

  return { data, error, isLoading, isError };
}