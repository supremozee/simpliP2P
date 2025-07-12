import useStore from "@/store";
import Cookies from "js-cookie";
import { ApiError } from "next/dist/server/api-utils";
import { ApiErrorGeneral, AuthError, NetworkError } from "./errors";

/**
 * Standard API request handler with authentication and error handling
 * @param url - The API endpoint URL
 * @param init - Request initialization options
 * @param responseType - The expected response type (json, blob, etc.)
 * @returns - Response from the API
 */
export const apiRequest = async (url: string, init: RequestInit = {}, responseType: 'json' | 'blob' = 'json') => {
  const token = Cookies.get('accessToken');
  const { setError } = useStore.getState();
  
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
          throw  AuthError(errorMessage, response.status);
        }
        
        if (response.status === 403 || response.status === 400) {
          setError(true);
          throw  ApiErrorGeneral(errorMessage, response.status);
        }
        
        if (response.status >= 500) {
          throw  ApiErrorGeneral(errorMessage, response.status);
        }
        
        throw ApiErrorGeneral( errorMessage, response.status);
      } else {
        throw  ApiErrorGeneral( `Server error: ${response.statusText}`, response.status);
      }
    }
    
    if (responseType === 'blob') {
      return await response.blob();
    }
    
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    
    return { success: true, status: response.status };
    
  } catch (error) {
    if (error instanceof AuthError || error instanceof ApiError) {
      throw error;
    }
    
    throw  NetworkError(
      error instanceof Error ? error.message : String(error)
    );
  }
};