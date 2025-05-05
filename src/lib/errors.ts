export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: 'AUTH_ERROR',
  INVALID_INPUT: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DB_ERROR',
  NOT_FOUND: 'NOT_FOUND',
} as const;

export function handleError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR'
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      code: 'UNKNOWN_ERROR'
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR'
  };
}
