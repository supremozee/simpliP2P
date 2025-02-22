import { auth } from '@/api/auths'
import useStore from '@/store'
import { CreateCategory } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useNotify from './useNotify'

const useCreateCategory = () => {
    const {setLoading} = useStore()
    const {success, error:notifyError} = useNotify()
    const queryClient = useQueryClient()
    const {mutateAsync:createCategoryMutation} = useMutation({
        onMutate: ()=> {
           setLoading(true)
        },
        mutationFn:async({data, orgId}: {data:CreateCategory, orgId:string})=> {
            return auth.createCategory(data, orgId)
        } ,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess:(response:any) => {
            if(response?.status === "success") {
                setLoading(false)
                success(response?.success)
            }
         queryClient.invalidateQueries({queryKey: ['fetchCategory']})
        },
        onError: (error) => {
            setLoading(false)
            notifyError(error?.message)
        }
    })
    const createCategory = async(data:CreateCategory, orgId: string)=> {
        return createCategoryMutation({data, orgId})
    }
    return {
        createCategory,
    }
}

export default useCreateCategory