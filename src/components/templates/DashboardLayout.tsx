"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Sidebar } from '../layouts/SideBar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import useClickOutside from '@/hooks/useClickOutside';
import MobileHeader from '../organisms/MobileHeader';
import { cn } from '@/utils/cn';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setCollapsed(!isDesktopDevice);
  }, [isDesktopDevice]);

  useClickOutside([sidebarRef], () => {
    if (!isDesktopDevice && isOpen) {
      setIsOpen(false);
    }
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=''>
      <MobileHeader collapsed={collapsed} ref={sidebarRef} toggleSidebar={toggleSidebar} isOpen={isOpen}/>
      <div className='w-full flex sm:flex-row'>
        {!isDesktopDevice && isOpen && (
        <div className="fixed inset-0 w-full bg-black bg-opacity-15 z-[99]" onClick={toggleSidebar}></div>
      )}
      <Sidebar collapsed={collapsed} ref={sidebarRef} isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={cn('min-h-screen w-full', 
        isOpen && "hidden sm:block"
      )}>
        {children}
      </div>
    </div>
    </div>
  );
};

export default DashboardLayout;