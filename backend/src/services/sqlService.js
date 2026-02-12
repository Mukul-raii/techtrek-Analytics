const sql = require("mssql");
const config = require("../config/config");
const logger = require("../utils/logger");

class SQLService {
  constructor() {
    this.pool = null;
  }

  async initialize() {
    // Check if SQL is explicitly disabled
    if (config.sql.enabled === false) {
      logger.info("⚠️  SQL Database disabled via configuration");
      return;
    }

    if (!config.sql.server || !config.sql.database) {
      logger.warn("⚠️  Azure SQL configuration missing. Running in mock mode.");
      return;
    }

    try {
      this.pool = await sql.connect(config.sql);
      logger.info("✅ Azure SQL Database connected successfully");
    } catch (error) {
      logger.error("❌ Failed to connect to Azure SQL:", error.message);
      logger.warn("⚠️  Continuing without SQL database - using mock data");
      // Don't throw - allow app to continue with mock data
      this.pool = null;
    }
  }

  async getOverallAnalytics(range) {
    if (!this.pool) {
      return this._getMockAnalytics(range);
    }

    try {
      const result = await this.pool
        .request()
        .input("range", sql.VarChar, range).query(`
          SELECT 
            COUNT(*) as totalItems,
            SUM(CASE WHEN source = 'github' THEN 1 ELSE 0 END) as githubCount,
            SUM(CASE WHEN source = 'hackernews' THEN 1 ELSE 0 END) as hackerNewsCount,
            AVG(popularity_score) as avgPopularity
          FROM DailyMetrics
          WHERE date >= DATEADD(day, -30, GETDATE())
        `);

      return result.recordset[0];
    } catch (error) {
      logger.error("Error fetching overall analytics:", error.message);
      return this._getMockAnalytics(range);
    }
  }

  async getDailyMetrics(range, source) {
    if (!this.pool) {
      return this._getMockDailyMetrics(range, source);
    }

    try {
      const days = range === "week" ? 7 : range === "month" ? 30 : 365;

      const query = source
        ? `SELECT * FROM DailyMetrics WHERE source = @source AND date >= DATEADD(day, -@days, GETDATE()) ORDER BY date DESC`
        : `SELECT * FROM DailyMetrics WHERE date >= DATEADD(day, -@days, GETDATE()) ORDER BY date DESC`;

      const request = this.pool.request().input("days", sql.Int, days);
      if (source) {
        request.input("source", sql.VarChar, source);
      }

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      logger.error("Error fetching daily metrics:", error.message);
      return this._getMockDailyMetrics(range, source);
    }
  }

  async getSourceAnalytics(source, range) {
    if (!this.pool) {
      return this._getMockSourceAnalytics(source, range);
    }

    try {
      const result = await this.pool
        .request()
        .input("source", sql.VarChar, source).query(`
          SELECT * FROM SourceStats 
          WHERE source = @source 
          ORDER BY date DESC
        `);

      return result.recordset[0] || {};
    } catch (error) {
      logger.error("Error fetching source analytics:", error.message);
      return this._getMockSourceAnalytics(source, range);
    }
  }

  async healthCheck() {
    if (!this.pool) {
      return false;
    }

    try {
      await this.pool.request().query("SELECT 1");
      return true;
    } catch (error) {
      logger.error("SQL health check failed:", error.message);
      return false;
    }
  }

  _getMockAnalytics(range) {
    return {
      totalItems: 1234,
      githubCount: 567,
      hackerNewsCount: 667,
      avgPopularity: 8.5,
    };
  }

  _getMockDailyMetrics(range, source) {
    const days = range === "week" ? 7 : range === "month" ? 30 : 365;
    const metrics = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      metrics.push({
        date: date.toISOString().split("T")[0],
        source: source || "all",
        itemCount: Math.floor(Math.random() * 100) + 50,
        popularityScore: (Math.random() * 10).toFixed(2),
      });
    }

    return metrics;
  }

  _getMockSourceAnalytics(source, range) {
    return {
      source,
      totalItems: Math.floor(Math.random() * 1000) + 500,
      avgStars:
        source === "github" ? Math.floor(Math.random() * 10000) + 1000 : null,
      avgPoints:
        source === "hackernews" ? Math.floor(Math.random() * 500) + 100 : null,
      topLanguages: source === "github" ? ["JavaScript", "Python", "Go"] : null,
      growthTrend: "increasing",
    };
  }

  async close() {
    if (this.pool) {
      await this.pool.close();
      logger.info("SQL connection closed");
    }
  }
}

const sqlService = new SQLService();
module.exports = sqlService;
