import { auth } from "@/helpers/auths";
import { FetchAllItems } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useFetchItemsByPrNumber = (
  orgId: string,
  pr_number: string,
  pageSize?: number,
  page?: number
) => {
  return useQuery<FetchAllItems, Error>({
    queryKey: ["fetchItemsByPrNumber", orgId, pr_number],
    queryFn: () =>
      auth.fetchAllItemsByPrNumber(orgId, pr_number, page, pageSize),
    enabled: !!orgId && !!pr_number,
    refetchOnWindowFocus: false,
  });
};

export default useFetchItemsByPrNumber;
