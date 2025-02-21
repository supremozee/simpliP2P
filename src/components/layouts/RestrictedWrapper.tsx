"use client"
import useStore from '@/store';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import useUserPermissions from '@/hooks/useUserPermissions';
import FullScreenLoader from '../organisms/FullScreenLoader';
import isAuthenticated from '@/hooks/isAuthenticated';
import useNotify from '@/hooks/useNotify';
import { restrictedRoutes } from '@/utils/restrictedRoutes';

const RestrictedWrapper = ({children}:{children:React.ReactNode}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { orgName } = useStore();
  const { hasAccess } = useUserPermissions();
  const isAuth = isAuthenticated();
  const { error: showError } = useNotify();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      try {
        if (!isAuth) {
          if (isMounted) {
            showError('Please login to continue');
            router.push('/login');
          }
          return;
        }

        const path = pathname.replace(`/${orgName}`, '');
        
        const isRestrictedRoute = restrictedRoutes.some(route => path.startsWith(route));
        
        if (!isRestrictedRoute) {
          if (isMounted) {
            setIsAuthorized(true);
            setIsLoading(false);
          }
          return;
        }

        // Check permissions for restricted routes
        const canAccess = hasAccess(path);

        if (isMounted) {
          if (!canAccess) {
            showError('You do not have permission to access this page');
            router.push(`/${orgName}/restricted-access?from=${encodeURIComponent(pathname)}`);
            return;
          } else {
            setIsAuthorized(true);
          }
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setIsLoading(false);
          const errorMessage = err instanceof Error ? err.message : 'An error occurred while checking permissions';
          showError(errorMessage);
        }
      }
    };

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [orgName, pathname, router, isAuth, hasAccess, showError]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!isAuthorized) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
};

export default RestrictedWrapper;