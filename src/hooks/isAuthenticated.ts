import Cookies from "js-cookie";

/**
 * 
 * @returns {boolean}
 */
export default function isAuthenticated(): boolean {
  const token = Cookies.get('accessToken');
  
  if (!token || token === undefined || token === "") {
    return false;
  }
  
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    const expiryTime = payload.exp * 1000;
    console.log(expiryTime)
    if (Date.now() >= expiryTime) {
      Cookies.remove('accessToken');
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating authentication token:", error);
    return false;
  }
}