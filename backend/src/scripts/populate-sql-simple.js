/**
 * Populate Azure SQL Tables (Based on ACTUAL Schema)
 *
 * Tables to populate:
 * 1. DailyMetrics (date, source, item_count, popularity_score)
 * 2. SourceStats (source, total_items, avg_popularity, metadata)
 * 3. TrendingTopics (topic, source, frequency)
 *
 * Usage: npm run populate-sql-simple
 */

const sql = require("mssql");
const config = require("../config/config");
const cosmosService = require("../services/cosmosService");
const logger = require("../utils/logger");

class SimpleSQLPopulation {
  constructor() {
    this.pool = null;
  }

  async initialize() {
    await cosmosService.initialize();

    if (config.sql.enabled === false) {
      throw new Error("SQL Database is disabled. Set SQL_ENABLED=true");
    }

    this.pool = await sql.connect(config.sql);
    logger.info("✅ Connected to Azure SQL Database");
  }

  async populateAll() {
    logger.info("🚀 Starting SQL table population...\n");

    await this.populateDailyMetrics();
    await this.populateSourceStats();
    await this.populateTrendingTopics();

    logger.info("\n✅ ===== POPULATION COMPLETE ===== ✅");
  }

  /**
   * Populate DailyMetrics table
   * Schema: id, date, source, item_count, popularity_score, created_at
   */
  async populateDailyMetrics() {
    logger.info("📊 Populating DailyMetrics...");

    try {
      // Fetch GitHub data
      const githubQuery = cosmosService.containers.github.items
        .query({ query: 'SELECT * FROM c WHERE c.source = "github"' })
        .fetchAll();

      // Fetch HackerNews data
      const hackerNewsQuery = cosmosService.containers.hackerNews.items
        .query({ query: 'SELECT * FROM c WHERE c.source = "hackernews"' })
        .fetchAll();

      const [githubData, hackerNewsData] = await Promise.all([
        githubQuery,
        hackerNewsQuery,
      ]);

      const today = new Date().toISOString().split("T")[0];

      // GitHub metrics
      const githubCount = githubData.resources.length;
      const githubAvgStars =
        githubCount > 0
          ? githubData.resources.reduce((sum, r) => sum + (r.stars || 0), 0) /
            githubCount
          : 0;

      await this._upsertDailyMetric({
        date: today,
        source: "github",
        item_count: githubCount,
        popularity_score: parseFloat(githubAvgStars.toFixed(2)),
      });

      // HackerNews metrics
      const hnCount = hackerNewsData.resources.length;
      const hnAvgPoints =
        hnCount > 0
          ? hackerNewsData.resources.reduce(
              (sum, r) => sum + (r.points || 0),
              0
            ) / hnCount
          : 0;

      await this._upsertDailyMetric({
        date: today,
        source: "hackernews",
        item_count: hnCount,
        popularity_score: parseFloat(hnAvgPoints.toFixed(2)),
      });

      logger.info(
        `   ✅ GitHub: ${githubCount} items, avg ${githubAvgStars.toFixed(
          0
        )} stars`
      );
      logger.info(
        `   ✅ HackerNews: ${hnCount} items, avg ${hnAvgPoints.toFixed(
          0
        )} points`
      );
    } catch (error) {
      logger.error("❌ Error populating DailyMetrics:", error.message);
      throw error;
    }
  }

  /**
   * Populate SourceStats table
   * Schema: id, source, total_items, avg_popularity, last_updated, metadata
   */
  async populateSourceStats() {
    logger.info("\n📊 Populating SourceStats...");

    try {
      // GitHub stats
      const githubQuery = cosmosService.containers.github.items
        .query({ query: 'SELECT * FROM c WHERE c.source = "github"' })
        .fetchAll();

      const githubData = await githubQuery;
      const githubCount = githubData.resources.length;
      const githubAvgStars =
        githubCount > 0
          ? githubData.resources.reduce((sum, r) => sum + (r.stars || 0), 0) /
            githubCount
          : 0;

      // Count languages
      const languages = {};
      githubData.resources.forEach((r) => {
        if (r.language) {
          languages[r.language] = (languages[r.language] || 0) + 1;
        }
      });

      const topLanguages = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([lang, count]) => ({ language: lang, count }));

      await this._upsertSourceStat({
        source: "github",
        total_items: githubCount,
        avg_popularity: parseFloat(githubAvgStars.toFixed(2)),
        metadata: JSON.stringify({ topLanguages }),
      });

      logger.info(
        `   ✅ GitHub: ${githubCount} repos, ${
          Object.keys(languages).length
        } languages`
      );

      // HackerNews stats
      const hnQuery = cosmosService.containers.hackerNews.items
        .query({ query: 'SELECT * FROM c WHERE c.source = "hackernews"' })
        .fetchAll();

      const hnData = await hnQuery;
      const hnCount = hnData.resources.length;
      const hnAvgPoints =
        hnCount > 0
          ? hnData.resources.reduce((sum, r) => sum + (r.points || 0), 0) /
            hnCount
          : 0;

      await this._upsertSourceStat({
        source: "hackernews",
        total_items: hnCount,
        avg_popularity: parseFloat(hnAvgPoints.toFixed(2)),
        metadata: JSON.stringify({ avgComments: 0 }),
      });

      logger.info(`   ✅ HackerNews: ${hnCount} stories`);
    } catch (error) {
      logger.error("❌ Error populating SourceStats:", error.message);
      throw error;
    }
  }

  /**
   * Populate TrendingTopics table
   * Schema: id, topic, source, frequency, last_seen
   */
  async populateTrendingTopics() {
    logger.info("\n📊 Populating TrendingTopics...");

    try {
      // Get GitHub topics
      const githubQuery = cosmosService.containers.github.items
        .query({ query: 'SELECT * FROM c WHERE c.source = "github"' })
        .fetchAll();

      const githubData = await githubQuery;

      // Count topics
      const topicCounts = {};
      githubData.resources.forEach((repo) => {
        if (repo.topics && Array.isArray(repo.topics)) {
          repo.topics.forEach((topic) => {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
          });
        }
      });

      // Insert top 20 topics
      const topTopics = Object.entries(topicCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20);

      let insertedCount = 0;
      for (const [topic, frequency] of topTopics) {
        await this._upsertTrendingTopic({
          topic,
          source: "github",
          frequency,
        });
        insertedCount++;
      }

      logger.info(`   ✅ Inserted ${insertedCount} trending topics`);
    } catch (error) {
      logger.error("❌ Error populating TrendingTopics:", error.message);
      throw error;
    }
  }

  /**
   * Upsert DailyMetric record
   */
  async _upsertDailyMetric(metric) {
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

    await this.pool
      .request()
      .input("date", sql.Date, metric.date)
      .input("source", sql.VarChar(50), metric.source)
      .input("item_count", sql.Int, metric.item_count)
      .input("popularity_score", sql.Decimal(10, 2), metric.popularity_score)
      .query(query);
  }

  /**
   * Upsert SourceStat record
   */
  async _upsertSourceStat(stat) {
    const query = `
      MERGE INTO SourceStats AS target
      USING (SELECT @source AS source) AS source_table
      ON target.source = source_table.source
      WHEN MATCHED THEN
        UPDATE SET 
          total_items = @total_items,
          avg_popularity = @avg_popularity,
          last_updated = GETDATE(),
          metadata = @metadata
      WHEN NOT MATCHED THEN
        INSERT (source, total_items, avg_popularity, last_updated, metadata)
        VALUES (@source, @total_items, @avg_popularity, GETDATE(), @metadata);
    `;

    await this.pool
      .request()
      .input("source", sql.VarChar(50), stat.source)
      .input("total_items", sql.Int, stat.total_items)
      .input("avg_popularity", sql.Decimal(10, 2), stat.avg_popularity)
      .input("metadata", sql.NVarChar(sql.MAX), stat.metadata)
      .query(query);
  }

  /**
   * Upsert TrendingTopic record
   */
  async _upsertTrendingTopic(topic) {
    const query = `
      MERGE INTO TrendingTopics AS target
      USING (SELECT @topic AS topic, @source AS source) AS source_table
      ON target.topic = source_table.topic AND target.source = source_table.source
      WHEN MATCHED THEN
        UPDATE SET 
          frequency = @frequency,
          last_seen = GETDATE()
      WHEN NOT MATCHED THEN
        INSERT (topic, source, frequency, last_seen)
        VALUES (@topic, @source, @frequency, GETDATE());
    `;

    await this.pool
      .request()
      .input("topic", sql.VarChar(100), topic.topic)
      .input("source", sql.VarChar(50), topic.source)
      .input("frequency", sql.Int, topic.frequency)
      .query(query);
  }

  async close() {
    if (this.pool) {
      await this.pool.close();
    }
  }
}

/**
 * Main execution
 */
async function main() {
  const service = new SimpleSQLPopulation();

  try {
    await service.initialize();
    await service.populateAll();

    logger.info("\n🎉 Success! Your SQL tables now have data.");
    logger.info("\n📊 Verify with:");
    logger.info("   SELECT * FROM DailyMetrics;");
    logger.info("   SELECT * FROM SourceStats;");
    logger.info(
      "   SELECT TOP 10 * FROM TrendingTopics ORDER BY frequency DESC;"
    );
  } catch (error) {
    logger.error("\n❌ Population failed:", error.message);
    process.exit(1);
  } finally {
    await service.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = SimpleSQLPopulation;
