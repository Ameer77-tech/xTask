import sanitize from "mongo-sanitize";

// SAFE Sanitize Middleware (No req.query overwrite)
export default function sanitizeMiddleware(req, res, next) {
  if (req.body) req.body = sanitize({ ...req.body });
  if (req.query) req.query = sanitize({ ...req.query });
  if (req.params) req.params = sanitize({ ...req.params });

  next();
}
