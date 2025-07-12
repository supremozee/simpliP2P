import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store";
import { FetchMembersResponse } from "@/types";
import { useCallback } from "react";
import useNotify from "./useNotify";
/**
 * Hook to handle authentication events across the application
 * Listens for auth events like session expiration and handles redirects
 *
 * @param options Optional configuration options
 * @returns Authentication state and utilities
 */
export default function useAuthHandler(options = { redirectOnExpire: true }) {
  const router = useRouter();
  const { error } = useNotify();
  const { setPr, setMembers, setCurrentOrg, setOrgName } = useStore();

  const clearUserData = useCallback(() => {
    const emptyPr = {
      pr_number: "",
      id: "",
    };

    const emptyMembers: FetchMembersResponse = {
      status: "",
      message: "",
      data: {
        organisation: {
          id: "",
          name: "",
          address: "",
        },
        users: [],
      },
    };

    setPr(emptyPr);
    setMembers(emptyMembers);
    setCurrentOrg("");
    setOrgName("");
  }, [setPr, setMembers, setCurrentOrg, setOrgName]);
  useEffect(() => {
    const handleSessionExpired = () => {
      // clearUserData();
      if (options.redirectOnExpire) {
       error("Your session has expired. Please log in again.");
        router.push("/login?expired=true");
      }
    };
    window.addEventListener("auth:sessionExpired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:sessionExpired", handleSessionExpired);
    };
  }, [router, options.redirectOnExpire, clearUserData, error]);

  return {
    clearUserData,
  };
}
