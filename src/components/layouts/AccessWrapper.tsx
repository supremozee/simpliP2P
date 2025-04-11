"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import isAuthenticated from "@/hooks/isAuthenticated";
import useGetUser from "@/hooks/useGetUser";
import Loader from "../molecules/Loader";
import useStore from "@/store";
import ErrorComponent from "../molecules/ErrorComponent";
import useAuthHandler from "@/hooks/useAuthHandler";

/**
 * AccessWrapper - Guards protected routes and ensures user authentication
 * Also handles organization data loading and access control
 */
const AccessWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, error } = useGetUser();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setOrganizationByAdmin, setOrganizationByUser } = useStore();
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false);

  // Initialize auth handler with protection enabled
  useAuthHandler();

  useEffect(() => {
    const checkAccess = async () => {
      // Check authentication status first (fast path)
      const accessStatus = isAuthenticated();
      const returnPath = encodeURIComponent(pathname);
      if (!accessStatus) {
        setErrorMessage(error?.message || "Session expired... redirecting to login.");
        setShowError(true);
        router.push(`/login?returnTo=${returnPath}`);
        return;
      } 

      //I am coming back to this, it is giving return back issue
      // if(error) {
      //   setErrorMessage(error?.message || "An error occurred while fetching user data.");
      //   setShowError(true);
      //   router.push(`/login?returnTo=${returnPath}`);
      //   return;
      // }

      if (user?.data?.user_organisations) {
        const adminOrgs = user.data.user_organisations.filter(org => org.is_creator === true);
        const memberOrgs = user.data.user_organisations.filter(org => org.is_creator === false);

        // Set organizations in store
        setOrganizationByAdmin(adminOrgs);
        setOrganizationByUser(memberOrgs);

        // Check if user doesn't have any orgs and redirect to create org if needed
        if (adminOrgs.length === 0 && memberOrgs.length === 0 && !pathname.includes('create-organization')) {
          console.log("No organizations found for user, redirecting to create organization");
          router.push("/create-organization");
          return;
        }
      } else {
        // Set empty arrays if no organizations exist
        setOrganizationByAdmin([]);
        setOrganizationByUser([]);
      }

      setHasCheckedAccess(true);
    };

    if (!isLoading && user && !hasCheckedAccess) {
      checkAccess();
    }
  }, [isLoading, error, router, setOrganizationByAdmin, setOrganizationByUser, user, hasCheckedAccess, pathname]);

  if (isLoading || !user || !hasCheckedAccess) {
    return <Loader />;
  }

  if (showError) {
    return <ErrorComponent text={errorMessage} />;
  }

  return <>{children}</>;
};

export default AccessWrapper;