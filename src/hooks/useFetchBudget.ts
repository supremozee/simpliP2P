"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";
import { Budget } from "@/types";

export default function useFetchBudget(orgId: string) {
  const { data, error, isLoading, isError } = useQuery<Budget[], Error>({
    queryKey: ["fetchBudget", orgId],
    queryFn: () => auth.fetchBudget(orgId),
    enabled: !!orgId,
    refetchOnWindowFocus: false,
  });

  return { data, error, isLoading, isError };
}
