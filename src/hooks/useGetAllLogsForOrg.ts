import { auth } from '@/api/auths'
import { AuditLogsResponse } from '@/types'
import { useQuery } from '@tanstack/react-query'

const useGetAllLogsForOrg = (orgId:string, pageSize?:number, page?:number) => {
    return useQuery<AuditLogsResponse, Error>({
        queryKey: ['logs for org', orgId],
        queryFn: ()=> auth.auditLogForOrg(orgId, page, pageSize),
        enabled: !!orgId,
        refetchOnWindowFocus: false
    })
}

export default useGetAllLogsForOrg