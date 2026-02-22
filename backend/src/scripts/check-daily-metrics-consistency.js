const baseUrl = process.env.API_BASE_URL || "http://localhost:5000";
const ranges = ["week", "month", "year"];
const iterations = 10;

async function fetchRange(range) {
  const response = await fetch(
    `${baseUrl}/api/analytics/daily?range=${encodeURIComponent(range)}`
  );
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for range=${range}`);
  }
  return response.json();
}

function validatePayload(payload, range) {
  if (!payload || payload.status !== "success" || payload.range !== range) {
    throw new Error(`Invalid top-level payload for range=${range}`);
  }

  if (!Array.isArray(payload.data)) {
    throw new Error(`data is not an array for range=${range}`);
  }

  payload.data.forEach((row, index) => {
    const hasSnake =
      Object.prototype.hasOwnProperty.call(row, "item_count") &&
      Object.prototype.hasOwnProperty.call(row, "popularity_score");
    const hasCamel =
      Object.prototype.hasOwnProperty.call(row, "itemCount") ||
      Object.prototype.hasOwnProperty.call(row, "popularityScore");

    if (!hasSnake || hasCamel) {
      throw new Error(
        `Schema mismatch for range=${range}, row=${index}: expected snake_case only`
      );
    }
  });
}

async function main() {
  console.log(`Checking /api/analytics/daily consistency against ${baseUrl}`);

  for (const range of ranges) {
    for (let i = 0; i < iterations; i++) {
      const payload = await fetchRange(range);
      validatePayload(payload, range);
    }
    console.log(`✓ ${range}: ${iterations} consistent responses`);
  }

  console.log("All consistency checks passed.");
}

main().catch((error) => {
  console.error(`Consistency check failed: ${error.message}`);
  process.exit(1);
});
