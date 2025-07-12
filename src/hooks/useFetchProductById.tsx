"use client";
import { auth } from "@/helpers/auths";
import { ProductResponse } from "@/types";
import { useFetchData } from "@/utils/helpers";

export default function useFetchProductById(orgId: string, productId: string) {
  return useFetchData<ProductResponse>(
    ["fetchProductById", orgId, productId],
    () => auth.fetchProductById(orgId, productId),
    { enabled: !!orgId && !!productId }
  );
}
