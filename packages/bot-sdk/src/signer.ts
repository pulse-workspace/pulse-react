import { createHmac, timingSafeEqual } from "crypto";

/**
 * Computes an HMAC-SHA256 signature string formatted as 'sha256=<hex>'.
 *
 * @param payload Raw payload string or Buffer
 * @param secret Webhook shared secret key
 */
export function computeSignature(payload: string | Buffer, secret: string): string {
  if (!secret) {
    throw new Error("Webhook secret cannot be empty");
  }
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  return `sha256=${hmac.digest("hex")}`;
}

/**
 * Verifies that the provided signature matches the payload HMAC using timing-safe comparison.
 *
 * @param payload Raw body buffer or string
 * @param secret Webhook shared secret key
 * @param signature Expected header value (e.g. 'sha256=abcdef...')
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  secret: string,
  signature: string
): boolean {
  if (!signature || !secret) return false;

  const expected = computeSignature(payload, secret);
  const bufExpected = Buffer.from(expected, "utf8");
  const bufActual = Buffer.from(signature, "utf8");

  if (bufExpected.length !== bufActual.length) {
    return false;
  }

  return timingSafeEqual(bufExpected, bufActual);
}

