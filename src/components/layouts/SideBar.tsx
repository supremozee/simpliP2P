import { forwardRef, useEffect, useState } from "react";
import { navbarLinks } from "@/constants";
import { cn } from "@/utils/cn";
import Logo from "../atoms/Logo";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Profile from "../atoms/Profile";
import LogoutButton from "../molecules/LogoutButton";
import Link from "next/link";
import useStore from "@/store";
import { RiArrowDownSLine, RiCloseFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import useUserPermissions from "@/hooks/useUserPermissions";
import Button from "../atoms/Button";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(({ isOpen, toggleSidebar, isCollapsed, setIsCollapsed }, ref) => {
  const isPathname = usePathname().split('/').pop();
  const [openDropdowns, setOpenDropDowns] = useState<{[key:string]:boolean}>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { hasAccess } = useUserPermissions();
  const pathname = `/${isPathname}`;
  const {setOnToggle, orgName} = useStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  const toggleCollapse = () => {
    setOnToggle(!isCollapsed);
    setIsCollapsed(!isCollapsed);
  };

  const handleDropdownToggle = (label: string) => {
    setOpenDropDowns((prev) => ({...prev, [label]: !prev[label] }));
  };

  const tabLink = (path?: string) => {
    return `/${orgName}${path}`;
  };

  const handleLinkClick = () => {
    if (!isDesktop) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    if (isOpen && !isDesktop) {
      setIsCollapsed(false);
    }
  }, [isOpen, isDesktop, setIsCollapsed]);

  const hasPermissionForLink = (link: NavLink) => {
    const path = link.path || '';
    return hasAccess(path);
  };

  const filteredLinks = navbarLinks
    .map(navbarLink => ({
      ...navbarLink,
      links: navbarLink.links?.filter(link => hasPermissionForLink(link))
    }))
    .filter(navbarLink => navbarLink.links && navbarLink.links.length > 0);

  return (
    <>
      <motion.aside
        ref={ref}
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 250,
          transition: { duration: 0.3 }
        }}
        className={cn(
          "drop-shadow-lg shadow-inner sm:flex hidden flex-col bg-white overflow-x-hidden custom-scrollbar",
          "fixed left-0 top-0 h-screen z-40",
          !isDesktop && (isOpen ? "translate-x-0 flex max-w-[270px] h-screen pt-10 pl-5" : "-translate-x-full"),
          "transition-all duration-300 ease-in-out"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header Section */}
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
                      <Link href={'/'} className="flex items-center gap-2">
                        <Logo />
                        <span className="text-xl font-bold text-gray-800">simpliP2P</span>
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

          {/* Navigation Section */}
          <div className="flex-1 overflow-y-auto py-4">
            {filteredLinks.map((navbarLink, index) => (
              <nav key={index} className="px-3">
                {navbarLink.links?.map((link) => (
                  <div 
                    key={link.label} 
                    className="mb-2"
                    onMouseEnter={() => setHoveredItem(link.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Button
                      type="button"
                      className={cn(
                        "w-full bg-white flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left",
                        "hover:bg-gray-50/80",
                        pathname === link.path && "bg-primary/10 text-primary/90",
                        "group"
                      )}
                      onClick={() => {
                        if (link.subLinks) {
                          handleDropdownToggle(link.label);
                        } else {
                          router.push(tabLink(link.path));
                          handleLinkClick();
                        }
                      }}
                    >
                      <link.icon size={20} className={cn(
                        "text-gray-500 flex-shrink-0 group-hover:text-primary/80",
                        pathname === link.path && "text-primary/80"
                      )} />
                      
                      <AnimatePresence>
                        {(!isCollapsed || hoveredItem === link.label) && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className={cn(
                              "flex-1 text-sm font-medium whitespace-nowrap text-left",
                              pathname === link.path ? "text-primary/90" : "text-gray-700",
                              "group-hover:text-primary/80"
                            )}
                          >
                            {link.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {link.subLinks && !isCollapsed && (
                        <motion.div
                          animate={{ rotate: openDropdowns[link.label] ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-shrink-0"
                        >
                          <RiArrowDownSLine size={20} className="text-gray-400 group-hover:text-primary/60" />
                        </motion.div>
                      )}
                    </Button>

                    <AnimatePresence>
                      {link.subLinks && openDropdowns[link.label] && !isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-9 mt-1 space-y-1"
                        >
                          {link.subLinks.filter(subLink => hasPermissionForLink(subLink)).map((subLink) => (
                            <Link
                              key={subLink.label}
                              href={tabLink(subLink.path)}
                              onClick={handleLinkClick}
                              className={cn(
                                "block px-3 py-2 text-sm rounded-md transition-colors text-left",
                                "text-gray-600 hover:text-primary/90 hover:bg-primary/5",
                                pathname === subLink.path && "text-primary/90 bg-primary/5"
                              )}
                            >
                              {subLink.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            ))}
          </div>

          {/* Footer Section */}
          <div className="border-t border-gray-100 p-4">
            <LogoutButton onClick={toggleSidebar} isCollapsed={isCollapsed} />
          </div>
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
});

Sidebar.displayName = "Sidebar";