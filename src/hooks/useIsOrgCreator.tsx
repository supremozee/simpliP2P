"use client";
import useGetUser from '@/hooks/useGetUser';
import useStore from '@/store';

const useIsOrgCreator = ()=> {
  const { user } = useGetUser();
  const { currentOrg } = useStore.getState();
  const isOrgCreator = ()=> {
    const findCreator = user?.data?.user_organisations?.find((org) => org.org_id === currentOrg);
    const isOrgCreator = findCreator?.is_creator === true;
    return isOrgCreator;
  }
  return  { isOrgCreator };
}

export default useIsOrgCreator;