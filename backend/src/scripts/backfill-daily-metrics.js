const sql = require("mssql");
const config = require("../config/config");
const cosmosService = require("../services/cosmosService");
const logger = require("../utils/logger");

function parseDaysArg() {
  const arg = process.argv.find((entry) => entry.startsWith("--days="));
  if (!arg) return 90;
  const value = Number(arg.split("=")[1]);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 90;
}

function toDateKey(input) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0];
}

function getTimestamp(item) {
  return (
    item.timestamp ||
    item.createdAt ||
    item.updatedAt ||
    item.created_at ||
    item.time ||
    null
  );
}

async function fetchItems(container, cutoffIso) {
  const querySpec = {
    query:
      "SELECT c.id, c.timestamp, c.createdAt, c.updatedAt, c.created_at, c.time, c.stars, c.points FROM c WHERE (IS_DEFINED(c.timestamp) AND c.timestamp >= @cutoff) OR (IS_DEFINED(c.createdAt) AND c.createdAt >= @cutoff) OR (IS_DEFINED(c.updatedAt) AND c.updatedAt >= @cutoff)",
    parameters: [{ name: "@cutoff", value: cutoffIso }],
  };

  const { resources } = await container.items.query(querySpec).fetchAll();
  return resources;
}

async function upsertDailyMetric(pool, metric) {
  const query = `
    MERGE INTO DailyMetrics AS target
    USING (SELECT @date AS date, @source AS source) AS source_table
    ON target.date = source_table.date AND target.source = source_table.source
    WHEN MATCHED THEN
      UPDATE SET 
        item_count = @item_count,
        popularity_score = @popularity_score
    WHEN NOT MATCHED THEN
      INSERT (date, source, item_count, popularity_score)
      VALUES (@date, @source, @item_count, @popularity_score);
  `;

  await pool
    .request()
    .input("date", sql.Date, metric.date)
    .input("source", sql.VarChar(50), metric.source)
    .input("item_count", sql.Int, metric.item_count)
    .input("popularity_score", sql.Decimal(10, 2), metric.popularity_score)
    .query(query);
}

async function main() {
  const days = parseDaysArg();
  const cutoff = new Date();
  cutoff.setUTCHours(0, 0, 0, 0);
  cutoff.setUTCDate(cutoff.getUTCDate() - (days - 1));
  const cutoffIso = cutoff.toISOString();

  logger.info(`Backfilling DailyMetrics for last ${days} days (from ${cutoffIso})`);

  if (config.sql.enabled === false) {
    throw new Error("SQL is disabled. Set ENABLE_SQL=true first.");
  }

  await cosmosService.initialize();
  const pool = await sql.connect(config.sql);

  try {
    const [githubItems, hackerNewsItems] = await Promise.all([
      fetchItems(cosmosService.containers.github, cutoffIso),
      fetchItems(cosmosService.containers.hackerNews, cutoffIso),
    ]);

    const aggregate = new Map();

    const addItem = (source, dateKey, popularity) => {
      if (!dateKey || dateKey < cutoffIso.split("T")[0]) return;
      const key = `${source}|${dateKey}`;
      const existing = aggregate.get(key) || {
        source,
        date: dateKey,
        count: 0,
        popularitySum: 0,
      };
      existing.count += 1;
      existing.popularitySum += popularity;
      aggregate.set(key, existing);
    };

    githubItems.forEach((item) => {
      const dateKey = toDateKey(getTimestamp(item));
      addItem("github", dateKey, Number(item.stars || 0));
    });

    hackerNewsItems.forEach((item) => {
      const dateKey = toDateKey(getTimestamp(item));
      addItem("hackernews", dateKey, Number(item.points || 0));
    });

    const metrics = Array.from(aggregate.values()).map((entry) => ({
      source: entry.source,
      date: entry.date,
      item_count: entry.count,
      popularity_score:
        entry.count > 0
          ? parseFloat((entry.popularitySum / entry.count).toFixed(2))
          : 0,
    }));

    for (const metric of metrics) {
      await upsertDailyMetric(pool, metric);
    }

    logger.info(`Backfill complete. Upserted ${metrics.length} daily metric rows.`);
  } finally {
    await pool.close();
  }
}

main().catch((error) => {
  logger.error(`Backfill failed: ${error.message}`);
  process.exit(1);
});
