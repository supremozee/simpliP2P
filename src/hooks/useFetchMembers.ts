import { useQuery } from '@tanstack/react-query';
import { auth } from '@/api/auths';
import { FetchMembersResponse } from '@/types';


const useFetchMembers = (orgId: string) => {
  const query = useQuery<FetchMembersResponse, Error>({
    queryKey: ['fetchMembers', orgId],
    queryFn: () => auth.fetchMembers(orgId),
    enabled: !!orgId,
    refetchOnWindowFocus: false
  });
  return query;
};

export default useFetchMembers;