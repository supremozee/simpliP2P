"use client"
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import OnBoarding from "@/components/pages/OnBoarding";
import isAuthenticated from "@/hooks/isAuthenticated";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OnBoardingProcess() {
  const router = useRouter();

  useEffect(() => {
    if(isAuthenticated()) {
      router.push('/dashboard');
      return;
    } 
  });

  return (
    <div className="">
      <main className="text-tertiary font-bold text-xl">
        <OnBoarding />
      </main>
    </div>
  );
}