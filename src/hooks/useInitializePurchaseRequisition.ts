import { auth } from '@/api/auths'
import useStore from '@/store'
import { InitializePurchaseRequisition, InitializeRequisitionResponse } from '@/types'
import { useMutation } from '@tanstack/react-query'
import useNotify from './useNotify'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const useInitializePurchaseRequisition = () => {
    const {setLoading, setPr} = useStore();
    const [errorMessage, setErrorMessage] = useState("")
    const router = useRouter()
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
                router.push(`/initialize-requisition/${response?.data.pr_number}`)
                setPr({
                    pr_number: response?.data?.pr_number,
                    id: response?.data?.id
                })
                success(response?.message)
            }      
        },
        onError: (error) => {
            setLoading(false)
            setErrorMessage(error?.message )
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
          errorMessage
    }
}

export default useInitializePurchaseRequisition