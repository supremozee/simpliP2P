import React from 'react'
import Button from '../atoms/Button'
import { useRouter } from 'next/navigation';

const ErrorComponent = ({text, error}:{text?:string; error?:boolean}) => {
  const router = useRouter()
  return (
    <div className='flex flex-col items-center w-full justify-center mt-10 h-full'>
      <p className='text-red-500 text-center font-bold w-1/2 justify-center text-[18px]'>{text || "000ps... something went wrong"}</p>
      {error && <Button onClick={() =>router.replace("/login") } className='mt-4 px-10 py-2  text-white rounded'>
        Contact support
      </Button>
      }
    </div>
  )
}

export default ErrorComponent