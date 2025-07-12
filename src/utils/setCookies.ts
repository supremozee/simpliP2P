import Cookies from "js-cookie";
const getDomain = () => {
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "localhost";
  }
  
  if (hostname.includes("simplip2p.com")) {
    return ".simplip2p.com"; 
  }
  
  return hostname;
};
export const setCookies = (accessToken: string, refreshToken: string) => {
  const cookieOptions = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    domain:getDomain()
  };

  Cookies.set("accessToken", accessToken, {
    ...cookieOptions,
    expires: 1,
  });
  Cookies.set("refreshToken", refreshToken, {
    ...cookieOptions,
    expires: 30, 
  });
};

export const getCookies = () => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  return { accessToken, refreshToken };
};

export const clearCookies = () => {
  const domain =getDomain()
  Cookies.remove("accessToken", { path: "/", domain });
  Cookies.remove("refreshToken", { path: "/", domain });
};
