"use client";
import React, { useEffect, useState } from 'react';
import useGetUser from "@/hooks/useGetUser";
import useNotify from "@/hooks/useNotify";
import { usePathname, useRouter } from 'next/navigation';
import { sanitize } from '@/utils/helpers';
import useStore from '@/store';

interface CheckIdValidityProps {
  children: React.ReactNode;
}

const CheckIdValidity: React.FC<CheckIdValidityProps> = ({ children }) => {
  const { user } = useGetUser();
  const pathname = usePathname();
  const orgName = pathname.split('/')[1];
  const { error } = useNotify();
  const router = useRouter();
  const [isValid, setIsValid] = useState<boolean>(false);
  const {userId} = useStore()
  useEffect(() => {
    const checkValidity = async () => {
      if (!user) {
        error("User details not available");
        setIsValid(false);
        router.push('/login');
        return;
      }

      const findValidName = user.data.user_organisations?.find((org) => sanitize(org.name) === orgName);
      const sanitizedOrgName = sanitize(findValidName?.name || "")
      const isValidName = sanitizedOrgName === orgName;
        if (!userId) {
          router.replace(`${orgName}/invalid-org`);
          return;
        }
        if (!isValidName) {
          setIsValid(false);
          router.push(`/${userId}`);
          return;
        }

      setIsValid(true);
    };

    checkValidity();
  }, [user, orgName, error, router, userId]); 

  return isValid ? <>{children}</> : null;
};

export default CheckIdValidity;