import Cookies from "js-cookie";
export const setCookies = (accessToken: string, refreshToken: string) => {
    const cookieOptions = {
      path: "/",
      secure: true,
    };
  
    Cookies.set("accessToken", accessToken, {
      ...cookieOptions,
      domain: "localhost",
      expires: 1 / 24,
    });
    Cookies.set("accessToken", accessToken, {
      ...cookieOptions,
      domain: "simplip2p.vercel.app",
      expires: 1 / 24,
    });
    Cookies.set("refreshToken", refreshToken, {
      ...cookieOptions,
      domain: "localhost",
      expires: 30,
    });
    Cookies.set("refreshToken", refreshToken, {
      ...cookieOptions,
      domain: "simplip2p.vercel.app",
      expires: 30,
    });
  };