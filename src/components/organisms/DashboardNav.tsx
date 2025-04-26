"use client"
import React from 'react'
// import Search from '../atoms/Search'
import Notifications from '../atoms/Notifications'
import Profile from '../molecules/Profile'
import { usePathname } from 'next/navigation'

const DashboardNav = () => {
  const pathname = usePathname()
  const title = pathname.split('/').pop() || 'Dashboard'

  return (
    <div className="sticky top-0 z-30 cursor-pointer bg-[#808080] bg-opacity-15 border-b border-gray-100 w-full shadow-lg drop-shadow-lg">
      <div className="px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {title.replaceAll("-", " ")}
          </h2>
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-6">
            {/* <Search /> */}
            <Notifications />
          </div>
            <Profile />
        </div>
      </div>
    </div>
  )
}

export default DashboardNav