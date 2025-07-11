import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react'
import Logo from '../atoms/Logo';
import { RxHamburgerMenu } from 'react-icons/rx';
import { RiCloseFill } from 'react-icons/ri';
import Profile from './Profile';

const SidebarHeader = ({ 
  isDesktop, 
  isCollapsed, 
  toggleCollapse, 
  toggleSidebar 
}: {
  isDesktop: boolean;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  toggleSidebar: () => void;
}) => (
  <div className="px-4 py-2 border-b border-gray-100">
    {isDesktop ? (
      <div className="flex items-center justify-between">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Link href="/" className="flex items-center gap-2">
                <Logo />
                <span className="text-xl font-bold text-primary">simpliP2P</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RxHamburgerMenu size={20} className="text-gray-600" />
        </button>
      </div>
    ) : (
      <div className="flex justify-between items-center">
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-50">
          <RiCloseFill size={20} className="text-gray-600" />
        </button>
        <Profile />
      </div>
    )}
  </div>
)

export default SidebarHeader