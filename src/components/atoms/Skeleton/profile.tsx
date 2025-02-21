import React from 'react'

const ProfileSkeleton = () => {
    return (
        <div className='flex gap-2 items-center'>
          <div className='flex flex-col items-end justify-center'>
            <div className='sm:w-[100px] w-[80px] h-[20px] bg-gray-200 animate-pulse'></div>
            <div className='sm:w-[60px] w-[40px] h-[14px] bg-gray-200 animate-pulse mt-1'></div>
          </div>
          <div className='rounded-full bg-gray-200 animate-pulse sm:w-[60px] sm:h-[60px] w-[40px] h-[40px]'></div>
        </div>
      );
    }

export default ProfileSkeleton