import Cookies from "js-cookie";

export const apiRequest = async (url: string, init: RequestInit = {}) => {
  const token = Cookies.get('simpliToken');
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const config: RequestInit = {
    ...init,
    headers: {
      ...(init.headers as HeadersInit),
      ...authHeader,
    } as HeadersInit,
  };

  try {
    const response = await fetch(url, config);
   
    if (response.status === 409) {
      throw new Error("Email or phone number already exists.");
    }

    if (response.status === 401 || response.status === 403) {
      const currentPath = window.location.pathname;
      if (!['/login', '/register', '/'].includes(currentPath)) {
        console.log("Redirecting to login due to status code:", response.status);
        window.location.href = "/login";
      }
      throw new Error("Unauthorized access. Please log in.");
    }

    if (response.status === 404) {
      throw new Error("Resource not found.");
    }

    if (response.status === 500) {
      throw new Error("An Error occured. Please try again later.");
    }

    if (response.status === 502) {
      throw new Error("Bad gateway. Please try again later.");
    }

    if (response.status === 503) {
      throw new Error("Service unavailable. Please try again later.");
    }

    if (response.status === 504) {
      throw new Error("Gateway timeout. Please try again later.");
    }

    if (response.status === 200 || response.status === 201) {
      return await response.json();
    }

    return await response.json();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};