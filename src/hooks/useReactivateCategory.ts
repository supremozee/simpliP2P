import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '../api/auths';
import { useState } from 'react';
import useNotify from './useNotify';

const useReactivateCategory = () => {
  const queryClient = useQueryClient();
    const {success} = useNotify()
    const [loading, setIsLoading] = useState(false)
   const {mutateAsync: reactivateMutation} = useMutation({
    onMutate: ()=> {
      setIsLoading(true)
  },
    mutationFn: async ({orgId, CategoryId}: {orgId: string, CategoryId: string})=> {
         return auth.reactivateCategory(orgId, CategoryId)
    },
    onSuccess: (data)=> {
      if(data) {
      queryClient.invalidateQueries({queryKey: ['fetchCategory']})
      success(data?.message)
      setIsLoading(false)
      }
  }
   })
   const reactivateCategory = (orgId:string, CategoryId:string)=> {
         reactivateMutation({orgId, CategoryId}) 
   }
   return {
     reactivateCategory,
     loading
   }
};

export default useReactivateCategory;