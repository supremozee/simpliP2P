"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import useGetUser from "@/hooks/useGetUser";
import FullScreenLoader from "../organisms/FullScreenLoader";
import ErrorComponent from "../molecules/ErrorComponent";
import isAuthenticated from "@/hooks/isAuthenticated";
import useAuthHandler from "@/hooks/useAuthHandler";
import useStore from "@/store";
import { sanitize } from "@/utils/helpers";

const AccessWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useGetUser();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const { orgName, userId } = useStore();
  useAuthHandler();
  const handleOrganizationCheck = useCallback(async () => {
    if (isLoading || hasAccess) return;
    if (!isAuthenticated()) {
      router.replace("/login");
    }
    if (!user) {
      setErrorMessage("Failed to load user data. Please try again.");
      setShowError(true);
      return;
    }

    const userOrgs = user?.data.user_organisations || [];
    const findOrgName = user?.data?.user_organisations.find(
      (org) => sanitize(org.name) === orgName
    );
    if (!findOrgName) {
      router.replace(`/${userId}`);
    }
    if (userOrgs.length === 0 && !pathname.includes("create-organization")) {
      router.replace("/create-organization");
      return;
    }

    setHasAccess(true);
  }, [isLoading, hasAccess, user, pathname, router, orgName, userId]);

  useEffect(() => {
    handleOrganizationCheck();
  }, [handleOrganizationCheck]);

  if (isLoading || (!hasAccess && !showError)) {
    return <FullScreenLoader />;
  }

  if (showError) {
    return (
      <ErrorComponent
        text={errorMessage}
        error={showError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return <>{children}</>;
};

export default AccessWrapper;
