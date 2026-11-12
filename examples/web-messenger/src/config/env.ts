/**
 * Fail-Fast Environment Configuration Reader.
 * Strictly adheres to Rule 2: Zero fallback defaults allowed.
 * Throws explicit errors immediately at startup if any required environment variable is missing.
 */

export interface AppConfig {
  pulseWsUrl: string;
  pulseApiUrl: string;
}

/**
 * Validates and extracts required environment variables.
 * Fails fast if any variable is undefined or blank.
 *
 * @returns Validated AppConfig object
 */
export function getAppConfig(): AppConfig {
  const wsUrl = import.meta.env.VITE_PULSE_WS_URL;
  const apiUrl = import.meta.env.VITE_PULSE_API_URL;

  if (!wsUrl || typeof wsUrl !== "string" || wsUrl.trim().length === 0) {
    throw new Error(
      "Missing required environment variable: VITE_PULSE_WS_URL. " +
      "Please configure this in your .env file."
    );
  }

  if (!apiUrl || typeof apiUrl !== "string" || apiUrl.trim().length === 0) {
    throw new Error(
      "Missing required environment variable: VITE_PULSE_API_URL. " +
      "Please configure this in your .env file."
    );
  }

  return {
    pulseWsUrl: wsUrl.trim(),
    pulseApiUrl: apiUrl.trim(),
  };
}

