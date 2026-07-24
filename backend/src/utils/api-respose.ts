type FieldErrors = Record<string, string [] | undefined>

export function validationError(fields: FieldErrors) {
  return {
    error: {
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      fields,
    },
  };
}

export const invalidCredentialsError = {
  error: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid email or password",
  },
};

export const unauthorizedError = {
  error: {
    code: "UNAUTHORIZED",
    message: "You must be logged in to access this resource"
  }
}

export const tokenExpiredError = {
  error: {
    code: "TOKEN_EXPIRED",
    message: "Your session has expired. Please log in again.",
  },
};
