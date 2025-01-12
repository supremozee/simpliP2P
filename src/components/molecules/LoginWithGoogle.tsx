import React from 'react'
import Button from '../atoms/Button'
import { FcGoogle } from 'react-icons/fc'
import { useGoogleLogin } from '@/hooks/useGoogleLogin'

const LoginWithGoogle = () => {
    const {initiate, loading} = useGoogleLogin()
    const handleInitiate = ()=> {
         initiate()
  }
  return (
    <Button kind='white'
          onClick={handleInitiate}
          disabled={loading}
          className='border border-[#BDBDBD] flex gap-3 justify-center rounded-[12px] text-[#424242] font-bold'>
          <FcGoogle size={25} />{loading ? "Processing...": "Log in with Google"}
  </Button>
  )
}

export default LoginWithGoogle