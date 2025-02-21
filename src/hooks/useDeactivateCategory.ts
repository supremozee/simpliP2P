import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '../api/auths';
import { useState } from 'react';
import useNotify from './useNotify';

const useDeactivateCategory = () => {
  const queryClient = useQueryClient();
    const {success} = useNotify()
    const [loading, setIsLoading] = useState(false)
   const {mutateAsync: deactivateMutation} = useMutation({
    onMutate: ()=> {
      setIsLoading(true)
  },
    mutationFn: async ({orgId, CategoryId}: {orgId: string, CategoryId: string})=> {
         return auth.deactivateCategory(orgId, CategoryId)
    },
    onSuccess: (data)=> {
      if(data) {
      queryClient.invalidateQueries({queryKey: ['fetchCategory']})
      success(data?.message)
      setIsLoading(false)
      }
  }
   })
   const deactivateCategory = (orgId:string, CategoryId:string)=> {
         deactivateMutation({orgId, CategoryId}) 
   }
   return {
     deactivateCategory,
     loading
   }
};

export default useDeactivateCategory;