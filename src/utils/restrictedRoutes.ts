// Define routes that require specific permissions
export const restrictedRoutes = [
  // User/Admin Management Routes (manage_users)
  "/settings",
  "/audit-logs",

  // Supplier Management Routes (manage_suppliers)
  "/suppliers",
  "/suppliers/suppliers-management",
  "/approvals/vendor-onboarding",

  // Purchase Management Routes (manage_purchase)
  "/purchase-requisitions",
  "/purchase-order-management",
  "/purchase-orders/track",
  "/approval/requisition-approval",
  "/approval/order-approval",

  // Inventory Management Routes (manage_inventory)
  "/inventory/inventory-management",
  "/inventory/request",
  "/approvals/inventory",

  // Budget Management Routes (manage_budget)
  "/budgets-central",
  "/approvals/budget"
];

// Map routes to required permissions
export const routePermissionMap = {
  // User/Admin Management
  '/settings': ['isCreator'], // Special case: only for creators
  '/audit-logs': ['manage_users', 'all_permissions'],

  // Supplier Management
  '/suppliers': ['manage_suppliers', 'all_permissions'],
  '/suppliers/suppliers-management': ['manage_suppliers', 'all_permissions'],
  '/approvals/vendor-onboarding': ['manage_suppliers', 'all_permissions'],

  // Purchase Management
  '/purchase-requisitions': ['manage_purchase', 'all_permissions'],
  '/purchase-order-management': ['manage_purchase', 'all_permissions'],
  '/purchase-orders/track': ['manage_purchase', 'all_permissions'],
  '/approval/requisition-approval': ['manage_purchase', 'all_permissions'],
  '/approval/order-approval': ['manage_purchase', 'all_permissions'],

  // Inventory Management
  '/inventory/inventory-management': ['manage_inventory', 'all_permissions'],
  '/inventory/request': ['manage_inventory', 'all_permissions'],
  '/approvals/inventory': ['manage_inventory', 'all_permissions'],

  // Budget Management
  '/budgets-central': ['manage_budget', 'all_permissions'],
  '/approvals/budget': ['manage_budget', 'all_permissions']
};