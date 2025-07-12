import Cookies from "js-cookie";

const getRootDomain = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost') return 'localhost';
  
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return `.${parts.slice(-2).join('.')}`;
  }
  return hostname;
};

export const setCookies = (accessToken: string, refreshToken: string) => {
  const cookieOptions = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const, 
    domain: getRootDomain()
  };

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
  const domain = getRootDomain()
  Cookies.remove("accessToken", { path: "/", domain });
  Cookies.remove("refreshToken", { path: "/", domain });
};