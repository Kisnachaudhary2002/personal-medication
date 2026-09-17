// Wraps an async controller so we don't repeat try/catch in every function.
// Any thrown/rejected error is forwarded to the error.middleware.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
