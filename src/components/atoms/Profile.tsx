import Image from 'next/image'
import React from 'react'

const Profile = () => {
  return (
    <div className='flex gap-2 items-center'>
         <div className='flex flex-col items-end justify-center'>
                <h1 className='sm:text-[20px] text-[16px] text-[#2E2F2E] leading-none'>John Doe</h1>
                <p className='sm:text-[14px] text-[12px] text-[#2E2F2E] mt-1 leading-none text-end'>Lead HR</p>
         </div>
         <Image
         src={'/profilepic.png'}
         alt='Profile pic'
         width={60}
         height={60}
         className='rounded-full object-cover bg-cover sm:w-[60px] sm:h-[60px] w-[40px] h-[40px]'
         />
    </div>
  )
}

export default Profile