import React from 'react'
import Button from '../atoms/Button'
import { FcGoogle } from 'react-icons/fc'
import { useGoogleLogin } from '@/hooks/useGoogleLogin'

const LoginWithGoogle = () => {
    const {initiate} = useGoogleLogin()
    const handleInitiate = ()=> {
         initiate()
    }
  return (
    <Button kind='white'
    onClick={handleInitiate}
    className='border border-[#BDBDBD] flex gap-3 justify-center rounded-[12px] text-[#424242] font-bold'>
    <FcGoogle size={25} />Log in with Google
  </Button>
  )
}

export default LoginWithGoogle