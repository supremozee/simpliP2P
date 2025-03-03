"use client"
import useGetUser from '@/hooks/useGetUser'
import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react'
import ProfileSkeleton from '../atoms/Skeleton/profile'
import { useRouter } from 'next/navigation'
import useStore from '@/store'
import { IoAddOutline, IoChevronDown, IoPersonOutline } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import LogoutButton from './LogoutButton'
import Button from '../atoms/Button'

const Profile = () => {
  const { user, isLoading } = useGetUser();
  const router = useRouter()
  const {currentOrg, setCurrentOrg, setOrgName} = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (isLoading) return <ProfileSkeleton/>
  
  const organizationDetails = user?.data?.user_organisations || []
  const currentOrgDetails = organizationDetails.find((org) => org.org_id === currentOrg)
  
  // Separate organizations into creator and member organizations
  const creatorOrgs = organizationDetails.filter(org => org.is_creator);
  const memberOrgs = organizationDetails.filter(org => !org.is_creator);

  const handleOrgSwitch = (orgId: string, name: string) => {
    setCurrentOrg(orgId)
    setOrgName(name)
    router.push(`/${name}/dashboard`)
    setIsOpen(false)
  }

  const handleProfileClick = () => {
    router.push('/upload/user')
    setIsOpen(false)
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors'
      >
      <div className='flex flex-col items-end justify-center'>
          <h1 className='sm:text-[16px] text-[16px] text-[#2E2F2E] leading-none'>
            {user?.data?.first_name + " " + user?.data?.last_name}
          </h1>
          <p className='sm:text-[12px] text-[12px] text-[#2E2F2E] mt-1 leading-none text-end'>
            {currentOrgDetails?.role || 'Member'}
          </p>
      </div>
      <Image
        src={user?.data?.profile_picture || "/c0749b7cc401421662ae901ec8f9f660.jpg"}
        alt='Profile pic'
        width={60}
        height={60}
          className='rounded-full object-cover bg-cover sm:w-[50px] sm:h-[50px] w-[40px] h-[40px]'
        />
        <IoChevronDown className={cn(
          'w-4 h-4 text-gray-500 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
          >
            {/* Profile Section */}
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center gap-3 p-2">
                <Image
                  src={user?.data?.profile_picture || "/c0749b7cc401421662ae901ec8f9f660.jpg"}
                  alt='Profile pic'
                  width={40}
                  height={40}
                  className='rounded-full object-cover bg-cover sm:w-[50px] sm:h-[50px] w-[40px] h-[40px]'
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.data?.first_name + " " + user?.data?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.data?.email}</p>
                </div>
              </div>
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-3 w-full mt-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <IoPersonOutline className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">Change Profile Picture</span>
              </button>
            </div>
            <div className="px-4 py-2 border-b border-gray-100">
              <Button
                onClick={() => {
                  router.push(`/create-organization`);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full p-2 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary transition-colors text-left"
              >
                <IoAddOutline className="w-5 h-5" />
                <span className="text-sm font-medium">Create New Organization</span>
              </Button>
            </div>
            {/* Organizations Section */}
            <div className="px-4 py-2">
              {creatorOrgs.length > 0 && (
                <>
                  <p className="text-xs font-medium text-primary mb-2">YOUR ORGANIZATIONS</p>
                  <div className="space-y-1 mb-4">
                    {creatorOrgs.map((org) => (
                      <button
                        key={org.org_id}
                        onClick={() => handleOrgSwitch(org.org_id, org.name)}
                        className={cn(
                          "flex items-center gap-3 w-full p-2 rounded-lg transition-all duration-200 text-left relative",
                          currentOrg === org.org_id 
                            ? "bg-primary/5 text-primary ring-1 ring-primary/20" 
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        <div className={cn(
                          "relative w-8 h-8 rounded-lg overflow-hidden",
                          currentOrg === org.org_id 
                            ? "ring-2 ring-primary" 
                            : "bg-gray-100"
                        )}>
                          <Image
                            src={org.logo || "/logo-black.png"}
                            alt={org.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{org.name}</p>
                          <p className="text-xs text-gray-500">
                            Administrator
                            {currentOrg === org.org_id && (
                              <span className="ml-2 text-primary">(Current)</span>
                            )}
                          </p>
                        </div>
                        {currentOrg === org.org_id && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {memberOrgs.length > 0 && (
                <>
                  <p className="text-xs font-medium text-gray-500 mb-2">MEMBER ORGANIZATIONS</p>
                  <div className="space-y-1 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
                    {memberOrgs.map((org) => (
                      <button
                        key={org.org_id}
                        onClick={() => handleOrgSwitch(org.org_id, org.name)}
                        className={cn(
                          "flex items-center gap-3 w-full p-2 rounded-lg transition-all duration-200 text-left relative",
                          currentOrg === org.org_id 
                            ? "bg-primary/5 text-primary ring-1 ring-primary/20" 
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        <div className={cn(
                          "relative w-8 h-8 rounded-lg overflow-hidden",
                          currentOrg === org.org_id 
                            ? "ring-2 ring-primary" 
                            : "bg-gray-100"
                        )}>
                          <Image
                            src={org.logo || "/logo-black.png"}
                            alt={org.name}
                            fill
                            className="object-cover"
      />
      </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{org.name}</p>
                          <p className="text-xs text-gray-500">
                            {org.role}
                            {currentOrg === org.org_id && (
                              <span className="ml-2 text-primary">(Current)</span>
                            )}
                          </p>
                        </div>
                        {currentOrg === org.org_id && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Logout Section */}
            <div className="px-4 py-2 border-t border-gray-100">
              <LogoutButton onClick={() => setIsOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Profile