import { auth } from '@/api/auths'
import useStore from '@/store'
import { Logout } from '@/types'
import { useMutation } from '@tanstack/react-query'
import useNotify from './useNotify'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
const useLogout = () => {
    const {setLoading} = useStore()
    const router = useRouter()
    const {success, error} = useNotify()
    const {mutateAsync:logoutMutation} = useMutation({
        onMutate: ()=> {
          setLoading(true)
        },
       mutationFn: auth.logout,
        onSuccess: (response)=> {
            success(response?.message)
            router.push('/login')
            setLoading(false)
            Cookies.remove('accessToken', { domain: 'localhost', path: '/' });
            Cookies.remove('accessToken', { domain: 'simplip2p.vercel.app', path: '/' });
       }, 
       onError: (response) => {
        error(response?.message)
        setLoading(false)
       }
    })

   const logout = async (data:Logout) => {
    return logoutMutation(data)
   }
   return  {
    logout
   }
}

export default useLogout