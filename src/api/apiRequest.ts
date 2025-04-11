import useStore from "@/store";
import Cookies from "js-cookie";
import { ApiError, AuthError, NetworkError } from "./errors";

/**
 * Standard API request handler with authentication and error handling
 * @param url - The API endpoint URL
 * @param init - Request initialization options
 * @returns - JSON response from the API
 */
export const apiRequest = async (url: string, init: RequestInit = {}) => {
  const token = Cookies.get('accessToken');
  const { setError } = useStore.getState();
  
  // Configure headers with authentication if token exists
  const config: RequestInit = {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers as HeadersInit),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    } as HeadersInit,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('Content-Type');
    
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      
      if (contentType?.includes('application/json')) {
        const errorData = await response.json().catch(() => ({}));
        errorMessage = errorData?.message || errorMessage;
        
        if (response.status === 401) {
          Cookies.remove('accessToken');
          window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
          throw new AuthError(errorMessage, response.status);
        }
        
        if (response.status === 403 || response.status === 400) {
          setError(true);
          throw new ApiError(errorMessage, response.status);
        }
        
        if (response.status >= 500) {
          throw new ApiError(errorMessage, response.status);
        }
        
        // Handle other error cases
        throw new ApiError(errorMessage, response.status);
      } else {
        // Non-JSON error response
        throw new ApiError(`Server error: ${response.statusText}`, response.status);
      }
    }
    
    // Handle successful response
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    
    // Handle non-JSON successful responses
    return { success: true, status: response.status };
    
  } catch (error) {
    // Rethrow AuthErrors and ApiErrors as is
    if (error instanceof AuthError || error instanceof ApiError) {
      throw error;
    }
    
    // Handle network and other errors
    throw new NetworkError(
      error instanceof Error ? error.message : String(error)
    );
  }
};