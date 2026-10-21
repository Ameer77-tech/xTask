/**
 * Formats Zod validation issues into a clean, client-safe JSON response.
 * Compatible with React UI string rendering while providing field-level details.
 */
export const formatZodError = (error) => {
  const issues = error?.issues || [];
  const firstMessage = issues[0]?.message || "Validation failed";
  return {
    success: false,
    reply: firstMessage,
    message: firstMessage,
    errors: issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    })),
  };
};
