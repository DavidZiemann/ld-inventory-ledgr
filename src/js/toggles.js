import { getLDClient } from "./ldClient.js";

document.addEventListener("DOMContentLoaded", () => {
  const alertContainer = document.getElementById("alert-container");
  const allSwitches = document.querySelectorAll(".flag-switch");

  // 1. Get the LaunchDarkly client (singleton) to read flags & subscribe
  const ldClient = getLDClient();

  // 2. Wait until the LD client is ready, then set up toggles
  ldClient.on("ready", () => {
    allSwitches.forEach((switchEl) => {
      const flagName = switchEl.dataset.flag;
      // Get the initial flag value
      const initialValue = ldClient.variation(flagName, false);
      switchEl.checked = initialValue;

      // Listen for external changes to this specific flag
      ldClient.on(`change:${flagName}`, (current, previous) => {
        console.log(
          `Flag "${flagName}" changed from ${previous} to ${current} externally`
        );
        switchEl.checked = current;
      });

      // Listen for user toggles in the UI
      switchEl.addEventListener("change", async (event) => {
        const isAvailable = event.target.checked;
        try {
          const response = await fetch("http://localhost:4000/api/toggle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ flag: flagName, isAvailable }),
          });

          if (!response.ok) {
            throw new Error(
              `Toggle request failed: ${response.status} ${response.statusText}`
            );
          }

          showAlert(
            `Flag "${flagName}" is now ${isAvailable ? "available" : "unavailable"}`,
            true
          );
        } catch (error) {
          console.error("Error toggling flag:", error);
          showAlert(`Failed toggling "${flagName}"`, false);

          // Revert checkbox state if call failed
          event.target.checked = !isAvailable;
        }
      });
    });
  });

  /**
   * Displays a 3-second success/failure alert in #alert-container
   */
  function showAlert(message, success) {
    const alertDiv = document.createElement("div");
    alertDiv.classList.add(
      "alert",
      success ? "alert-success" : "alert-danger"
    );
    alertDiv.setAttribute("role", "alert");
    alertDiv.textContent = message;
    alertContainer.appendChild(alertDiv);

    // setTimeout(() => {
    //   alertDiv.remove();
    // }, 3000);
  }
});
