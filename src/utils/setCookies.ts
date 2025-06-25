import Cookies from "js-cookie";

export const setCookies = (accessToken: string, refreshToken: string) => {
  const cookieOptions = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const, 
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
};

export const getCookies = () => {
  const accessToken = Cookies.get("accessToken") 
  const refreshToken = Cookies.get("refreshToken")
  return { accessToken, refreshToken };
};

export const clearCookies = () => {
  const domain = window.location.hostname === 'localhost' ? 'localhost' : '.simplip2p.vercel.app';
  Cookies.remove("accessToken", { path: "/", domain });
  Cookies.remove("refreshToken", { path: "/", domain });
};