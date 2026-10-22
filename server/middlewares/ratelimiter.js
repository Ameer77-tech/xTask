import rateLimit from "express-rate-limit";

// Global API Rate Limiter
export default rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
});

// Dedicated Auth Rate Limiter (Brute-force protection on login/register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  message: {
    reply: "Too many authentication attempts. Please try again after 15 minutes.",
    success: false,
  },
});
