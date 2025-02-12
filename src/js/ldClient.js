import * as LDClient from "./ldclient.min.js";

let ldClientInstance = null;

/**
 * Initializes and returns the LaunchDarkly client.
 * Ensures a singleton instance is used across the application.
 *
 * @param {Object} [userContext] - Optional user context (default: anonymous).
 * @returns {LDClient} - The LaunchDarkly client instance.
 */
export function getLDClient(userContext = { kind: "user", anonymous: true }) {
  if (ldClientInstance) {
    return ldClientInstance;
  }

  const LD_CLIENT_ID = process.env.LD_CLIENT_ID || "your-default-client-id";

  if (!LD_CLIENT_ID) {
    console.warn(
      "Warning: LaunchDarkly Client ID is missing. Feature flags will not work."
    );
    return null;
  }

  const options = { streaming: true };

  // Initialize the LD client with the provided user context
  ldClientInstance = LDClient.initialize(LD_CLIENT_ID, userContext, options);

  // Attach a one-time global 'ready' listener for debugging
  ldClientInstance.on("ready", () => {
    console.log("✅ LaunchDarkly client is ready");
  });

  ldClientInstance.on("error", (err) => {
    console.error("❌ LaunchDarkly encountered an error:", err);
  });

  return ldClientInstance;
}

/**
 * Updates the user context dynamically.
 * Ensures the LD client is re-initialized with the new user.
 *
 * @param {Object} newUserContext - The new user details.
 */
export function updateLDUser(newUserContext) {
  if (!ldClientInstance) {
    console.warn(
      "Attempted to update user before LaunchDarkly was initialized."
    );
    return;
  }

  console.log("🔄 Updating LaunchDarkly user context:", newUserContext);
  ldClientInstance.identify(newUserContext);
}
