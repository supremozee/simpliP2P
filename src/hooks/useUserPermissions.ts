import { Permission } from '@/types';
import useGetUser from './useGetUser';
import useStore from '@/store';


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

  const checkPermission = (requiredPermissions: Permission[]) => {
    const { isCreator, permissions, hasAllPermissions } = getUserPermissions();
    return isCreator || hasAllPermissions || requiredPermissions.some(permission => permissions.includes(permission));
  };


  const hasAccess = (path: string) => {
    if (PUBLIC_ROUTES.some(route => path.startsWith(route))) {
      return true;
    }
    const { isCreator, permissions } = getUserPermissions();
    if (path.startsWith('/settings')) {
      return isCreator;
    }
    
    const routePermissions: Record<string, Permission[]> = {
      '/audit-logs': ['all_permissions'],
      '/suppliers': ['manage_suppliers', 'create_suppliers', 'get_suppliers', 'update_suppliers', 'delete_suppliers'],
      '/suppliers/suppliers-management': ['manage_suppliers', 'create_suppliers', 'update_suppliers'],
      '/approvals/vendor-onboarding': ['manage_suppliers'],
      '/purchase-requisitions': ['manage_purchase_requisitions', 'get_purchase_requisitions'],
      '/purchase-order-management': ['manage_purchase_orders'],
      '/approval/requisition-approval': ['manage_purchase_requisitions'],
      '/approval/order-approval': ['manage_purchase_orders'],
      '/inventory/inventory-management': ['manage_products'],
      '/inventory/request': ['manage_products'],
      '/approvals/inventory': ['manage_products'],
      '/budgets-central': ['manage_budgets'],
      '/approvals/budget': ['manage_budgets']
    };
    const matchingRoute = Object.entries(routePermissions)
      .find(([route]) => path.startsWith(route));
    if (!matchingRoute) return true; 
    const [, requiredPermissions] = matchingRoute;

    return isCreator || 
           requiredPermissions.some(perm => permissions.includes(perm));
  };

  return {
    getUserPermissions,
    checkPermission,
    hasAccess,
  };
};

export default useUserPermissions; 