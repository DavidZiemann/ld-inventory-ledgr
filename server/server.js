/**
 * server.js
 *
 * Primary Express server for toggling feature flags by calling specific on/off
 * endpoints. This file reads a "triggersConfig" object to determine which URL
 * to call based on the flag name and availability status.
 */

const express = require("express");
const cors = require("cors");
const triggersConfig = require("./triggersConfig");

/**
 * NOTE: If you're on Node 18+ or 20+, a global `fetch` is available.
 * If you prefer node-fetch or need broader compatibility, install and import it:
 *   const fetch = require("node-fetch");
 *
 * For simplicity here, we'll use the global fetch assumption.
 */

const app = express();
const PORT = 4000;

app.use(cors()); // Allow requests from different origins (e.g., localhost:3000).
app.use(express.json()); // Parse JSON request bodies.

/**
 * POST /api/toggle
 *
 * Expects JSON of shape: { flag: string, isAvailable: boolean }
 * Determines the correct endpoint from triggersConfig and calls it with a POST.
 */
app.post("/api/toggle", async (req, res) => {
  try {
    const { flag, isAvailable } = req.body;

    // Validate request body
    if (!flag || typeof isAvailable !== "boolean") {
      return res
        .status(400)
        .json({ success: false, error: "Missing or invalid flag or status" });
    }

    // Lookup the relevant endpoint config
    const flagConfig = triggersConfig[flag];
    if (!flagConfig) {
      return res
        .status(400)
        .json({ success: false, error: `Unknown flag: ${flag}` });
    }

    // Choose the 'on' or 'off' URL based on 'isAvailable'
    const url = isAvailable ? flagConfig.on : flagConfig.off;

    // Call LD service to toggle the flag
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flag, isAvailable }),
    });

    // If LD doesn't respond with 2xx, throw an error
    if (!response.ok) {
      throw new Error(
        `Upstream error: ${response.status} ${response.statusText}`
      );
    }

    return res.json({
      success: true,
      message: `Flag "${flag}" is now ${
        isAvailable ? "available" : "unavailable"
      }`,
    });
  } catch (error) {
    console.error("Error toggling flag:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
