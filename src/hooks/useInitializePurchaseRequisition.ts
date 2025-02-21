import { auth } from '@/api/auths'
import useStore from '@/store'
import { InitializePurchaseRequisition, InitializeRequisitionResponse } from '@/types'
import { useMutation } from '@tanstack/react-query'
import useNotify from './useNotify'

const useInitializePurchaseRequisition = () => {
    const {setLoading, setErrorMessage, setPr, setIsOpen} = useStore()
    const {success, error:notifyError} = useNotify()
    const {mutateAsync:initializePurchaseRequisitionMutation} = useMutation({
        onMutate: ()=> {
           setLoading(true)
           setErrorMessage("")
        },
        mutationFn:auth.initializePurchaseRequisition,
        onSuccess:(response:InitializeRequisitionResponse) => {
            if(response?.status === "success") {
                setLoading(false)
                setIsOpen(true) 
                setPr(response?.data)
                success(response?.message)
            }      
        },
        onError: (error) => {
            setLoading(false)
            setErrorMessage(error?.message )
            setIsOpen(true) 
            notifyError(error?.message )
        },
        onSettled: ()=> {
            setLoading(false)
        }
    })
    const initializePurchaseRequisition = async(data:InitializePurchaseRequisition)=> {
        return initializePurchaseRequisitionMutation(data)
    }
    return {
          initializePurchaseRequisition,
    }
}

export default useInitializePurchaseRequisition