import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store';
import Cookies from 'js-cookie';
import isAuthenticated from './isAuthenticated';
import { FetchMembersResponse} from '@/types';

/**
 * Hook to handle authentication events across the application
 * Listens for auth events like session expiration and handles redirects
 * 
 * @param options Optional configuration options
 * @returns Authentication state and utilities
 */
export default function useAuthHandler(options = { redirectOnExpire: true }) {
  const router = useRouter();
  const { 
    setPr,
    setOrganizationByAdmin, 
    setOrganizationByUser,
    setMembers,
    setCurrentOrg,
    setOrgName
  } = useStore();

  const clearUserData = () => {
    const emptyPr = {
      pr_number: '',
      id: ''
    };
    
    const emptyMembers: FetchMembersResponse = {
      status: '',
      message: '',
      data: {
        organisation: {
          id: '',
          name: '',
          address: ''
        },
        users: []
      }
    };
    
    setPr(emptyPr);
    setOrganizationByAdmin([]);
    setOrganizationByUser([]);
    setMembers(emptyMembers);
    setCurrentOrg("");
    setOrgName("");
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      clearUserData();
      
      console.warn('Your session has expired. Please log in again.');
      
      if (options.redirectOnExpire) {
        router.push('/login?expired=true');
      }
    };

    const handleTokenRefresh = () => {
    };

    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    window.addEventListener('auth:tokenRefreshed', handleTokenRefresh);

    const checkAuthState = () => {
      const isValid = isAuthenticated();
      if (!isValid && options.redirectOnExpire) {
        Cookies.remove('accessToken');
        clearUserData();
        
        const pathname = window.location.pathname;
        const isAuthPath = /^\/(login|register|forgot-password|reset-password)/.test(pathname);
        
        if (!isAuthPath) {
          router.push('/login');
        }
      }
    };
    
    checkAuthState();

    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
      window.removeEventListener('auth:tokenRefreshed', handleTokenRefresh);
    };
  }, [router, options.redirectOnExpire]);

  /**
   * Check if current user is authenticated
   */
  const checkAuth = () => {
    return isAuthenticated();
  };

  /**
   * Manually trigger a logout
   */
  const logout = () => {
    Cookies.remove('accessToken');
    clearUserData();
    router.push('/login');
  };

  return {
    isAuthenticated: checkAuth,
    logout
  };
}