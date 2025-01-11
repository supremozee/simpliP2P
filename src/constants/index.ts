import { BiSolidPurchaseTag } from "react-icons/bi";
import { GrAnalytics } from "react-icons/gr";
import { IoIosHome, IoIosNotifications, IoMdHelp } from "react-icons/io";
import { MdInventory, MdOutlineDeliveryDining, MdOutlineMultilineChart } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";

export const navbarLinks = [
    {
        links: [
            {
                label: "Dashboard",
                icon:IoIosHome,
                path: "dashboard",
            },
            {
                label: "Supplier Management",
                icon: MdOutlineDeliveryDining,
                path: "analytics",
            },
            {
                label: "Purchase Requisition",
                icon: BiSolidPurchaseTag,
                path: "reports",
            },
            {
                label: "Purchase Order Management",
                icon: BiSolidPurchaseTag,
                path: "reports",
            }, {
                label: "Inventory Management",
                icon: MdInventory,
                path: "reports",
            }, {
                label: "Budget Tracking",
                icon: MdOutlineMultilineChart,
                path: "reports",
            }, {
                label: "Reporting Analytics",
                icon: GrAnalytics,
                path: "reports",
            },{
                label: "Admin Settings",
                icon: RiAdminLine,
                path: "reports",
            },
        ],
    },
    {
        footer: [
            {
                label: "Notifications",
                icon: IoIosNotifications,
                path: "about",
            },
            {
                label: "Help and Support",
                icon: IoMdHelp,
                path: "help",
            },
        ],
    }
];