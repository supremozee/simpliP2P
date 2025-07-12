import { useQuery } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";
import { FetchSuppliersResponse } from "@/types";

const useFetchSuppliers = (orgId: string, page?: number, pageSize?: number) => {
  return useQuery<FetchSuppliersResponse, Error>({
    queryKey: ["fetchSuppliers", orgId, page, pageSize],
    queryFn: () => auth.fetchSuppliers(orgId, page, pageSize),
    enabled: !!orgId,
    refetchOnWindowFocus: false,
  });
};

export default useFetchSuppliers;
