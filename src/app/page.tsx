"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import isAuthenticated from "@/hooks/isAuthenticated";
import useStore from "@/store";
import useGetUser from "@/hooks/useGetUser";
import FullScreenLoader from "@/components/organisms/FullScreenLoader";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useGetUser();
  const { orgName, currentOrg, setOrganizationByAdmin, setOrganizationByUser } = useStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  useEffect(() => {
    if (!authChecked || isLoading || !user) return;

    const routeAuthenticatedUser = async () => {
      try {
        if (user?.data?.user_organisations) {
          const adminOrgs = user.data.user_organisations.filter(org => org.is_creator === true);
          const memberOrgs = user.data.user_organisations.filter(org => org.is_creator === false);
          
          setOrganizationByAdmin(adminOrgs);
          setOrganizationByUser(memberOrgs);

          const targetOrg = orgName || (currentOrg || adminOrgs[0]?.org_id || memberOrgs[0]?.org_id);
          if (targetOrg) {
            router.push(`/${targetOrg}/dashboard`);
          } else {
            router.push("/create-organization");
          }
        }
      } catch (error) {
        console.error("Error processing organization data:", error);
        router.push("/login");
      }
    };

    routeAuthenticatedUser();
  }, [authChecked, isLoading, user, router, orgName, currentOrg, setOrganizationByAdmin, setOrganizationByUser]);

  return (
    <>
    <Head>
       <title>simplip2p | dashboard</title>
    </Head>
      <FullScreenLoader />
    </>
  );
}