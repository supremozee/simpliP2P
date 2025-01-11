import React from 'react'
import Search from '../atoms/Search'
import Notifications from '../atoms/Notifications'
import Profile from '../atoms/Profile'

const DashboardNav = ({title}: {title:string}) => {
  return (
    <div className ="sm:flex hidden justify-between w-full items-center">
        <h2 className='text-[28px] text-[#4C5661] font-semibold w-[70%]'>{title}</h2>
        <div className='flex gap-3 items-center justify-between w-[30%]'>
        <div className='flex gap-4'>
          <Search/>
          <Notifications/>
        </div>
          <Profile/>
        </div>
    </div>
  )
}

export default DashboardNav