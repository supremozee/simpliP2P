import React from 'react'
import { IoNotificationsOutline } from 'react-icons/io5'

const Notifications = () => {
  return (
    <div className='w-[48px] h-[48px] flex justify-center items-center bg-white rounded-[12px]'>
         <IoNotificationsOutline size={21} color='black' />
    </div>
  )
}

export default Notifications