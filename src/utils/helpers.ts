"use client";
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

export function useFetchData<T, E = Error>(
  queryKey: (string | number | undefined)[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, E>, 'queryKey' | 'queryFn'>
): UseQueryResult<T, E> {
  return useQuery<T, E>({
    queryKey,
    queryFn,
    refetchOnWindowFocus: false,
    ...options,
  });
}
export function format_price(price: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(price)
}
export const formatNumber = (num: string | number | undefined) => {
  if (num === undefined) return '0';
  const value = typeof num === 'string' ? parseFloat(num) : num;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value);
};
