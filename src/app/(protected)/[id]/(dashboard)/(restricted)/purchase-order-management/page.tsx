import PurchaseOrdersManagement from "@/components/pages/PurchaseOrderManagement";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  return <PurchaseOrdersManagement searchParams={searchParams} />;
};

export default page;
