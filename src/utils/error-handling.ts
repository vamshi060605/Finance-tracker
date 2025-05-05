export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleDatabaseError(error: any): AppError {
  if (error?.code === '23505') {
    return new AppError('Duplicate entry found', 'DUPLICATE_ENTRY', 400);
  }
  if (error?.code === '23503') {
    return new AppError('Referenced record not found', 'FOREIGN_KEY_VIOLATION', 400);
  }
  return new AppError('Internal server error', 'INTERNAL_ERROR', 500);
}

export const errorHandler = (error: unknown) => {
  if (error instanceof AppError) {
    // Handle known errors
    return {
      message: error.message,
      code: error.code,
      status: error.status
    };
  }
  
  // Handle unknown errors
  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    status: 500
  };
};
