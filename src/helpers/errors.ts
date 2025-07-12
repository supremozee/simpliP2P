export interface ApiErrorObject extends Error {
  status: number;
}

function ApiError(name: string, message: string, status: number): ApiErrorObject {
  const error = new Error(message) as ApiErrorObject;
  error.name = name;
  error.status = status;
  return error;
}

export function AuthError(message: string = 'Authentication failed', status: number = 401): ApiErrorObject {
  return ApiError('AuthError', message, status);
}

export function ApiErrorGeneral(message: string = 'API request failed', status: number = 0): ApiErrorObject {
  return ApiError('ApiError', message, status);
}

export function NetworkError(message: string = 'Network error occurred', status: number = 0): ApiErrorObject {
  return ApiError('NetworkError', message, status);
}
