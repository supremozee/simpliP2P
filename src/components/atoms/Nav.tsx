import { NavLink } from "@/types";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Button from "./Button";
import { RiArrowDownSLine } from "react-icons/ri";

/* eslint-disable @typescript-eslint/no-explicit-any */
const NavIcon = ({ 
  icon: Icon, 
  isActive, 
  className = "" 
}: { 
  icon: any; 
  isActive: boolean; 
  className?: string; 
}) => (
  <Icon
    size={20}
    className={cn(
      "text-foreground flex-shrink-0 group-hover:text-primary/80",
      isActive && "text-primary/80",
      className
    )}
  />
);

const NavLabel = ({ 
  label, 
  isActive, 
  isVisible 
}: { 
  label: string; 
  isActive: boolean; 
  isVisible: boolean; 
}) => (
  <AnimatePresence>
    {isVisible && (
      <motion.span
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "auto" }}
        exit={{ opacity: 0, width: 0 }}
        className={cn(
          "flex-1 text-sm font-medium whitespace-nowrap text-left group-hover:text-primary/80",
          isActive ? "text-primary/90" : "text-gray-800"
        )}
      >
        {label}
      </motion.span>
    )}
  </AnimatePresence>
);

const DropdownArrow = ({ 
  isOpen, 
  isCollapsed 
}: { 
  isOpen: boolean; 
  isCollapsed: boolean; 
}) => {
  if (isCollapsed) return null;
  
  return (
    <motion.div
      animate={{ rotate: isOpen ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0"
    >
      <RiArrowDownSLine size={20} className="text-gray-400 group-hover:text-primary/60" />
    </motion.div>
  );
};

const SubNavigation = ({ 
  subLinks, 
  isOpen, 
  isCollapsed, 
  hasPermissionForLink, 
  tabLink, 
  pathname, 
  handleLinkClick 
}: {
  subLinks: NavLink[];
  isOpen: boolean;
  isCollapsed: boolean;
  hasPermissionForLink: (link: NavLink) => boolean;
  tabLink: (path?: string) => string;
  pathname: string;
  handleLinkClick: () => void;
}) => (
  <AnimatePresence>
    {isOpen && !isCollapsed && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="ml-9 mt-1 space-y-1"
      >
        {subLinks
          .filter(hasPermissionForLink)
          .map((subLink) => (
            <Link
              key={subLink.label}
              href={tabLink(subLink.path)}
              onClick={handleLinkClick}
              className={cn(
                "block px-3 py-2 text-sm rounded-md transition-colors text-left",
                "text-primary hover:text-primary/90 hover:bg-primary/5",
                pathname === subLink.path && "text-primary/90 bg-primary/5"
              )}
            >
              {subLink.label}
            </Link>
          ))}
      </motion.div>
    )}
  </AnimatePresence>
);

const NavigationItem = ({ 
  link, 
  pathname, 
  isCollapsed, 
  hoveredItem, 
  setHoveredItem, 
  openDropdowns, 
  handleDropdownToggle, 
  hasPermissionForLink, 
  tabLink, 
  handleLinkClick, 
  router 
}: {
  link: NavLink;
  pathname: string;
  isCollapsed: boolean;
  hoveredItem: string | null;
  setHoveredItem: (item: string | null) => void;
  openDropdowns: { [key: string]: boolean };
  handleDropdownToggle: (label: string) => void;
  hasPermissionForLink: (link: NavLink) => boolean;
  tabLink: (path?: string) => string;
  handleLinkClick: () => void;
  router: any;
}) => {
  const isActive = pathname === link.path;
  const isHovered = hoveredItem === link.label;
  const isDropdownOpen = openDropdowns[link.label];

  const handleClick = () => {
    if (link.subLinks) {
      handleDropdownToggle(link.label);
    } else {
      router.push(tabLink(link.path));
      handleLinkClick();
    }
  };

  return (
    <div
      className="mb-2"
      onMouseEnter={() => setHoveredItem(link.label)}
      onMouseLeave={() => setHoveredItem(null)}
    >
      <Button
        type="button"
        className={cn(
          "w-full bg-white flex items-center gap-3 px-3 py-2.5 rounded-lg",
          "transition-all text-left hover:bg-tertiary group",
          isActive && "bg-primary/10 text-primary"
        )}
        onClick={handleClick}
      >
        <NavIcon icon={link.icon} isActive={isActive} />
        <NavLabel 
          label={link.label} 
          isActive={isActive} 
          isVisible={!isCollapsed || isHovered} 
        />
        <DropdownArrow isOpen={isDropdownOpen} isCollapsed={isCollapsed} />
      </Button>

      {link.subLinks && (
        <SubNavigation
          subLinks={link.subLinks}
          isOpen={isDropdownOpen}
          isCollapsed={isCollapsed}
          hasPermissionForLink={hasPermissionForLink}
          tabLink={tabLink}
          pathname={pathname}
          handleLinkClick={handleLinkClick}
        />
      )}
    </div>
  );
};
export default NavigationItem