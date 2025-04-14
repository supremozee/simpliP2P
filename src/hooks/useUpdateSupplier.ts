import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/api/auths';
import { UpdateSupplierData, UpdateSupplierResponse } from '@/types';
import useNotify from './useNotify';

const useUpdateSupplier = (orgId: string) => {
  const queryClient = useQueryClient();
  const {success} = useNotify()
  return useMutation<UpdateSupplierResponse, Error, { supplierId: string; data: UpdateSupplierData }>({
    mutationFn: ({ supplierId, data }) => auth.updateSupplier(orgId, supplierId, data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (response:any) => {
      success(response?.message)
      queryClient.invalidateQueries({queryKey:['fetchSuppliers', orgId]});
    },
  });
};

export default useUpdateSupplier;