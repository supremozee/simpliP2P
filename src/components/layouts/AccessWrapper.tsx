"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import isAuthenticated from "@/hooks/isAuthenticated";
import useGetUser from "@/hooks/useGetUser";
import Loader from "../molecules/Loader";
import ErrorComponent from "../molecules/ErrorComponent";
import useAuthHandler from "@/hooks/useAuthHandler";

const AccessWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, error } = useGetUser();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false);

  useAuthHandler();

  useEffect(() => {
    const checkAccess = async () => {
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
        if (user?.data?.user_organisations.length === 0  && !pathname.includes('create-organization')) {
          setTimeout(()=> {
            alert("You have no organisation, you will be redirected to create one!")
            router.push("/create-organization");
          }, 1000)
          return;
      } 
      setHasCheckedAccess(true);
    };

    if (!isLoading && user && !hasCheckedAccess) {
      checkAccess();
    }
  }, [isLoading, error, router, user, hasCheckedAccess, pathname]);

  if (isLoading || !user || !hasCheckedAccess) {
    return <Loader />;
  }

  if (showError) {
    return <ErrorComponent text={errorMessage} />;
  }

  return <>{children}</>;
};

export default AccessWrapper;