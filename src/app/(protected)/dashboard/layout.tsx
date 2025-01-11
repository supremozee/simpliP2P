import DashboardNav from '@/components/organisms/DashboardNav'
import DashboardLayout from '@/components/templates/DashboardLayout'
import React from 'react'

const layout = ({children}: {children:React.ReactNode}) => {
  return (
    <DashboardLayout>
        <div className='bg-[#808080] bg-opacity-15 h-screen p-7 font-roboto flex flex-col gap-5'>
            <DashboardNav title='Supplier Management'/>
            <main className='ml-1 sm:p-8 p-5 h-full'>
               {children}
            </main>
        </div>
    </DashboardLayout>
  )
}

export default layout