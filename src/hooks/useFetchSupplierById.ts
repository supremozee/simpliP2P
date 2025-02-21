import { useQuery } from '@tanstack/react-query';
import { auth } from '@/api/auths';
import { FetchSupplierByIdResponse } from '@/types';

const useFetchSupplierById = (orgId: string, supplierId: string) => {
  return useQuery<FetchSupplierByIdResponse, Error>({
    queryKey: ['fetchSupplierById', orgId, supplierId],
    queryFn: () => auth.fetchSupplierById(orgId, supplierId),
    enabled: !!orgId && !!supplierId,
    refetchOnWindowFocus: false
  });
};

export default useFetchSupplierById;