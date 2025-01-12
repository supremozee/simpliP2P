import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import useNotify from '@/hooks/useNotify';
interface LogoutButtonProps {
    onClick?: () => void;
  }
const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
  const router = useRouter();
  const {success} = useNotify()
  const handleLogout = () => {
    Cookies.remove('simpliToken', { domain: 'localhost', path: '/' });
    Cookies.remove('simpliToken', { domain: 'simplip2p.vercel.app', path: '/' });
    success('Logged out successfully');
    router.push('/login');
    if (onClick) {
        onClick();
      }
  };

  return (
    <div className="flex gap-3 my-10 ml-1 sm:ml-5 font-roboto text-red-500 cursor-pointer items-center" onClick={handleLogout}>
      <FiLogOut />
      <p>Logout</p>
    </div>
  );
};

export default LogoutButton;