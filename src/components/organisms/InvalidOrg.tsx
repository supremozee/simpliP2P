"use client";
import useGetUser from "@/hooks/useGetUser";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const InvalidOrg = () => {
  const pathname = usePathname();
  const orgId = pathname.split("/")[1];
  const { user } = useGetUser();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-primary text-center mb-8">
        Oops! {orgId} doesn&apos;t exist. click below to see all your
        organization
      </p>
      <Link
        href={`/${user?.data?.id}`}
        className="px-6 py-3 bg-primary text-white rounded-md text-lg transition duration-300"
      >
        Select Organization
      </Link>
    </div>
  );
};

export default InvalidOrg;
