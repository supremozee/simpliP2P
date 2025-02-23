"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import isAuthenticated from "@/hooks/isAuthenticated";
import useGetUser from "@/hooks/useGetUser";
import Loader from "../molecules/Loader";
import useStore from "@/store";
import ErrorComponent from "../molecules/ErrorComponent";

const AccessWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isLoading, error } = useGetUser();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setOrganizationByAdmin, setOrganizationByUser } = useStore();
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const accessStatus = isAuthenticated();
      if (!accessStatus || error) {
        setErrorMessage(error?.message || "Session expired... redirecting to login.");
        setShowError(true);
        router.push("/login");
        return;
      }

      if (user?.data?.user_organisations) {
        // Filter organizations based on creator status
        const adminOrgs = user.data.user_organisations.filter(org => org.is_creator === true);
        const memberOrgs = user.data.user_organisations.filter(org => org.is_creator === false);

        // Set organizations in store
        setOrganizationByAdmin(adminOrgs);
        setOrganizationByUser(memberOrgs);
      } else {
        // Set empty arrays if no organizations exist
        setOrganizationByAdmin([]);
        setOrganizationByUser([]);
      }

      setHasCheckedAccess(true);
    };

    if (user && !hasCheckedAccess) {
      checkAccess();
    }
  }, [error, router, setOrganizationByAdmin, setOrganizationByUser, user, hasCheckedAccess]);

  if (isLoading || !user || !hasCheckedAccess) {
    return <Loader />;
  }

  if (showError) {
    return <ErrorComponent text={errorMessage} />;
  }

  return <>{children}</>;
};

export default AccessWrapper;