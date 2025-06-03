"use client";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/api/auths";
import { FetchCategoryResponse } from "@/types";

export default function useFetchCategories(orgId: string) {
  const { data, error, isLoading, isError } = useQuery<FetchCategoryResponse, Error>({
    queryKey: ['fetchCategory', orgId],
    queryFn: () => auth.fetchCategory(orgId),
    enabled: !!orgId ,
  });

  return { data, error, isLoading, isError };
}