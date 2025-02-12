const express = require("express");
const cors = require("cors");
const triggersConfig = require("./triggersConfig");

const app = express();
const PORT = 4000;

// If you need to allow requests from http://localhost:3000
app.use(cors());
app.use(express.json());

app.post("/api/toggle", async (req, res) => {
  try {
    const { flag, isAvailable } = req.body;
    if (!flag || typeof isAvailable !== "boolean") {
      return res
        .status(400)
        .json({ success: false, error: "Missing or invalid flag or status" });
    }

    // 1. Find this flag in our triggers config
    const flagConfig = triggersConfig[flag];
    if (!flagConfig) {
      return res
        .status(400)
        .json({ success: false, error: `Unknown flag: ${flag}` });
    }

    // 2. Pick the correct endpoint (on or off)
    const url = isAvailable ? flagConfig.on : flagConfig.off;

    // 3. Call the endpoint
    const response = await fetch(url, {
      method: "POST", // or GET, PUT, etc., depending on your endpoint
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flag, isAvailable }),
    });

    if (!response.ok) {
      throw new Error(
        `Upstream error: ${response.status} ${response.statusText}`
      );
    }

    // You could parse the response JSON if needed:
    // const data = await response.json();

    return res.json({
      success: true,
      message: `Flag "${flag}" ${isAvailable ? "available" : "unavailable"}`,
    });
  } catch (error) {
    console.error("Error toggling flag:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Express server on http://localhost:${PORT}`);
});
