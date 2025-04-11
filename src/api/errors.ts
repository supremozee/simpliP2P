/**
 * Base error class for API-related errors
 */
export class BaseApiError extends Error {
  status: number;
  constructor(message: string, status: number = 0) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown for authentication issues (401 responses)
 */
export class AuthError extends BaseApiError {
  constructor(message: string = 'Authentication failed', status: number = 401) {
    super(message, status);
  }
}

/**
 * Error thrown for general API errors (400, 403, 500, etc.)
 */
export class ApiError extends BaseApiError {
  constructor(message: string = 'API request failed', status: number = 0) {
    super(message, status);
  }
}

/**
 * Error thrown for network or connection issues
 */
export class NetworkError extends BaseApiError {
  constructor(message: string = 'Network error occurred', status: number = 0) {
    super(message, status);
  }
}