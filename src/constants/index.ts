import { BiSolidPurchaseTag } from "react-icons/bi";
import { IoIosHome, IoIosNotifications, IoMdHelp } from "react-icons/io";
import { MdInventory, MdOutlineDeliveryDining, MdOutlineMultilineChart } from "react-icons/md";
import { RiAdminLine, RiFileList3Line } from "react-icons/ri";
import { AiOutlineAudit } from "react-icons/ai";
export const currencies = [
  { id: "NGN", name: "NGN - Nigerian Naira" },
  { id: "USD", name: "USD - US Dollar" },
  { id: "EUR", name: "EUR - Euro" },
  { id: "GBP", name: "GBP - British Pound" },
  { id: "JPY", name: "JPY - Japanese Yen" },
  { id: "GHS", name: "GHS - Ghanaian Cedi" },
  { id: "KES", name: "KES - Kenyan Shilling" },
  { id: "ZAR", name: "ZAR - South African Rand" },
  { id: "AED", name: "AED - UAE Dirham" },
  { id: "CNY", name: "CNY - Chinese Yuan" },
  { id: "INR", name: "INR - Indian Rupee" },
  { id: "BRL", name: "BRL - Brazilian Real" }
];
export const paymentTermOptions = [
  { id: "Payment in Advance", name: "Payment in Advance" },
  { id: "Cash on Delivery", name: "Cash on Delivery" },
  { id: "Line of Credit", name: "Line of Credit" },
  { id: "Payment Immediately", name: "Payment Immediately" },
  { id: "15 days payment after invoice", name: "15 days payment after invoice" },
  { id: "30 days payment after invoice", name: "30 days payment after invoice" },
  { id: "45 days payment after invoice", name: "45 days payment after invoice" },
  { id: "60 days payment after invoice", name: "60 days payment after invoice" },
  { id: "90 days payment after invoice", name: "90 days payment after invoice" },
  { id: "120 days payment after invoice", name: "120 days payment after invoice" }
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
