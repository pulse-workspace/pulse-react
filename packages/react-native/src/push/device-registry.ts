export interface RegisterDeviceParams {
  apiUrl: string;
  token: string;
  pushToken: string;
  platform: "fcm" | "apns";
  appBundleId: string;
}

/**
 * Registers device push notification token with Pulse backend.
 *
 * @param params Registration details including user auth JWT and device push token
 * @returns Server response status
 */
export async function registerDevicePushToken(params: RegisterDeviceParams): Promise<boolean> {
  const { apiUrl, token, pushToken, platform, appBundleId } = params;

  if (!apiUrl || !token || !pushToken || !platform || !appBundleId) {
    throw new Error("Missing required parameters to register device push token");
  }

  const endpoint = `${apiUrl.replace(/\/+$/, "")}/api/v1/devices/register`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      platform,
      token: pushToken,
      app_bundle_id: appBundleId,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to register device push token: HTTP ${res.status}`);
  }

  const data = await res.json();
  return data?.errCode === 0;
}

/**
 * Unregisters device push notification token upon user logout.
 */
export async function unregisterDevicePushToken(
  apiUrl: string,
  token: string,
  pushToken: string
): Promise<boolean> {
  const endpoint = `${apiUrl.replace(/\/+$/, "")}/api/v1/devices/unregister`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      token: pushToken,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to unregister device push token: HTTP ${res.status}`);
  }

  const data = await res.json();
  return data?.errCode === 0;
}

