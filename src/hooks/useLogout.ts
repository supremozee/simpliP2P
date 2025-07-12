import { auth } from "@/helpers/auths";
import useStore from "@/store";
import { Logout } from "@/types";
import { useMutation } from "@tanstack/react-query";
import useNotify from "./useNotify";
import { useRouter } from "next/navigation";
import { clearCookies } from "@/utils/setCookies";
const useLogout = () => {
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
