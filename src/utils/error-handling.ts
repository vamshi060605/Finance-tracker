// Error handling utilities for application and database errors

export class AppError extends Error {
  // Custom application error with code and status
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Converts database errors to AppError with friendly messages
export function handleDatabaseError(error: any): AppError {
  if (error?.code === '23505') {
    // Unique constraint violation
    return new AppError('Duplicate entry found', 'DUPLICATE_ENTRY', 400);
  }
  if (error?.code === '23503') {
    // Foreign key violation
    return new AppError('Referenced record not found', 'FOREIGN_KEY_VIOLATION', 400);
  }
  return new AppError('Internal server error', 'INTERNAL_ERROR', 500);
}

// General error handler for API responses
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
