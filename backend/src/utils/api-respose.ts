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