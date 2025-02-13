import * as LDClient from "./ldclient.min.js";

let ldClientInstance = null;

/**
 * Generates a stable, randomized user key per session.
 * Uses localStorage to persist across page refreshes.
 */
function generateUserKey() {
  if (typeof window !== "undefined") {
    let userKey = localStorage.getItem("ld-user-key");
    if (!userKey) {
      userKey = `user-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("ld-user-key", userKey);
    }
    return userKey;
  }
  return `user-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Initializes LaunchDarkly with user location context.
 * @param {string} location - User location (e.g., "Europe", "California").
 */
export function getLDClient(location = "default") {
  if (ldClientInstance) {
    return ldClientInstance;
  }

  const LD_CLIENT_ID =
    process.env.LD_CLIENT_ID || "your-launchdarkly-client-side-key";

  if (!LD_CLIENT_ID) {
    console.warn(
      "⚠️ LaunchDarkly Client ID is missing. Feature flags may not work."
    );
    return null;
  }

  const userKey = generateUserKey();

  const context = {
    kind: "user",
    key: userKey,
    location: location,
  };

  ldClientInstance = LDClient.initialize(LD_CLIENT_ID, context, {
    streaming: true,
  });

  ldClientInstance.on("ready", () => {
    console.log("✅ LaunchDarkly client initialized with context:", context);
  });

  return ldClientInstance;
}

/**
 * Updates the LaunchDarkly context dynamically when the dropdown changes.
 * @param {string} newLocation - New selected region.
 */
export function updateLDContext(newLocation) {
  console.log("updateLDContext: " + newLocation);
  if (!ldClientInstance) {
    console.warn("⚠️ LaunchDarkly has not been initialized yet.");
    return;
  }

  console.log(`🔄 Updating LD context to location: ${newLocation}`);
  ldClientInstance.identify({
    kind: "user",
    key: `user-${newLocation}`,
    location: newLocation,
  });
}
