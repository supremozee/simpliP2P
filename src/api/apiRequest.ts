import useStore from "@/store";
import Cookies from "js-cookie";

export const apiRequest = async (url: string, init: RequestInit = {}) => {
  const token = Cookies.get('accessToken');
  const authHeader = token ? { Authorization: `Bearer ${token}` } :{};
 const {setError} = useStore.getState()
  const config: RequestInit = {
    ...init,
    headers: {
      ...(init.headers as HeadersInit),
      ...authHeader,
    } as HeadersInit,
  };

  try {
    const response = await fetch(url, config);
    if (response.status === 401) {
      Cookies.remove('accessToken');
      window.location.href = "/login"
      const errorMessage = await response.json();
      throw new Error(errorMessage?.message)
    }
    if (response.status === 403) {
      const errorMessage = await response.json();
      if(errorMessage) {
        setError(true);
      }
      throw new Error(errorMessage?.message);
    }
    if (response.status === 400) {
      const errorMessage = await response.json();
      if(errorMessage) {
        setError(true);
      }
      throw new Error(errorMessage?.message);
    }

    if (response.status === 404) {
      const errorMessage = await response.json();
      throw new Error(errorMessage?.message)
    }
    

    if (response.status === 500) {
      const errorMessage = await response.json();
      throw new Error(errorMessage?.message)
    }

    if (response.status === 502) {
      const errorMessage = await response.json();
      throw new Error(errorMessage?.message)
    }

    if (response.status === 503) {
      const errorMessage = await response.json();
      throw new Error(errorMessage?.message)
    }

    if (response.status === 504) {
      const errorMessage = await response.json();
      throw new Error(errorMessage?.message)
    }
    if (response.status === 200 || response.status === 201) {
      return await response.json();
    }

    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};