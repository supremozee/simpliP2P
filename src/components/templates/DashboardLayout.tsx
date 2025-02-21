"use client";
import React, { useEffect, useRef, useState } from 'react';
import DashboardNav from '@/components/organisms/DashboardNav';
import { Sidebar } from '@/components/layouts/SideBar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import useClickOutside from '@/hooks/useClickOutside';
import MobileHeader from '@/components/organisms/MobileHeader';
import { cn } from '@/utils/cn';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
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
    if (isDesktopDevice) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Modal root container with highest z-index */}
      <div id="modal-root" className="relative z-[100]" />

      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-40">
        <MobileHeader
          ref={sidebarRef}
          collapsed={collapsed}
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {!isDesktopDevice && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - higher z-index for mobile */}
      <div className={cn(
        "fixed left-0 top-0 h-full",
        !isDesktopDevice && "z-50",
        // Hide sidebar on mobile when closed
        !isDesktopDevice && !isOpen && "-translate-x-full",
        "transition-transform duration-300"
      )}>
        <Sidebar
          ref={sidebarRef}
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* Main content wrapper */}
      <div className={cn(
        'min-h-screen',
        isDesktopDevice && (isCollapsed ? 'sm:pl-[80px]' : 'sm:pl-[250px]'),
        'pt-[60px] sm:pt-0',
        'transition-all duration-300'
      )}>
        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen w-full">
          <div className={cn(
            'flex-1 bg-[#808080] bg-opacity-15',
            'relative z-0'
          )}>
            <main className="relative">
            <div className="hidden sm:block sticky top-0 z-30">
            <DashboardNav />
            </div>
            <div className='p-3'>
              {children}
            </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;