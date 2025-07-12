import PurchaseRequisitionsPage from "@/components/pages/PurchaseRequisitionsPage";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return <PurchaseRequisitionsPage searchParams={searchParams} />;
};

export default page;
