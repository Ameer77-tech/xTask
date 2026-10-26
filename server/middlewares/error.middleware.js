
export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Response has already started; delegate to Express.
  if (res.headersSent) {
    return next(err);
  }

  let status = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";

  // MongoDB duplicate key
  if (err.code === 11000) {
    status = 409;
    message = "A record with this value already exists.";
  }

  // MongoDB invalid ObjectId / cast error
  else if (err.name === "CastError") {
    status = 400;
    message = "Invalid resource identifier.";
  }

  // Mongoose validation error
  else if (err.name === "ValidationError" || err.name === "ZodError") {
    status = 400;
    message = "Validation failed.";
  }

  // JWT errors
  else if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid authentication token.";
  } else if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Authentication token has expired.";
  }

  // Body-parser malformed JSON
  else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON request body.";
  }

  // Never expose internal server details to clients.
  if (status >= 500) {
    message = "Internal server error";
  }

  return res.status(status).json({
    success: false,
    message,
    reply: message,
  });
};
