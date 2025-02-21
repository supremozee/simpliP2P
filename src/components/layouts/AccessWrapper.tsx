"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import isAuthenticated from "@/hooks/isAuthenticated";
import useGetUser from "@/hooks/useGetUser";
import Loader from "../molecules/Loader";
import useStore from "@/store";
import ErrorComponent from "../molecules/ErrorComponent";
import useisOrgCreator from "@/hooks/useIsOrgCreator";

const AccessWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isLoading, error } = useGetUser();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setOrganizationByAdmin, setOrganizationByUser } = useStore();
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false);
  const {isOrgCreator} = useisOrgCreator()
  useEffect(() => {
    const checkAccess = async () => {
      const accessStatus = isAuthenticated();
      if (!accessStatus || error) {
        setErrorMessage(error?.message || "Session expired... redirecting to login .");
        setShowError(true);
          router.push("/login");
        return;
      }

      const isCreactor = user?.data?.user_organisations?.find(o => o.is_creator);
      const isUser = user?.data?.user_organisations?.filter(o => !o.is_creator);

      if (isOrgCreator() && isCreactor?.is_creator === true) {
        setOrganizationByAdmin(isCreactor);
      } else if (isUser && isUser.length > 0) {
        setOrganizationByUser(isUser);
      }

      setHasCheckedAccess(true);
    };

    if (user && !hasCheckedAccess) {
      checkAccess();
    }
  }, [isOrgCreator, error, router, setOrganizationByAdmin, setOrganizationByUser, user, hasCheckedAccess]);

  if (isLoading || !user || !hasCheckedAccess) {
    return <Loader />;
  }

  if (showError) {
    return <ErrorComponent text={errorMessage} />;
  }

  return <>{children}</>;
};

export default AccessWrapper;