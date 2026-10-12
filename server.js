// STAR Plus Matka — generic live-results backend
// Node.js 18+
// Install: npm install express
// Run: RESULT_API_URL="https://your-authorized-provider.example/api/results" npm start
// If the provider requires a secret, store it in RESULT_API_KEY (server-side only).
// IMPORTANT: Replace the placeholder URL and adapt normalizeResults() to the provider's documented schema.

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const RESULT_API_URL = process.env.RESULT_API_URL;
const RESULT_API_KEY = process.env.RESULT_API_KEY;

app.use(express.static("public"));

function normalizeResults(payload) {
  // Adapt this mapping to the API documentation for your permitted provider.
  // Expected frontend format: [{ name: "Game name", numbers: ["1","2","3"], updatedAt: "ISO date" }]
  if (!payload || !Array.isArray(payload.results)) {
    throw new Error("Unexpected provider response. Update normalizeResults() for the provider schema.");
  }
  return payload.results.map((row) => {
    if (typeof row.name !== "string" || !Array.isArray(row.numbers)) {
      throw new Error("Invalid result row from provider.");
    }
    const numbers = row.numbers.map(String);
    if (numbers.length < 1 || numbers.length > 5 || numbers.some(n => !/^\d{1,3}$/.test(n))) {
      throw new Error("Invalid number values from provider.");
    }
    return {
      name: row.name.slice(0, 80),
      numbers,
      updatedAt: row.updatedAt || payload.updatedAt || new Date().toISOString()
    };
  });
}

app.get("/api/results", async (_req, res) => {
  if (!RESULT_API_URL) {
    return res.status(503).json({
      error: "Live results are not configured. Set RESULT_API_URL to an authorized provider endpoint."
    });
  }
  try {
    const headers = { "Accept": "application/json" };
    if (RESULT_API_KEY) headers["Authorization"] = `Bearer ${RESULT_API_KEY}`;

    const response = await fetch(RESULT_API_URL, { headers, signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
      return res.status(502).json({ error: `Provider returned HTTP ${response.status}` });
    }
    const payload = await response.json();
    const results = normalizeResults(payload);
    res.set("Cache-Control", "no-store");
    res.json({ results, fetchedAt: new Date().toISOString(), source: "configured provider" });
  } catch (err) {
    console.error("Results provider error:", err.message);
    res.status(502).json({ error: "Could not retrieve verified results from the configured provider." });
  }
});

app.listen(PORT, () => console.log(`STAR Plus Matka demo running on http://localhost:${PORT}`));
