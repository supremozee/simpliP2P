import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/api/auths';
import { Organization } from '@/types';
import useStore from '@/store';
import useNotify from './useNotify';

const useUpdateOrganization = (orgId: string) => {
  const queryClient = useQueryClient();
  const { setLoading, setOrgName } = useStore();
  const { success, error: notifyError } = useNotify();

  const { mutateAsync: updateOrganizationMutation } = useMutation({
    onMutate: () => {
      setLoading(true);
    },
    mutationFn: async (data: Organization) => {
      return await auth.updateOrganization(orgId, data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (response: any) => {
      setLoading(false);
      setOrgName(response?.data?.name);
      success(response?.message);
      queryClient.invalidateQueries({ queryKey: ['organizationById', orgId] });
    },
    onError: (error) => {
      setLoading(false);
      notifyError(error?.message);
    },
  });

  const updateOrganization = async (data: Organization) => {
    return updateOrganizationMutation(data);
  };

  return {
    updateOrganization,
  };
};

export default useUpdateOrganization;