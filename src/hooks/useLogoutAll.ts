import { auth } from '@/api/auths'
import useStore from '@/store'
import {  LogoutAll } from '@/types'
import { useMutation } from '@tanstack/react-query'
import useNotify from './useNotify'

const useLogoutAll = () => {
    const {setLoading} = useStore()
    const {success, error} = useNotify()
    const {mutateAsync:logoutAllMutation} = useMutation({
        onMutate: ()=> {
          setLoading(true)
        },
       mutationFn: auth.logoutAll,
        onSuccess: (response)=> {
            success(response?.message)
            setLoading(false)
       }, 
       onError: (response) => {
        error(response?.message)
        setLoading(false)
       }
    })

   const logoutAll = async (data:LogoutAll) => {
    return logoutAllMutation(data)
   }
   return  {
    logoutAll
   }
}

export default useLogoutAll