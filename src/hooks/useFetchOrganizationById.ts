import { useQuery } from '@tanstack/react-query';
import { OrganizationResponse } from '@/types';
import { auth } from '@/api/auths';

const useFetchOrganizationById = (orgId: string) => {
  return useQuery<OrganizationResponse, Error>({
    queryKey: ['organizationById', orgId],
    queryFn: () => auth.organizationById(orgId),
    enabled: !!orgId,
    refetchOnWindowFocus: false,
  });
};

export default useFetchOrganizationById;