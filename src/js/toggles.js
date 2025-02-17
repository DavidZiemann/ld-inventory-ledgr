import { getLDClient } from "./ldClient.js";

// Cached DOM elements
const alertContainer = document.getElementById("alert-container");
const toggleContainer = document.querySelector("#toggle-container");

/**
 * Initializes feature flag toggles on page load.
 */
document.addEventListener("DOMContentLoaded", async () => {
  const ldClient = await getLDClient();

  if (!ldClient) {
    console.error("LaunchDarkly client failed to initialize.");
    showAlert("Feature flags unavailable. Check LaunchDarkly setup.", false);
    return;
  }

  ldClient.on("ready", () => {
    console.log("✅ LaunchDarkly client is ready.");

    // Initialize all toggles
    document.querySelectorAll(".flag-switch").forEach((switchEl) => {
      setupToggle(switchEl, ldClient);
    });
  });

  // Event delegation for dynamic flag toggles
  toggleContainer.addEventListener("change", (event) => {
    if (event.target.classList.contains("flag-switch")) {
      handleToggleChange(event.target);
    }
  });
});

/**
 * Initializes a feature flag toggle by setting its initial state and listening for updates.
 * @param {HTMLElement} switchEl - The toggle switch element.
 * @param {LDClient} ldClient - The LaunchDarkly client instance.
 */
function setupToggle(switchEl, ldClient) {
  const flagName = switchEl.dataset.flag;
  const initialValue = ldClient.variation(flagName, false);
  switchEl.checked = initialValue;

  console.log(`🔍 Feature flag "${flagName}" initial state:`, initialValue);

  // Listen for external flag updates from LaunchDarkly
  ldClient.on(`change:${flagName}`, (current) => {
    console.log(`⚡ Feature flag "${flagName}" updated:`, current);
    switchEl.checked = current;
  });
}

/**
 * Handles user-initiated toggle changes by making an API request.
 * @param {HTMLElement} switchEl - The toggle switch element.
 */
async function handleToggleChange(switchEl) {
  const flagName = switchEl.dataset.flag;
  const isAvailable = switchEl.checked;

  try {
    await toggleFeatureFlag(flagName, isAvailable);
    showAlert(
      `Flag "${flagName}" is now ${isAvailable ? "enabled" : "disabled"}`,
      true
    );
  } catch (error) {
    console.error(`❌ Failed to toggle flag "${flagName}":`, error);
    showAlert(`Error updating "${flagName}"`, false);

    // Revert UI state on failure
    switchEl.checked = !isAvailable;
  }
}

/**
 * Sends a request to toggle a feature flag.
 * @param {string} flagName - The name of the feature flag.
 * @param {boolean} isAvailable - The desired state (on/off).
 * @returns {Promise<void>}
 */
async function toggleFeatureFlag(flagName, isAvailable) {
  const response = await fetch("http://localhost:4000/api/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flag: flagName, isAvailable }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }
}

/**
 * Displays a 3-second success/failure alert in #alert-container.
 * @param {string} message - The alert message.
 * @param {boolean} success - Whether the alert is a success or error.
 */
function showAlert(message, success) {
  const alertDiv = document.createElement("div");
  alertDiv.classList.add("alert", success ? "alert-success" : "alert-danger");
  alertDiv.setAttribute("role", "alert");
  alertDiv.setAttribute("aria-live", "polite");
  alertDiv.textContent = message;

  alertContainer.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}
