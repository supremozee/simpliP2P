import { forwardRef } from "react";
import { navbarLinks } from "@/constants";
import { cn } from "@/utils/cn";
import Link from "next/link";
import Logo from "../atoms/Logo";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Profile from "../atoms/Profile";
import { RiCloseFill } from "react-icons/ri";
import LogoutButton from "../molecules/LogoutButton";

interface SidebarProps {
  collapsed: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(({ collapsed, isOpen, toggleSidebar }, ref) => {
  const pathname = usePathname().split('/').pop();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleLinkClick = () => {
    if (!isDesktop) {
      toggleSidebar();
    }
  };
  return (
    <>
      <aside
        ref={ref}
        className={cn(
          "drop-shadow-lg shadow-inner z-[100] sm:flex hidden min-h-screen w-[290px] flex-col bg-white overflow-x-hidden transition-transform duration-300",
          !isDesktop && (isOpen ? "translate-x-0 flex w-[270px] min-h-screen pt-10 px-5  " : "-translate-x-full")
        )}
      >
         { isDesktop ? <div className="sm:flex hidden gap-2 justify-center px-[2%] pt-[12%] pb-[24%]">
            <Logo />
            <p className="text-black text-[25px] font-bricolage font-bold">
              simpliP2P
            </p>
          </div>: (
            <div className="flex justify-between w-full mb-10">
               <RiCloseFill size={22} onClick={toggleSidebar} />
               <Profile/>
            </div>
          )}
        <div className="overflow-x-hidden sm:p-3 [scrollbar-width:_thin]">
          {navbarLinks.map((navbarLink, index) => (
            <nav
              key={index}
              className={cn("flex flex-col gap-5 justify-center", collapsed && "md:items-center")}
            >
              {navbarLink.links && (
                <>
                  {navbarLink.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.path}
                      onClick={handleLinkClick}
                      className={cn("flex items-center gap-2",
                        pathname === link.path && "text-primary"
                      )}
                    >
                      <link.icon size={18} className="flex-shrink-0" />
                      <p className={cn(
                        "font-roboto font-[500] text-[#A3AED0] text-[14px]",
                        pathname === link.path && "text-primary font-bold"
                      )}>{link.label}</p>
                    </Link>
                  ))}
                </>
              )}
            </nav>
          ))}
        </div>
        <div className="mt-auto sm:p-3">
          {navbarLinks
            .filter((navbarLink) => navbarLink.footer)
            .map((navbarLink, index) => (
              <nav
                key={index}
                className={cn("flex flex-col gap-5", collapsed && "md:items-center")}
              >
                {navbarLink.footer && navbarLink.footer.map((link) => (
                  <Link
                    key={link.label}
                    href={link.path}
                    onClick={handleLinkClick}
                    className={cn("flex items-center gap-2",
                      collapsed && "md:w-[45px]",
                      pathname === link.path && "text-primary"
                    )}
                  >
                    <link.icon size={18} className="flex-shrink-0" />
                    <p className={cn(
                      "font-roboto font-[500] text-[#A3AED0] text-[13px]",
                      pathname === link.path && "text-primary font-bold"
                    )}>{link.label}</p>
                  </Link>
                ))}
              </nav>
            ))}
        </div>
        <LogoutButton onClick={handleLinkClick} />
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";