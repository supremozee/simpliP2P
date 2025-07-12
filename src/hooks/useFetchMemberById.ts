import { useQuery } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";
import { FetchMemberByIdResponse } from "@/types";

const useFetchMemberById = (orgId: string, memberId: string) => {
  return useQuery<FetchMemberByIdResponse, Error>({
    queryKey: ["fetchMembers", orgId, memberId],
    queryFn: () => auth.fetchMemberById(orgId, memberId),
    enabled: !!orgId && !!memberId,
    refetchOnWindowFocus: false,
  });
};

export default useFetchMemberById;
