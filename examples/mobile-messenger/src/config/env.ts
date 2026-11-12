/**
 * Fail-Fast Environment Configuration Reader for Mobile Messenger.
 * Reads mandatory environment variables and halts immediately if any key is missing.
 */
export interface AppConfig {
  wsUrl: string;
  apiUrl: string;
}

/**
 * Validates and returns active application configuration.
 *
 * Business Logic:
 * Inspects `import.meta.env` for `VITE_PULSE_WS_URL` and `VITE_PULSE_API_URL`.
 * Throws descriptive Error if any required variable is empty or undefined,
 * strictly preventing silent fallback defaults.
 */
export function getAppConfig(): AppConfig {
  const wsUrl = import.meta.env.VITE_PULSE_WS_URL;
  const apiUrl = import.meta.env.VITE_PULSE_API_URL;

  if (!wsUrl || typeof wsUrl !== "string" || wsUrl.trim() === "") {
    throw new Error(
      "Configuration failure: Missing mandatory environment variable 'VITE_PULSE_WS_URL'. Provide valid WebSocket endpoint."
    );
  }

  if (!apiUrl || typeof apiUrl !== "string" || apiUrl.trim() === "") {
    throw new Error(
      "Configuration failure: Missing mandatory environment variable 'VITE_PULSE_API_URL'. Provide valid API endpoint."
    );
  }

  return {
    wsUrl: wsUrl.trim(),
    apiUrl: apiUrl.trim(),
  };
}

