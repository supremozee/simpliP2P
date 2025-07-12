import { auth } from "@/helpers/auths";
import useStore from "@/store";
import { FetchItemByIdResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useFetchItemById = (id: string) => {
  const { currentOrg } = useStore();
  return useQuery<FetchItemByIdResponse, Error>({
    queryKey: ["fetchItemById", currentOrg, id],
    queryFn: () => auth.fetchAllItemById(currentOrg, id),
    enabled: !!currentOrg && !!id,
    refetchOnWindowFocus: false,
  });
};

export default useFetchItemById;
