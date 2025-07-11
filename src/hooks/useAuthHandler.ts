import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store';
import Cookies from 'js-cookie';
import isAuthenticated from './isAuthenticated';
import { FetchMembersResponse} from '@/types';
  import { useCallback } from 'react';
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
    setMembers,
    setCurrentOrg,
    setOrgName
  } = useStore();


  const clearUserData = useCallback(() => {
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
    setMembers(emptyMembers);
    setCurrentOrg("");
    setOrgName("");
  }, [setPr, setMembers, setCurrentOrg, setOrgName]);

  useEffect(() => {
    const handleSessionExpired = () => {
      clearUserData();
      console.warn('Your session has expired. Please log in again.');
      if (options.redirectOnExpire) {
        router.push('/login?expired=true');
      }
    };


    window.addEventListener('auth:sessionExpired', handleSessionExpired);
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
    };
  }, [router, options.redirectOnExpire, clearUserData]);

  const checkAuth = () => {
    return isAuthenticated();
  };
  const logout = () => {
    Cookies.remove('accessToken');
    clearUserData();
    router.push('/login');
  };

  return {
    isAuthenticated: checkAuth,
    logout,
    clearUserData
  };
}