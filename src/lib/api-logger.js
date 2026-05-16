export function logApiError(scope, error, context = {}) {
  const payload = {
    level: "error",
    scope,
    message: error?.message || String(error || "Unknown API error"),
    context,
    timestamp: new Date().toISOString(),
  };

  console.error(JSON.stringify(payload));
}

export function logApiWarn(scope, message, context = {}) {
  console.warn(
    JSON.stringify({
      level: "warn",
      scope,
      message,
      context,
      timestamp: new Date().toISOString(),
    }),
  );
}
