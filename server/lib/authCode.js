import crypto from "crypto";

const authCodes = new Map();

/**
 * Generates an ephemeral one-time authorization code associated with a JWT token.
 * Default expiration is 60 seconds.
 */
export const generateAuthCode = (token, ttlMs = 60000) => {
  const code = crypto.randomBytes(32).toString("hex");
  authCodes.set(code, {
    token,
    expiresAt: Date.now() + ttlMs,
  });
  return code;
};

/**
 * Redeems an authorization code.
 * Atomically retrieves the token and deletes the code to enforce single-use.
 */
export const redeemAuthCode = (code) => {
  if (!code || typeof code !== "string") {
    return null;
  }

  const entry = authCodes.get(code);
  if (!entry) {
    return null;
  }

  // Always delete on attempt to enforce strict single-use
  authCodes.delete(code);

  if (entry.expiresAt < Date.now()) {
    return null;
  }

  return entry.token;
};

/**
 * Helper for test isolation
 */
export const clearAuthCodes = () => {
  authCodes.clear();
};

// Periodic garbage collection for expired unredeemed codes
setInterval(() => {
  const now = Date.now();
  for (const [code, entry] of authCodes.entries()) {
    if (entry.expiresAt < now) {
      authCodes.delete(code);
    }
  }
}, 5 * 60 * 1000).unref();
