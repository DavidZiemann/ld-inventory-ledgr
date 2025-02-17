import * as LDClient from "launchdarkly-js-client-sdk";

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
 * Uses browser's Geolocation API if available.
 * @param {string} fallbackLocation - Fallback location if geolocation fails.
 */
export async function getLDClient(fallbackLocation = "default") {
  if (ldClientInstance) {
    return ldClientInstance;
  }

  const LD_CLIENT_ID =
    process.env.PARCEL_LD_CLIENT_ID || "your-launchdarkly-client-side-key";

  if (!LD_CLIENT_ID) {
    console.warn(
      "⚠️ LaunchDarkly Client ID is missing. Feature flags may not work."
    );
    return null;
  }

  const userKey = generateUserKey();
  let context = {
    kind: "user",
    key: userKey,
    location: fallbackLocation,
  };

  // Try to get geolocation
  if ("geolocation" in navigator) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 0
        });
      });

      // Add precise location to context
      context = {
        ...context,
        custom: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      };

      // Attempt to get country/city using reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
        );
        const data = await response.json();
        
        if (data.address) {
          context.country = data.address.country;
          context.city = data.address.city || data.address.town || data.address.village;
          context.location = data.address.country; // Update location with actual country
          
          // Include state for US locations
          if (data.address.country === 'United States') {
            context.state = data.address.state;
            // Update location to include state for US
            context.location = `US-${data.address.state}`;
          }
        }
      } catch (error) {
        console.warn('Reverse geocoding failed:', error);
      }
    } catch (error) {
      console.warn('Geolocation error:', error);
    }
  }

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
