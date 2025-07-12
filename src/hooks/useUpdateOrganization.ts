import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/helpers/auths";
import { Organization } from "@/types";
import useStore from "@/store";
import useNotify from "./useNotify";
import { sanitize } from "@/utils/helpers";

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
      const sanitizedOrgName = sanitize(response?.data?.name);
      setLoading(false);
      setOrgName(sanitizedOrgName);
      success(response?.message);
      queryClient.invalidateQueries({ queryKey: ["organizationById", orgId] });
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
