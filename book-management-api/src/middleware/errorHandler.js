/**
 * Error Handling Middleware
 * Centralized error handler and 404 Not Found handler.
 */

/**
 * Middleware for catching unmatched/unknown routes (404)
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} - Route Not Found`
  });
};

/**
 * Centralized error handling middleware
 * Must accept 4 arguments (err, req, res, next) for Express to recognize it as error middleware.
 */
const errorHandler = (err, req, res, next) => {
  // Handle invalid/malformed JSON syntax from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload: Please verify that your JSON syntax is valid.'
    });
  }

  // Log error in development (without crashing)
  console.error('[SERVER ERROR]:', err.stack || err.message || err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
