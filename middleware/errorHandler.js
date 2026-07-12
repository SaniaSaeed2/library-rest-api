// Centralized error handler. Any route that calls next(err) lands here,
// instead of every route writing its own try/catch response logic.
export function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
}

// 404 handler for any route that doesn't match one defined above.
export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} does not exist.`
  });
}

export default { errorHandler, notFound };
