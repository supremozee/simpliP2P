"use client"
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/atoms/Logo';
import Button from '@/components/atoms/Button';
import useStore from '@/store';
import useUserPermissions from '@/hooks/useUserPermissions';
import { IoLockClosedOutline, IoArrowBack, IoShieldCheckmark } from 'react-icons/io5';

const RestrictedAccess = () => {
  const router = useRouter();
  const { orgName } = useStore();
  const searchParams = useSearchParams();
  const { getUserPermissions } = useUserPermissions();
  const fromPath = searchParams.get('from');
  const { role, permissions, isCreator } = getUserPermissions();

  const handleGoToDashboard = () => {
    router.push(`/${orgName}/dashboard`);
  };

  const handleGoBack = () => {
    router.back();
  };

  // Helper function to make permission text more readable
  const formatPermission = (permission: string) => {
    return permission
      .replace('manage_', '')
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <div className="p-4 bg-red-50 rounded-full">
            <IoLockClosedOutline className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Access Restricted</h1>
          <p className="text-gray-600">
            You don&apos;t have the required permissions to access this page.
          </p>

          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div className="space-y-2">
              <h2 className="font-medium text-gray-700 flex items-center gap-2 justify-center">
                <IoShieldCheckmark className="w-5 h-5 text-primary" />
                Your Access Level
              </h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Role:</span> {role || 'Standard User'}</p>
                <p><span className="font-medium">Account Type:</span> {isCreator ? 'Organization Creator' : 'Organization Member'}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-medium text-gray-700 mb-2">Your Permissions:</h3>
              {permissions.length > 0 ? (
                <ul className="space-y-1">
                  {permissions.map((permission, index) => (
                    <li key={index} className="text-sm">
                      • {formatPermission(permission)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No special permissions assigned</p>
              )}
            </div>
          </div>

          {fromPath && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Attempted to access: <span className="font-mono text-primary">{decodeURIComponent(fromPath)}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoBack}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <IoArrowBack className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            onClick={handleGoToDashboard}
            className="px-6 py-2 text-white bg-primary hover:bg-primary/90 rounded-lg"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestrictedAccess;