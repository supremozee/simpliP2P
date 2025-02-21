/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/api/auths"
import { OrganizationDashboardByIdResponse } from "@/types"
import { useQuery } from "@tanstack/react-query"

const fetchOrganizationDashboardById = async(orgId:string):Promise<OrganizationDashboardByIdResponse | any> => {
     const organizationDashboard = auth.organizationDashboardById(orgId)
     return organizationDashboard
}
const useGetOrganizationDashboardById = (id:string) => {
    const {data:organizationDashboard, error, isLoading} = useQuery<OrganizationDashboardByIdResponse | null, Error>({
        queryKey: ['organizationDashboard', id],
        queryFn: ()=>fetchOrganizationDashboardById(id),
        refetchOnWindowFocus: false,
    })

    return  {
        organizationDashboard,
        error: error,
        isLoading,
    }
}

export default useGetOrganizationDashboardById