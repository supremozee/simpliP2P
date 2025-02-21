"use client";
import OnBoarding from "@/components/pages/OnBoarding";
import isAuthenticated from "@/hooks/isAuthenticated";
import useStore from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FullScreenLoader from "../organisms/FullScreenLoader";

export default function OnBoardingProcess() {
  const router = useRouter();
  const { orgName } = useStore();
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push(`/${orgName}/dashboard`);
    } setTimeout(()=> {
      setIsLoading(false);
    }, 3000);
  }, [router, orgName]);

  if (loading) return <FullScreenLoader />;

  return (
    <div className="">
      <main className="text-tertiary font-bold text-xl">
        <OnBoarding />
      </main>
    </div>
  );
}