const axios = require("axios");
const config = require("../config/config");
const logger = require("../utils/logger");
const cosmosService = require("./cosmosService");

class IngestService {
  constructor() {
    this.lastIngestion = null;
    this.ingestionInProgress = false;
  }

  async ingestData(source) {
    if (this.ingestionInProgress) {
      logger.warn("Ingestion already in progress");
      return { status: "skipped", message: "Ingestion already in progress" };
    }

    this.ingestionInProgress = true;
    const startTime = Date.now();

    try {
      let result;

      if (source === "github" || source === "all") {
        result = await this.ingestGitHubData();
      }

      if (source === "hackernews" || source === "all") {
        result = await this.ingestHackerNewsData();
      }

      this.lastIngestion = {
        timestamp: new Date().toISOString(),
        source,
        status: "success",
        duration: Date.now() - startTime,
        itemsIngested: result?.count || 0,
      };

      logger.info(`Ingestion completed for ${source}:`, this.lastIngestion);
      return this.lastIngestion;
    } catch (error) {
      this.lastIngestion = {
        timestamp: new Date().toISOString(),
        source,
        status: "failed",
        duration: Date.now() - startTime,
        error: error.message,
      };

      logger.error(`Ingestion failed for ${source}:`, error.message);
      throw error;
    } finally {
      this.ingestionInProgress = false;
    }
  }

  async ingestGitHubData() {
    try {
      logger.info("Fetching GitHub trending repositories...");

      const headers = {};
      if (config.github.token) {
        headers.Authorization = `token ${config.github.token}`;
      }

      // Calculate date ranges for trending
      const now = new Date();
      const yesterday = new Date(now - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(now - 7 * 24 * 60 * 60 * 1000);

      // Format dates for GitHub API (YYYY-MM-DD)
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      const lastWeekStr = lastWeek.toISOString().split("T")[0];

      // Fetch trending repositories created recently (daily trending)
      const dailyResponse = await axios.get(
        `${config.github.apiUrl}/search/repositories`,
        {
          headers,
          params: {
            q: `created:>${yesterdayStr} stars:>10`,
            sort: "stars",
            order: "desc",
            per_page: 20,
          },
        }
      );

      // Fetch trending repositories from last week (weekly trending)
      const weeklyResponse = await axios.get(
        `${config.github.apiUrl}/search/repositories`,
        {
          headers,
          params: {
            q: `created:>${lastWeekStr} stars:>50`,
            sort: "stars",
            order: "desc",
            per_page: 20,
          },
        }
      );

      // Combine and deduplicate
      const allRepos = [
        ...dailyResponse.data.items,
        ...weeklyResponse.data.items,
      ];
      const uniqueRepos = Array.from(
        new Map(allRepos.map((repo) => [repo.id, repo])).values()
      );

      const repositories = uniqueRepos.slice(0, 30);
      logger.info(
        `Fetched ${repositories.length} GitHub trending repositories (daily + weekly)`
      );

      // Store in Cosmos DB
      const items = repositories.map((repo) => ({
        id: `github-${repo.id}`,
        source: "github",
        repository: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url,
        owner: repo.owner.login,
        owner_avatar_url: repo.owner.avatar_url, // ✅ NEW: Owner avatar for UI
        topics: repo.topics || [],
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        timestamp: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        partitionKey: "github",
      }));

      // Save to Cosmos DB using batch upsert
      const savedItems = await cosmosService.upsertBatch("github", items);

      logger.info(`Ingested ${savedItems.length} GitHub items`);
      return { count: savedItems.length, items: savedItems };
    } catch (error) {
      logger.error("Error ingesting GitHub data:", error.message);
      throw error;
    }
  }

  async ingestHackerNewsData() {
    try {
      logger.info("Fetching HackerNews top stories...");

      // Fetch top story IDs
      const topStoriesResponse = await axios.get(
        `${config.hackerNews.apiUrl}/topstories.json`
      );

      const storyIds = topStoriesResponse.data.slice(0, 30);
      logger.info(`Fetched ${storyIds.length} HackerNews story IDs`);

      // Fetch individual stories
      const storyPromises = storyIds.map((id) =>
        axios.get(`${config.hackerNews.apiUrl}/item/${id}.json`)
      );

      const stories = await Promise.all(storyPromises);

      const items = stories
        .map((response) => response.data)
        .filter((story) => story && story.type === "story")
        .map((story) => ({
          id: `hn-${story.id}`,
          source: "hackernews",
          title: story.title,
          url: story.url,
          type: story.type || "story", // ✅ NEW: Story type (story/ask/show/job)
          points: story.score,
          comments: story.descendants || 0,
          author: story.by,
          timestamp: new Date(story.time * 1000).toISOString(),
          partitionKey: "hackernews",
        }));

      // Save to Cosmos DB using batch upsert
      const savedItems = await cosmosService.upsertBatch("hackerNews", items);

      logger.info(`Ingested ${savedItems.length} HackerNews items`);
      return { count: savedItems.length, items: savedItems };
    } catch (error) {
      logger.error("Error ingesting HackerNews data:", error.message);
      throw error;
    }
  }

  async getIngestionStatus() {
    return {
      lastIngestion: this.lastIngestion,
      ingestionInProgress: this.ingestionInProgress,
      timestamp: new Date().toISOString(),
    };
  }
}

const ingestService = new IngestService();
module.exports = ingestService;
