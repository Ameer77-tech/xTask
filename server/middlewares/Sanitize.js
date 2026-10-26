import sanitize from "mongo-sanitize";

// In-place sanitization to support Express 5 where req.query is a read-only getter
export default function sanitizeMiddleware(req, res, next) {
  if (req.body && typeof req.body === "object") {
    sanitize(req.body);
  }
  if (req.query && typeof req.query === "object") {
    sanitize(req.query);
  }
  if (req.params && typeof req.params === "object") {
    sanitize(req.params);
  }

  next();
}
