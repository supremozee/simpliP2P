import { auth } from "@/helpers/auths";
import useStore from "@/store";
import { LogoutAll } from "@/types";
import { useMutation } from "@tanstack/react-query";
import useNotify from "./useNotify";
import useAuthHandler from "./useAuthHandler";
import { useRouter } from "next/navigation";
import { clearCookies } from "@/utils/setCookies";

const useLogoutAll = () => {
  const { setLoading } = useStore();
  const { success, error } = useNotify();
  const {clearUserData} = useAuthHandler()
  const router = useRouter()
  const { mutateAsync: logoutAllMutation } = useMutation({
    onMutate: () => {
      setLoading(true);
    },
    mutationFn: auth.logoutAll,
    onSuccess: (response) => {
       success(response?.message);
        router.push("/login");
        setLoading(false);
        clearUserData()
        clearCookies();
    },
    onError: (response) => {
      error(response?.message);
      setLoading(false);
    },
  });

  const logoutAll = async (data: LogoutAll) => {
    return logoutAllMutation(data);
  };
  return {
    logoutAll,
  };
};

export default useLogoutAll;
