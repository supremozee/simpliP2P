import { usePathname, useRouter } from 'next/navigation';
import  { useState } from 'react'
import useUserPermissions from './useUserPermissions';
import useStore from '@/store';
import { NavLink } from '@/types';
import { navbarLinks } from '@/constants';
import {useMediaQuery} from './useMediaQuery';

export const useSidebarLogic = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { hasAccess } = useUserPermissions();
  const { setOnToggle, orgName } = useStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const currentPath = `/${pathname.split("/").pop()}`;

  const toggleDropdown = (label: string) => {
    setOpenDropdowns(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const createTabLink = (path?: string) => `/${orgName}${path}`;

  const hasPermissionForLink = (link: NavLink) => {
    return hasAccess(link.path || "");
  };

  const getFilteredLinks = () => {
    return navbarLinks
      .map(navbarLink => ({
        ...navbarLink,
        links: navbarLink.links?.filter(link => {
          if (link.subLinks) {
            return link.subLinks.some(hasPermissionForLink);
          }
          return hasPermissionForLink(link);
        }),
      }))
      .filter(navbarLink => navbarLink.links && navbarLink.links.length > 0);
  };

  return {
    pathname: currentPath,
    router,
    isDesktop,
    orgName,
    openDropdowns,
    hoveredItem,
    setHoveredItem,
    toggleDropdown,
    createTabLink,
    hasPermissionForLink,
    filteredLinks: getFilteredLinks(),
    setOnToggle,
  };
};
