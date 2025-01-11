"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import isAuthenticated from "@/hooks/isAuthenticated";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth =  () => {
      const authStatus = isAuthenticated();
      if (!authStatus) {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
};

export default AuthWrapper;