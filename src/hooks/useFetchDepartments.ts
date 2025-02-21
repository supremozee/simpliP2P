"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/api/auths";
import { FetchDepartmentResponse } from "@/types";

export default function useFetchDepartment(orgId: string): { data: FetchDepartmentResponse | undefined, error: Error | null, isLoading: boolean, isError: boolean } {
  const { data, error, isLoading, isError } = useQuery<FetchDepartmentResponse, Error>({
    queryKey: ['fetchDepartment', orgId],
    queryFn: () => auth.fetchDepartment(orgId),
    enabled: !!orgId ,
    refetchOnWindowFocus: false
  });

  return { data, error, isLoading, isError };
}