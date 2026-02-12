const { CosmosClient } = require("@azure/cosmos");
const config = require("../config/config");
const logger = require("../utils/logger");
const ApiError = require("../utils/ApiError");

class CosmosService {
  constructor() {
    this.client = null;
    this.database = null;
    this.containers = {};
  }

  async initialize() {
    if (!config.cosmos.endpoint || !config.cosmos.key) {
      const message =
        "Cosmos DB configuration missing (endpoint or key not found)";
      logger.error(`❌ ${message}`);

      if (config.nodeEnv === "production") {
        throw new Error(
          "Cosmos DB credentials required in production environment"
        );
      }

      logger.warn(
        "⚠️  Running in DEVELOPMENT mode without Cosmos DB - mock data will be used"
      );
      return;
    }

    try {
      this.client = new CosmosClient({
        endpoint: config.cosmos.endpoint,
        key: config.cosmos.key,
      });

      this.database = this.client.database(config.cosmos.databaseName);

      // Initialize containers
      this.containers.github = this.database.container(
        config.cosmos.containers.github
      );
      this.containers.hackerNews = this.database.container(
        config.cosmos.containers.hackerNews
      );
      this.containers.metadata = this.database.container(
        config.cosmos.containers.metadata
      );

      // Verify connection
      await this.database.read();
      logger.info("✅ Cosmos DB initialized and connected successfully");
    } catch (error) {
      logger.error("❌ Failed to initialize Cosmos DB:", error.message);

      if (config.nodeEnv === "production") {
        throw error;
      }

      logger.warn(
        "⚠️  Cosmos DB connection failed - running in mock mode for development"
      );
      this.client = null;
    }
  }

  async getTrendingItems(filters) {
    if (!this.client) {
      if (config.nodeEnv === "production") {
        throw new ApiError(503, "Database service unavailable");
      }
      logger.warn("⚠️  USING MOCK DATA - Cosmos DB not connected");
      return this._getMockData(filters);
    }

    try {
      const { limit, source, date, sort } = filters;

      let container;
      if (source === "github") {
        container = this.containers.github;
      } else if (source === "hackernews") {
        container = this.containers.hackerNews;
      }

      if (container) {
        const querySpec = {
          query: `SELECT TOP @limit * FROM c ORDER BY c.timestamp DESC`,
          parameters: [{ name: "@limit", value: limit }],
        };

        const { resources } = await container.items.query(querySpec).fetchAll();
        return resources;
      } else {
        // Fetch from both containers
        const githubQuery = this.containers.github.items
          .query({
            query: `SELECT TOP @limit * FROM c ORDER BY c.timestamp DESC`,
            parameters: [{ name: "@limit", value: Math.floor(limit / 2) }],
          })
          .fetchAll();

        const hackerNewsQuery = this.containers.hackerNews.items
          .query({
            query: `SELECT TOP @limit * FROM c ORDER BY c.timestamp DESC`,
            parameters: [{ name: "@limit", value: Math.ceil(limit / 2) }],
          })
          .fetchAll();

        const [githubData, hackerNewsData] = await Promise.all([
          githubQuery,
          hackerNewsQuery,
        ]);

        return [...githubData.resources, ...hackerNewsData.resources];
      }
    } catch (error) {
      logger.error("Error fetching trending items:", error.message);
      throw new ApiError(
        500,
        `Failed to fetch trending items: ${error.message}`
      );
    }
  }

  async createItem(containerName, item) {
    if (!this.client) {
      if (config.nodeEnv === "production") {
        throw new ApiError(503, "Database service unavailable");
      }
      logger.warn(
        "⚠️  Mock mode: Item would be created:",
        item.id || "unknown"
      );
      return item;
    }

    try {
      const container = this.containers[containerName];
      // Use upsert instead of create to handle duplicates
      const { resource } = await container.items.upsert(item);
      logger.info(`Item upserted in ${containerName}:`, resource.id);
      return resource;
    } catch (error) {
      logger.error(`Error upserting item in ${containerName}:`, error.message);
      throw error;
    }
  }

  async upsertBatch(containerName, items) {
    if (!this.client) {
      if (config.nodeEnv === "production") {
        throw new ApiError(503, "Database service unavailable");
      }
      logger.warn("⚠️  Mock mode: Batch would be upserted:", items.length);
      return items;
    }

    try {
      const container = this.containers[containerName];
      const results = [];
      let successCount = 0;
      let failCount = 0;

      for (const item of items) {
        try {
          const { resource } = await container.items.upsert(item);
          results.push(resource);
          successCount++;
        } catch (error) {
          logger.warn(`Failed to upsert item ${item.id}:`, error.message);
          failCount++;
        }
      }

      logger.info(
        `Batch upsert completed for ${containerName}: ${successCount} success, ${failCount} failed`
      );
      return results;
    } catch (error) {
      logger.error(
        `Error in batch upsert for ${containerName}:`,
        error.message
      );
      throw error;
    }
  }

  async getSourceAnalytics(source, range = "month") {
    const containerName =
      source === "github" ? "github" : "hackerNews";
    
    if (!this.client) {
      return this._getMockSourceAnalytics(source);
    }

    const container = this.containers[containerName];

    try {
      // Query all items for the source
      const querySpec = {
        query: "SELECT * FROM c",
        parameters: [],
      };

      const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll();

      // Calculate analytics
      const totalItems = items.length;

      let avgStars = null;
      let avgPoints = null;
      let topLanguages = [];

      if (source === "github") {
        // Calculate average stars
        const totalStars = items.reduce(
          (sum, item) => sum + (item.stars || 0),
          0
        );
        avgStars = totalItems > 0 ? Math.round(totalStars / totalItems) : 0;

        // Get top languages
        const languageCounts = {};
        items.forEach((item) => {
          if (item.language) {
            languageCounts[item.language] =
              (languageCounts[item.language] || 0) + 1;
          }
        });

        topLanguages = Object.entries(languageCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([lang]) => lang);
      } else if (source === "hackernews") {
        // Calculate average points
        const totalPoints = items.reduce(
          (sum, item) => sum + (item.points || 0),
          0
        );
        avgPoints = totalItems > 0 ? Math.round(totalPoints / totalItems) : 0;
      }

      logger.info(
        `Analytics for ${source}: ${totalItems} items, avgStars: ${avgStars}, languages: ${topLanguages.length}`
      );

      return {
        source,
        totalItems,
        avgStars,
        avgPoints,
        topLanguages,
        growthTrend: "increasing",
      };
    } catch (error) {
      logger.error(
        `Error getting ${source} analytics from Cosmos DB: ${
          error.message || error
        }`
      );
      return this._getMockSourceAnalytics(source);
    }
  }

  async getDetailedAnalytics(range = "month") {
    if (!this.client) {
      return this._getMockDetailedAnalytics();
    }

    try {
      // Query both GitHub and HackerNews containers
      const githubQuery = this.containers.github.items
        .query({ query: "SELECT * FROM c" })
        .fetchAll();
      const hackerNewsQuery = this.containers.hackerNews.items
        .query({ query: "SELECT * FROM c" })
        .fetchAll();

      const [githubData, hackerNewsData] = await Promise.all([
        githubQuery,
        hackerNewsQuery,
      ]);

      const githubItems = githubData.resources;
      const hackerNewsItems = hackerNewsData.resources;

      // Calculate language statistics
      const languageCounts = {};
      const languageStars = {};

      githubItems.forEach((item) => {
        if (item.language) {
          languageCounts[item.language] =
            (languageCounts[item.language] || 0) + 1;
          languageStars[item.language] =
            (languageStars[item.language] || 0) + (item.stars || 0);
        }
      });

      const languageStats = Object.entries(languageCounts)
        .map(([language, count]) => ({
          language,
          count,
          stars: languageStars[language] || 0,
          avgStars: Math.round(languageStars[language] / count) || 0,
          percentage: Math.round((count / githubItems.length) * 100 * 10) / 10,
        }))
        .sort((a, b) => b.count - a.count);

      // Calculate GitHub stats
      const totalGithubStars = githubItems.reduce(
        (sum, item) => sum + (item.stars || 0),
        0
      );
      const totalGithubForks = githubItems.reduce(
        (sum, item) => sum + (item.forks || 0),
        0
      );
      const avgGithubStars = Math.round(
        totalGithubStars / githubItems.length
      );

      // Calculate HackerNews stats
      const totalHNPoints = hackerNewsItems.reduce(
        (sum, item) => sum + (item.points || 0),
        0
      );
      const totalHNComments = hackerNewsItems.reduce(
        (sum, item) => sum + (item.comments || 0),
        0
      );
      const avgHNPoints = Math.round(totalHNPoints / hackerNewsItems.length);

      return {
        totalItems: githubItems.length + hackerNewsItems.length,
        githubCount: githubItems.length,
        hackerNewsCount: hackerNewsItems.length,
        avgPopularity: Math.round((avgGithubStars + avgHNPoints) / 2),
        languageStats: languageStats.slice(0, 10),
        githubStats: {
          totalRepositories: githubItems.length,
          totalStars: totalGithubStars,
          totalForks: totalGithubForks,
          avgStars: avgGithubStars,
          topLanguages: languageStats.slice(0, 5).map((l) => l.language),
        },
        hackerNewsStats: {
          totalStories: hackerNewsItems.length,
          totalPoints: totalHNPoints,
          totalComments: totalHNComments,
          avgPoints: avgHNPoints,
          avgComments: Math.round(totalHNComments / hackerNewsItems.length),
        },
      };
    } catch (error) {
      logger.error(
        `Error getting detailed analytics: ${error.message || error}`
      );
      return this._getMockDetailedAnalytics();
    }
  }

  _getMockSourceAnalytics(source) {
    return {
      source,
      totalItems: source === "github" ? 1234 : 567,
      avgStars: source === "github" ? 5000 : null,
      avgPoints: source === "hackernews" ? 150 : null,
      topLanguages: source === "github" ? ["JavaScript", "Python", "Go"] : [],
      growthTrend: "stable",
    };
  }

  _getMockDetailedAnalytics() {
    return {
      totalItems: 1801,
      githubCount: 1234,
      hackerNewsCount: 567,
      avgPopularity: 2575,
      languageStats: [
        { language: "JavaScript", count: 250, stars: 1000000, avgStars: 4000, percentage: 20.2 },
        { language: "Python", count: 200, stars: 800000, avgStars: 4000, percentage: 16.2 },
        { language: "TypeScript", count: 150, stars: 600000, avgStars: 4000, percentage: 12.2 },
        { language: "Go", count: 100, stars: 400000, avgStars: 4000, percentage: 8.1 },
        { language: "Rust", count: 80, stars: 320000, avgStars: 4000, percentage: 6.5 },
      ],
      githubStats: {
        totalRepositories: 1234,
        totalStars: 5000000,
        totalForks: 500000,
        avgStars: 4052,
        topLanguages: ["JavaScript", "Python", "TypeScript", "Go", "Rust"],
      },
      hackerNewsStats: {
        totalStories: 567,
        totalPoints: 85000,
        totalComments: 28000,
        avgPoints: 150,
        avgComments: 49,
      },
    };
  }

  async healthCheck() {
    if (!this.client) {
      return false;
    }

    try {
      await this.database.read();
      return true;
    } catch (error) {
      logger.error("Cosmos DB health check failed:", error.message);
      return false;
    }
  }

  _getMockData(filters) {
    logger.warn(
      "⚠️  Generating mock data - this should only happen in development!"
    );

    const { limit = 10, source } = filters;
    const mockItems = [];

    const generateGitHubItem = (i) => ({
      id: `github-mock-${i}`,
      source: "github",
      repository: `MOCK-trending-repo-${i}`,
      description: `[MOCK DATA] A trending repository about awesome technology ${i}`,
      stars: Math.floor(Math.random() * 50000) + 1000,
      forks: Math.floor(Math.random() * 5000) + 100,
      language: ["JavaScript", "Python", "Go", "TypeScript", "Rust"][i % 5],
      url: `https://github.com/mock-user/mock-repo-${i}`,
      timestamp: new Date().toISOString(),
      _isMockData: true,
    });

    const generateHackerNewsItem = (i) => ({
      id: `hn-mock-${i}`,
      source: "hackernews",
      title: `[MOCK DATA] Interesting Tech Story ${i}`,
      points: Math.floor(Math.random() * 1000) + 50,
      comments: Math.floor(Math.random() * 500) + 10,
      author: `mockuser${i}`,
      url: `https://news.ycombinator.com/item?id=mock-${i}`,
      timestamp: new Date().toISOString(),
      _isMockData: true,
    });

    for (let i = 0; i < limit; i++) {
      if (!source || source === "github") {
        mockItems.push(generateGitHubItem(i));
      }
      if (!source || source === "hackernews") {
        mockItems.push(generateHackerNewsItem(i));
      }
    }

    return mockItems.slice(0, limit);
  }
}

const cosmosService = new CosmosService();
module.exports = cosmosService;
