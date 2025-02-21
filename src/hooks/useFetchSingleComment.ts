/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/api/auths";
import { AllComment } from "@/types";

export default function useFetchSingleComment(orgId: string, entityId: string) {
  const { data, error, isLoading, isError } = useQuery<AllComment[], Error>({
    queryKey: ['singleComment', orgId, entityId],
    queryFn: () => auth.singleComment(orgId, entityId),
    enabled: !!orgId && !!entityId,
    refetchOnWindowFocus: false
  });

  return { data, error, isLoading, isError };
}