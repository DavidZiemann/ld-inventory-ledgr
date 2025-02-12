// toggles.js
import { getLDClient } from "./ldClient.js";
import { flagEndpoints } from "./flags.js";

document.addEventListener("DOMContentLoaded", async () => {
  const alertContainer = document.getElementById("alert-container");
  const allSwitches = document.querySelectorAll(".flag-switch");

  const ldClient = getLDClient();

  // Wait until LaunchDarkly is ready so we can get initial flag states
  ldClient.on("ready", async () => {
    // For each toggle...
    allSwitches.forEach(async (switchEl) => {
      const flagName = switchEl.dataset.flag;

      // 1. Initialize the switch .checked state from LD
      const initialValue = ldClient.variation(flagName, false);
      switchEl.checked = initialValue;

      // 2. Subscribe to changes: if changed externally, reflect that in the checkbox
      ldClient.on(`change:${flagName}`, (current, previous) => {
        console.log(
          `Flag "${flagName}" changed from ${previous} to ${current} externally`
        );
        switchEl.checked = current; // Update the toggle to match new state
      });
    });

    // 3. Listen for "local" user toggles (to call our endpoints)
    allSwitches.forEach((switchEl) => {
      switchEl.addEventListener("change", async (event) => {
        const enabled = event.target.checked;
        const flagName = event.target.dataset.flag;
        const endpoints = flagEndpoints[flagName];

        if (!endpoints) {
          console.error(`No endpoints found for flag: ${flagName}`);
          showAlert(`No endpoints found for ${flagName}`, false);
          return;
        }

        // Decide which endpoint to call
        const url = enabled ? endpoints.on : endpoints.off;

        try {
          // Example: a POST request with { flag, enabled }, as your API requires
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ flag: flagName, enabled }),
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
          }

          showAlert(
            `Flag "${flagName}" ${enabled ? "enabled" : "disabled"}`,
            true
          );
        } catch (err) {
          console.error("Failed toggling flag:", err);
          showAlert(`Failed toggling flag "${flagName}"`, false);
          // Revert checkbox so UI remains consistent if server call failed
          event.target.checked = !enabled;
        }
      });
    });
  });

  function showAlert(message, success = true) {
    const alertDiv = document.createElement("div");
    alertDiv.classList.add(
      "alert",
      success ? "alert-success" : "alert-failure"
    );
    alertDiv.setAttribute("role", "alert");
    alertDiv.textContent = message;
    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }
});
