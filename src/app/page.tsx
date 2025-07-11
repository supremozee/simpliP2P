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
  const { orgName } = useStore();
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
    
          if (orgName) {
            router.push(`/${orgName}/dashboard`);
          } else {
            router.push("/create-organization");
        }
      } catch (error) {
        console.error("Error processing organization data:", error);
        router.push("/login");
      }
    };

    routeAuthenticatedUser();
  }, [authChecked, isLoading, user, router, orgName]);

  return (
    <>
    <Head>
       <title>simplip2p | dashboard</title>
    </Head>
      <FullScreenLoader />
    </>
  );
}