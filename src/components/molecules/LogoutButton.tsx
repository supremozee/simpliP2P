import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { cn } from '@/utils/cn';
import useLogout from '@/hooks/useLogout';
import useNotify from '@/hooks/useNotify';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  onClick?: () => void;
  isCollapsed?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick, isCollapsed }) => {
  const { logout } = useLogout();
  const { error: showError } = useNotify();
  const router = useRouter();

  const handleLogout = async() => {
    try {
      const refreshToken = Cookies.get('refreshToken');
      
      if (!refreshToken) {
        showError('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      await logout({ refresh_token: refreshToken });
      
      // Clear all auth-related cookies
      Cookies.remove('refreshToken');
      Cookies.remove('accessToken');
      
      // Execute callback if provided
      if (onClick) {
        onClick();
      }

      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      showError('Failed to logout. Please try again.');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={cn(
        "w-full flex items-center gap-3 p-2 rounded-lg",
        "text-red-600 hover:bg-red-50 transition-all duration-200",
        "group focus:outline-none focus:ring-2 focus:ring-red-100",
        isCollapsed ? "justify-center" : "justify-start"
      )}
    >
      <FiLogOut className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
      {!isCollapsed && (
        <span className="text-sm font-medium">Sign Out</span>
      )}
    </button>
  );
};

export default LogoutButton;