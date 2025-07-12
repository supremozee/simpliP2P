import { auth } from "@/helpers/auths";
import { AuditLogsResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useGetAllLogsByUser = (
  orgId: string,
  userId: string,
  pageSize?: number,
  page?: number
) => {
  return useQuery<AuditLogsResponse, Error>({
    queryKey: ["logs for user", orgId, userId],
    queryFn: () => auth.auditLogsByUser(orgId, userId, page, pageSize),
    enabled: !!orgId && !!userId,
    refetchOnWindowFocus: false,
  });
};

export default useGetAllLogsByUser;
