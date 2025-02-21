import Image from 'next/image';
import  { forwardRef } from 'react'
import { CgMenuLeft } from 'react-icons/cg';
import Notifications from '../atoms/Notifications';

interface MobileHeaderProps {
collapsed: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}
const MobileHeader = forwardRef<HTMLElement, MobileHeaderProps>(({collapsed, isOpen, toggleSidebar}, ref)=> {
    
   return (
    collapsed && !isOpen&&( <header className='flex w-full bg-[#808080] bg-opacity-15 fixed top-0 font-roboto justify-between items-center px-5 py-4 z-50 cursor-pointer' ref={ref}>
        <CgMenuLeft size={22} onClick={toggleSidebar} />
            <Image
            src={'/mobile-header-logo.png'}
            alt='Logo'
            width={153}
            height={30}
            />
        <Notifications/>
    </header>
    )
   )
})

MobileHeader.displayName = 'Mobile Header'
export default MobileHeader
