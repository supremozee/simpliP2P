import { auth } from '@/api/auths';
import { FetchPurchaseRequisition } from '@/types';
import { useQuery } from '@tanstack/react-query';

const useFetchPurchaseRequisition = (orgId: string, status?:string) => {
  const { data, error, isLoading, isError } = useQuery<FetchPurchaseRequisition, Error>({
    queryKey: ['fetchRequisition', orgId, status],
    queryFn: () => auth.fetchRequisition(orgId, status),
    refetchOnWindowFocus: false,
    enabled: !!orgId,
  });

  return { data, error, isLoading, isError };
};

export default useFetchPurchaseRequisition;