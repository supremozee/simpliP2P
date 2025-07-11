/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/api/auths"
import { UserProfileResponse } from "@/types"
import { useQuery } from "@tanstack/react-query"

const fetchUser = async (): Promise<UserProfileResponse | any> => {
  const userDetails = auth.getUserDetails()
  return userDetails;
}

const useGetUser = () => {
  const { data: user, error, isLoading, refetch } = useQuery<UserProfileResponse | null, Error>({
    queryKey: ['customer'],
    queryFn: fetchUser,
  })
  return {
    user,
    error: error,
    isLoading,
    refetch
  }
}

export default useGetUser