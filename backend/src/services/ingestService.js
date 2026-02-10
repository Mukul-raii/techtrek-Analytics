const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');
const cosmosService = require('./cosmosService');

class IngestService {
  constructor() {
    this.lastIngestion = null;
    this.ingestionInProgress = false;
  }

  async ingestData(source) {
    if (this.ingestionInProgress) {
      logger.warn('Ingestion already in progress');
      return { status: 'skipped', message: 'Ingestion already in progress' };
    }

    this.ingestionInProgress = true;
    const startTime = Date.now();

    try {
      let result;

      if (source === 'github' || source === 'all') {
        result = await this.ingestGitHubData();
      }

      if (source === 'hackernews' || source === 'all') {
        result = await this.ingestHackerNewsData();
      }

      this.lastIngestion = {
        timestamp: new Date().toISOString(),
        source,
        status: 'success',
        duration: Date.now() - startTime,
        itemsIngested: result?.count || 0
      };

      logger.info(`Ingestion completed for ${source}:`, this.lastIngestion);
      return this.lastIngestion;
    } catch (error) {
      this.lastIngestion = {
        timestamp: new Date().toISOString(),
        source,
        status: 'failed',
        duration: Date.now() - startTime,
        error: error.message
      };

      logger.error(`Ingestion failed for ${source}:`, error.message);
      throw error;
    } finally {
      this.ingestionInProgress = false;
    }
  }

  async ingestGitHubData() {
    try {
      logger.info('Fetching GitHub trending repositories...');

      const headers = {};
      if (config.github.token) {
        headers.Authorization = `token ${config.github.token}`;
      }

      // Fetch trending repositories
      const response = await axios.get(
        `${config.github.apiUrl}/search/repositories`,
        {
          headers,
          params: {
            q: 'stars:>1000',
            sort: 'stars',
            order: 'desc',
            per_page: 30
          }
        }
      );

      const repositories = response.data.items;
      logger.info(`Fetched ${repositories.length} GitHub repositories`);

      // Store in Cosmos DB
      const items = repositories.map(repo => ({
        id: `github-${repo.id}`,
        source: 'github',
        repository: repo.full_name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        url: repo.html_url,
        owner: repo.owner.login,
        topics: repo.topics || [],
        timestamp: new Date().toISOString(),
        partitionKey: 'github'
      }));

      // Save to Cosmos DB using batch upsert
      const savedItems = await cosmosService.upsertBatch('github', items);

      logger.info(`Ingested ${savedItems.length} GitHub items`);
      return { count: savedItems.length, items: savedItems };
    } catch (error) {
      logger.error('Error ingesting GitHub data:', error.message);
      throw error;
    }
  }

  async ingestHackerNewsData() {
    try {
      logger.info('Fetching HackerNews top stories...');

      // Fetch top story IDs
      const topStoriesResponse = await axios.get(
        `${config.hackerNews.apiUrl}/topstories.json`
      );

      const storyIds = topStoriesResponse.data.slice(0, 30);
      logger.info(`Fetched ${storyIds.length} HackerNews story IDs`);

      // Fetch individual stories
      const storyPromises = storyIds.map(id =>
        axios.get(`${config.hackerNews.apiUrl}/item/${id}.json`)
      );

      const stories = await Promise.all(storyPromises);

      const items = stories
        .map(response => response.data)
        .filter(story => story && story.type === 'story')
        .map(story => ({
          id: `hn-${story.id}`,
          source: 'hackernews',
          title: story.title,
          url: story.url,
          points: story.score,
          comments: story.descendants || 0,
          author: story.by,
          timestamp: new Date(story.time * 1000).toISOString(),
          partitionKey: 'hackernews'
        }));

      // Save to Cosmos DB using batch upsert
      const savedItems = await cosmosService.upsertBatch('hackerNews', items);

      logger.info(`Ingested ${savedItems.length} HackerNews items`);
      return { count: savedItems.length, items: savedItems };
    } catch (error) {
      logger.error('Error ingesting HackerNews data:', error.message);
      throw error;
    }
  }

  async getIngestionStatus() {
    return {
      lastIngestion: this.lastIngestion,
      ingestionInProgress: this.ingestionInProgress,
      timestamp: new Date().toISOString()
    };
  }
}

const ingestService = new IngestService();
module.exports = ingestService;
