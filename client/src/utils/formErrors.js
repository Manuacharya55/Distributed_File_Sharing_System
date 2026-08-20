
export const setFormErrors = (setError, response, defaultField = "root") => {
  if (!response || response.success) return;

  let hasSetError = false;

  if (Array.isArray(response.errors) && response.errors.length > 0) {
    response.errors.forEach((err) => {

      let field = null;
      let message = null;

      if (Array.isArray(err?.path) && err.path.length > 0) {
        field = err.path[0];
        message = err.message;
      } else if (err?.name && err?.message) {
        field = err.name;
        message = err.message;
      } else if (err?.field && err?.message) {
        field = err.field;
        message = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const keys = Object.keys(err).filter(k => k !== 'message');
        if (keys.length > 0) {
          field = keys[0];
          message = typeof err[field] === 'string' ? err[field] : err.message;
        }
      } else if (typeof err === 'string') {
        message = err;
      }

      if (field && message) {
        setError(field, { type: 'server', message });
        hasSetError = true;
      }
    });
  }

  // Fallback to response.message if no specific field error was set
  if (!hasSetError && response.message) {
    setError(defaultField, { type: 'server', message: response.message });
  }
};
