import { BiSolidPurchaseTag } from "react-icons/bi";
import { IoIosHome, IoIosNotifications, IoMdHelp } from "react-icons/io";
import { MdInventory, MdOutlineDeliveryDining, MdOutlineMultilineChart } from "react-icons/md";
import { RiAdminLine, RiFileList3Line } from "react-icons/ri";
import { AiOutlineAudit } from "react-icons/ai";
export const currencies = [
  { id: "USD", name: "USD - US Dollar" },
  { id: "EUR", name: "EUR - Euro" },
  { id: "GBP", name: "GBP - British Pound" },
  { id: "JPY", name: "JPY - Japanese Yen" },
  { id: "NGN", name: "NGN - Nigerian Naira" },
  { id: "GHS", name: "GHS - Ghanaian Cedi" },
  { id: "KES", name: "KES - Kenyan Shilling" },
  { id: "ZAR", name: "ZAR - South African Rand" },
  { id: "AED", name: "AED - UAE Dirham" },
  { id: "CNY", name: "CNY - Chinese Yuan" },
  { id: "INR", name: "INR - Indian Rupee" },
  { id: "BRL", name: "BRL - Brazilian Real" }
];

export const navbarLinks = [
  {
    links: [
      {
        label: "Dashboard",
        icon: IoIosHome,
        path: "/dashboard",
      },
      {
        label: "Suppliers",
        icon: MdOutlineDeliveryDining,
        subLinks: [
          { label: "Suppliers Management", path: "/suppliers/suppliers-management" },
        ],
      },
      {
        label: "Requisitions",
        icon: BiSolidPurchaseTag,
        path: "/purchase-requisitions",
      },
      {
        label: "Purchase Orders",
        icon: BiSolidPurchaseTag,
        subLinks: [
          { label: "Manage Order", path: "/purchase-order-management" },
        ],
      },
      {
        label: "Inventory ",
        icon: MdInventory,
        subLinks: [
          { label: "Manage Inventory", path: "/inventory/inventory-management" },
        ],
      },
      {
        label: "Approvals",
        icon: RiFileList3Line,
        subLinks: [
          { label: "Requisition", path: "/approval/requisition-approval" },
          { label: "Order", path: "/approval/order-approval" },
        ],
      },
      {
        label: "Budgets",
        icon: MdOutlineMultilineChart,
        subLinks: [
          { label: "Budget centrals", path: "/budgets-central" },
        ],
      },
      {
        label: "Audit Logs",
        icon: AiOutlineAudit,
        path: '/audit-logs'
      },
      {
        label: "Settings",
        icon: RiAdminLine,
        path: "/settings",
      },
    ],
  },
  {
    footer: [
      {
        label: "Notifications",
        icon: IoIosNotifications,
        path: "/notifications",
      },
      {
        label: "Help and Support",
        icon: IoMdHelp,
        path: "/help",
      },
    ],
  },
];
