import Cookies from "js-cookie";

export const setCookies = (accessToken: string, refreshToken: string) => {
  const cookieOptions = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const, // Changed from strict to lax for better cross-site redirects
    domain: window.location.hostname === 'localhost'
      ? 'localhost'
      : window.location.hostname,
  };

  // Set cookies with longer expiration time
  Cookies.set("accessToken", accessToken, {
    ...cookieOptions,
    expires: 1, // 1 day
  });
  Cookies.set("refreshToken", refreshToken, {
    ...cookieOptions,
    expires: 30, // 30 days
  });

  // // Store in local storage as fallback and for immediate access
  // localStorage.setItem("accessToken", accessToken);
  // localStorage.setItem("refreshToken", refreshToken);
};

export const getCookies = () => {
  const accessToken = Cookies.get("accessToken") || localStorage.getItem("accessToken");
  const refreshToken = Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
  return { accessToken, refreshToken };
};

export const clearCookies = () => {
  const domain =  window.location.hostname === 'localhost'
      ? 'localhost'
      : window.location.hostname
  Cookies.remove("accessToken", { path: "/", domain });
  Cookies.remove("refreshToken", { path: "/", domain });
};