import { auth } from '@/api/auths'
import { DeleteSupplierResponse } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const useDeleteSupplier = (orgId:string) => {
    const queryClient = useQueryClient()
     const deleteSupplier = useMutation<DeleteSupplierResponse, Error, {supplierId:string}>({
        mutationFn: ({supplierId})=> auth.deleteSupplier(orgId, supplierId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetchSuppliers', orgId]})
        }
     })
  return   deleteSupplier
  
}

export default useDeleteSupplier