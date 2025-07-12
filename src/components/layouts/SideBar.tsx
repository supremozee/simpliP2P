"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useEffect } from "react";
import { cn } from "@/utils/cn";
// import LogoutButton from "../molecules/LogoutButton";
import SidebarHeader from "../molecules/SideBarHeader";
import {useSidebarLogic} from "@/hooks/useSideBarLogic";
import { motion } from "framer-motion";
import NavigationItem from "../atoms/Nav";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ isOpen, toggleSidebar, isCollapsed, setIsCollapsed }, ref) => {
    const {
      pathname,
      router,
      isDesktop,
      openDropdowns,
      hoveredItem,
      setHoveredItem,
      toggleDropdown,
      createTabLink,
      hasPermissionForLink,
      filteredLinks,
      setOnToggle,
    } = useSidebarLogic();

    const toggleCollapse = () => {
      setOnToggle(!isCollapsed);
      setIsCollapsed(!isCollapsed);
    };

    const handleLinkClick = () => {
      if (!isDesktop) toggleSidebar();
    };

    // Auto-collapse logic
    useEffect(() => {
      if (isOpen && !isDesktop) {
        setIsCollapsed(false);
      }
    }, [isOpen, isDesktop, setIsCollapsed]);

    return (
      <>
        <motion.aside
          ref={ref}
          initial={false}
          animate={{
            width: isCollapsed ? 80 : 250,
            transition: { duration: 0.3 },
          }}
          className={cn(
            "drop-shadow-lg shadow-inner sm:flex hidden flex-col bg-white",
            "overflow-x-hidden custom-scrollbar fixed left-0 top-0 h-screen z-40",
            "transition-all duration-300 ease-in-out",
            !isDesktop && (isOpen 
              ? "translate-x-0 flex max-w-[270px] h-screen" 
              : "-translate-x-full"
            )
          )}
        >
          <div className="flex flex-col h-full">
            <SidebarHeader
              isDesktop={isDesktop}
              isCollapsed={isCollapsed}
              toggleCollapse={toggleCollapse}
              toggleSidebar={toggleSidebar}
            />

            {/* Navigation Section */}
            <div className="flex-1 overflow-y-auto py-4">
              {filteredLinks.map((navbarLink, index) => (
                <nav key={index} className="px-3">
                  {navbarLink.links?.map((link) => (
                    <NavigationItem
                      key={link.label}
                      link={link}
                      pathname={pathname}
                      isCollapsed={isCollapsed}
                      hoveredItem={hoveredItem}
                      setHoveredItem={setHoveredItem}
                      openDropdowns={openDropdowns}
                      handleDropdownToggle={toggleDropdown}
                      hasPermissionForLink={hasPermissionForLink}
                      tabLink={createTabLink}
                      handleLinkClick={handleLinkClick}
                      router={router}
                    />
                  ))}
                </nav>
              ))}
            </div>

            {/* <div className="border-t border-gray-100 p-4">
              <LogoutButton onClick={toggleSidebar} isCollapsed={isCollapsed} />
            </div> */}
          </div>
        </motion.aside>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 20px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
          }
        `}</style>
      </>
    );
  }
);

Sidebar.displayName = "Sidebar";