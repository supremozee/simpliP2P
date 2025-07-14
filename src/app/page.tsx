"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import isAuthenticated from "@/hooks/isAuthenticated";
import useStore from "@/store";
import useGetUser from "@/hooks/useGetUser";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useGetUser();
  const { orgName, userId } = useStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (!isLoading && user) {
      if (orgName) {
        router.push(`/${orgName}/dashboard`);
      } else {
        router.push(`${userId}`);
      }
    }
  }, [isLoading, user, router, orgName, userId]);

  return (
    <>
      <Head>
        <title>simplip2p | dashboard</title>
      </Head>
      <div />
    </>
  );
}
