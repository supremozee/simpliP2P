import { auth } from '@/api/auths';
import { FetchPurchaseRequisition } from '@/types';
import { useQuery } from '@tanstack/react-query';

const useFetchRequsitionsSavedForLater = (orgId: string) => {
  const { data, error, isLoading, isError } = useQuery<FetchPurchaseRequisition, Error>({
    queryKey: ['fetchRequisitionSavedForLater', orgId],
    queryFn: () => auth.fetchRequistionsBySavedForLater(orgId),
    refetchOnWindowFocus: false,
    enabled: !!orgId,
  });

  return { data, error, isLoading, isError };
};

export default useFetchRequsitionsSavedForLater;