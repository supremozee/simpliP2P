import { auth } from "@/api/auths";
import useStore from "@/store";
import { Logout } from "@/types";
import { useMutation } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { useRouter } from "next/navigation";
import { clearCookies } from "@/utils/setCookies";
import useAuthHandler from "./useAuthHandler";
const useLogout = () => {
  const { clearUserData } = useAuthHandler();
  const { setLoading } = useStore();
  const router = useRouter();
  const { success, error } = useNotify();
  const { mutateAsync: logoutMutation } = useMutation({
    onMutate: () => {
      setLoading(true);
    },
    mutationFn: auth.logout,
    onSuccess: (response) => {
      success(response?.message);
      router.push("/login");
      setLoading(false);
      clearCookies();
      clearUserData()
    },
    onError: (response) => {
      error(response?.message);
      setLoading(false);
    },
  });

  const logout = async (data: Logout) => {
    return logoutMutation(data);
  };
  return {
    logout,
  };
};

export default useLogout;
