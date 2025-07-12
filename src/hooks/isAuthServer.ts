import { NextRequest } from "next/server";

/**
 * Server-side authentication check for middleware
 * @param request - NextRequest object
 * @returns {boolean}
 */
export function isAuthenticatedServer(request: NextRequest): boolean {
  const token = request.cookies.get('accessToken')?.value;
  
  if (!token || token === undefined || token === "") {
    return false;
  }
  
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    const expiryTime = payload.exp * 1000;
    if (Date.now() >= expiryTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating authentication token:", error);
    return false;
  }
}