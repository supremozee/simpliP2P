import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/api/auths';
import { UpdateSupplierData, UpdateSupplierResponse } from '@/types';

const useUpdateSupplier = (orgId: string) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateSupplierResponse, Error, { supplierId: string; data: UpdateSupplierData }>({
    mutationFn: ({ supplierId, data }) => auth.updateSupplier(orgId, supplierId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['fetchSuppliers', orgId]});
    },
  });
};

export default useUpdateSupplier;