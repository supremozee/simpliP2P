import useGetUser from './useGetUser';
import useStore from '@/store';

export type Permission = 
  | 'manage_users' 
  | 'manage_suppliers' 
  | 'manage_purchase'
  | 'manage_inventory'
  | 'manage_budget'
  | 'all_permissions';

// Define public routes that don't require specific permissions
const PUBLIC_ROUTES = [
  '/dashboard',
  '/help',
  '/notifications'
] as const;

const useUserPermissions = () => {
  const { user } = useGetUser();
  const { currentOrg } = useStore();

  const getUserPermissions = () => {
    const userOrg = user?.data?.user_organisations?.find(
      (org) => org.org_id === currentOrg
    );

    return {
      isCreator: userOrg?.is_creator || false,
      permissions: (userOrg?.permissions || []) as Permission[],
      role: userOrg?.role || '',
      hasAllPermissions: userOrg?.permissions?.includes('all_permissions') || false
    };
  };

  const checkPermission = (requiredPermission: Permission) => {
    const { isCreator, permissions, hasAllPermissions } = getUserPermissions();
    return isCreator || hasAllPermissions || permissions.includes(requiredPermission);
  };

  const hasAccess = (path: string) => {
    // Check for public routes first
    if (PUBLIC_ROUTES.some(route => path.startsWith(route))) {
      return true;
    }

    const { isCreator, permissions } = getUserPermissions();

    // Settings is only accessible to creators
    if (path.startsWith('/settings')) {
      return isCreator;
    }
    
    // Define permission requirements for each route
    const routePermissions: Record<string, Permission[]> = {
      // User/Admin Management
      '/audit-logs': ['manage_users'],

      // Supplier Management
      '/suppliers': ['manage_suppliers'],
      '/suppliers/suppliers-management': ['manage_suppliers'],
      '/approvals/vendor-onboarding': ['manage_suppliers'],

      // Purchase Management
      '/purchase-requisitions': ['manage_users'],
      '/purchase-order-management': ['manage_users'],
      '/approval/requisition-approval': ['manage_purchase'],
      '/approval/order-approval': ['manage_users'],

      // Inventory Management
      '/inventory/inventory-management': ['manage_users'],
      '/inventory/request': ['manage_users'],
      '/approvals/inventory': ['manage_users'],

      // Budget Management
      '/budgets-central': ['manage_budget'],
      '/approvals/budget': ['manage_budget']
    };

    // Find matching route
    const matchingRoute = Object.entries(routePermissions)
      .find(([route]) => path.startsWith(route));

    if (!matchingRoute) return true; 

    const [, requiredPermissions] = matchingRoute;

    // Check permissions
    return isCreator || 
           permissions.includes('all_permissions') ||
           requiredPermissions.some(perm => permissions.includes(perm));
  };

  return {
    getUserPermissions,
    checkPermission,
    hasAccess
  };
};

export default useUserPermissions; 