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
          ORDER BY last_updated DESC
        `);

      return result.recordset[0] || {};
    } catch (error) {
      logger.error("Error fetching source analytics:", error.message);
      return this._getMockSourceAnalytics(source, range);
    }
  }

  async getTrendingTopics(source = null, limit = 20) {
    if (!this.pool) {
      return this._getMockTrendingTopics(source, limit);
    }

    try {
      const query = source
        ? `SELECT TOP (@limit) topic, source, frequency, last_seen 
           FROM TrendingTopics 
           WHERE source = @source 
           ORDER BY frequency DESC`
        : `SELECT TOP (@limit) topic, source, frequency, last_seen 
           FROM TrendingTopics 
           ORDER BY frequency DESC`;

      const request = this.pool.request().input("limit", sql.Int, limit);
      if (source) {
        request.input("source", sql.VarChar, source);
      }

      const result = await request.query(query);
      return result.recordset;
    } catch (error) {
      logger.error("Error fetching trending topics:", error.message);
      return this._getMockTrendingTopics(source, limit);
    }
  }

  async getGrowthMetrics(source, days = 7) {
    if (!this.pool) {
      return this._getMockGrowthMetrics(source, days);
    }

    try {
      // Get metrics for the specified time period
      const result = await this.pool
        .request()
        .input("source", sql.VarChar, source)
        .input("days", sql.Int, days).query(`
          SELECT 
            date,
            source,
            item_count,
            popularity_score,
            created_at
          FROM DailyMetrics
          WHERE source = @source
            AND date >= DATEADD(day, -@days, GETDATE())
          ORDER BY date DESC
        `);

      const metrics = result.recordset;

      if (metrics.length < 2) {
        return {
          currentValue: metrics[0]?.popularity_score || 0,
          previousValue: 0,
          change: 0,
          changePercent: 0,
          trend: "stable",
          itemsToday: metrics[0]?.item_count || 0,
          itemsYesterday: 0,
        };
      }

      // Calculate growth from most recent to previous day
      const today = metrics[0];
      const yesterday = metrics[1];

      const change = today.popularity_score - yesterday.popularity_score;
      const changePercent =
        yesterday.popularity_score > 0
          ? ((change / yesterday.popularity_score) * 100).toFixed(2)
          : 0;

      const itemChange = today.item_count - yesterday.item_count;

      return {
        currentValue: today.popularity_score,
        previousValue: yesterday.popularity_score,
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent),
        trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
        itemsToday: today.item_count,
        itemsYesterday: yesterday.item_count,
        itemChange: itemChange,
        metrics: metrics, // Return all metrics for charting
      };
    } catch (error) {
      logger.error("Error fetching growth metrics:", error.message);
      return this._getMockGrowthMetrics(source, days);
    }
  }

  async getLanguageGrowth(days = 7) {
    if (!this.pool) {
      return this._getMockLanguageGrowth(days);
    }

    try {
      // Get current and previous language stats
      const result = await this.pool.request().query(`
        SELECT TOP 2 
          metadata,
          last_updated
        FROM SourceStats
        WHERE source = 'github'
        ORDER BY last_updated DESC
      `);

      if (result.recordset.length < 2) {
        return [];
      }

      const current = JSON.parse(result.recordset[0].metadata);
      const previous = JSON.parse(result.recordset[1].metadata);

      const currentLangs = current.topLanguages || [];
      const previousLangs = previous.topLanguages || [];

      // Calculate growth for each language
      return currentLangs.map((lang) => {
        const prevLang = previousLangs.find(
          (l) => l.language === lang.language
        );
        const prevCount = prevLang ? prevLang.count : 0;
        const change = lang.count - prevCount;
        const changePercent =
          prevCount > 0
            ? ((change / prevCount) * 100).toFixed(2)
            : lang.count > 0
            ? 100
            : 0;

        return {
          ...lang,
          previousCount: prevCount,
          change: change,
          changePercent: parseFloat(changePercent),
          trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
        };
      });
    } catch (error) {
      logger.error("Error fetching language growth:", error.message);
      return this._getMockLanguageGrowth(days);
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

  _getMockTrendingTopics(source, limit) {
    const topics = [
      "javascript",
      "python",
      "machine-learning",
      "ai",
      "typescript",
      "react",
      "nodejs",
      "devops",
      "docker",
      "kubernetes",
      "aws",
      "cloud",
      "backend",
      "frontend",
      "api",
    ];

    return topics.slice(0, limit).map((topic, index) => ({
      topic,
      source: source || "github",
      frequency: Math.floor(Math.random() * 20) + 5,
      last_seen: new Date().toISOString(),
    }));
  }

  _getMockGrowthMetrics(source, days) {
    const currentValue = source === "github" ? 110000 : 200;
    const previousValue = source === "github" ? 105000 : 190;
    const change = currentValue - previousValue;
    const changePercent = ((change / previousValue) * 100).toFixed(2);

    return {
      currentValue,
      previousValue,
      change,
      changePercent: parseFloat(changePercent),
      trend: change > 0 ? "up" : "down",
      itemsToday: source === "github" ? 70 : 75,
      itemsYesterday: source === "github" ? 66 : 71,
      itemChange: 4,
    };
  }

  _getMockLanguageGrowth(days) {
    return [
      {
        language: "Python",
        count: 17,
        previousCount: 15,
        change: 2,
        changePercent: 13.33,
        trend: "up",
      },
      {
        language: "TypeScript",
        count: 16,
        previousCount: 14,
        change: 2,
        changePercent: 14.29,
        trend: "up",
      },
      {
        language: "JavaScript",
        count: 7,
        previousCount: 8,
        change: -1,
        changePercent: -12.5,
        trend: "down",
      },
    ];
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
