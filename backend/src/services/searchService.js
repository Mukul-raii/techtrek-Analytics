const { SearchClient, AzureKeyCredential } = require("@azure/search-documents");
const config = require("../config/config");
const logger = require("../utils/logger");
const cosmosService = require("./cosmosService");

class SearchService {
  constructor() {
    this.client = null;
  }

  async initialize() {
    if (!config.search.endpoint || !config.search.apiKey) {
      logger.warn(
        "Azure Cognitive Search configuration missing. Will use Cosmos DB search."
      );
      return;
    }

    try {
      this.client = new SearchClient(
        config.search.endpoint,
        config.search.indexName,
        new AzureKeyCredential(config.search.apiKey)
      );

      logger.info("✅ Azure Cognitive Search initialized successfully");
    } catch (error) {
      logger.error("❌ Failed to initialize Cognitive Search:", error.message);
      logger.info("Will fallback to Cosmos DB search");
    }
  }

  async search(params) {
    // Always use Cosmos DB search for now to get real data
    return this._searchCosmosDB(params);
  }

  async _searchCosmosDB(params) {
    try {
      const { query, source, language, limit, offset } = params;

      if (!cosmosService.client) {
        logger.warn("Cosmos DB not available, using mock data");
        return this._getMockSearchResults(params);
      }

      const searchQuery = query.toLowerCase();
      const results = [];
      const maxResults = limit || 20;

      // Search in GitHub container
      if (!source || source === "github") {
        const githubResults = await this._searchGitHub(
          searchQuery,
          language,
          maxResults
        );
        results.push(...githubResults);
      }

      // Search in Hacker News container
      if (!source || source === "hackernews") {
        const hnResults = await this._searchHackerNews(searchQuery, maxResults);
        results.push(...hnResults);
      }

      // Sort by relevance (stars/points) and limit
      const sortedResults = results
        .sort(
          (a, b) =>
            (b.popularity || b.stars || b.points || 0) -
            (a.popularity || a.stars || a.points || 0)
        )
        .slice(offset || 0, (offset || 0) + maxResults);

      return {
        count: sortedResults.length,
        items: sortedResults,
      };
    } catch (error) {
      logger.error("Error searching Cosmos DB:", error.message);
      return this._getMockSearchResults(params);
    }
  }

  async _searchGitHub(searchQuery, language, limit) {
    try {
      const container = cosmosService.containers.github;
      if (!container) return [];

      // Build query - search in title (repo name) and description
      let queryText = `
        SELECT * FROM c 
        WHERE (
          CONTAINS(LOWER(c.repository || ''), @searchQuery) OR
          CONTAINS(LOWER(c.title || ''), @searchQuery) OR
          CONTAINS(LOWER(c.description || ''), @searchQuery)
        )
      `;

      if (language) {
        queryText += ` AND LOWER(c.language || '') = LOWER(@language)`;
      }

      queryText += ` ORDER BY c.stars DESC`;

      const querySpec = {
        query: queryText,
        parameters: [
          { name: "@searchQuery", value: searchQuery },
          ...(language ? [{ name: "@language", value: language }] : []),
        ],
      };

      const { resources } = await container.items.query(querySpec).fetchAll();

      // Transform to consistent format
      return resources.slice(0, limit).map((item) => ({
        id: item.id || `github-${item.repository}`,
        source: "github",
        title: item.repository || item.title,
        description: item.description || "",
        language: item.language,
        url: item.url,
        timestamp: item.createdAt || item.timestamp || new Date().toISOString(),
        popularity: item.stars,
        stars: item.stars,
      }));
    } catch (error) {
      logger.error("Error searching GitHub data:", error.message);
      return [];
    }
  }

  async _searchHackerNews(searchQuery, limit) {
    try {
      const container = cosmosService.containers.hackerNews;
      if (!container) return [];

      // Build query - search in title and text
      const querySpec = {
        query: `
          SELECT * FROM c 
          WHERE (
            CONTAINS(LOWER(c.title || ''), @searchQuery) OR
            CONTAINS(LOWER(c.text || ''), @searchQuery)
          )
          ORDER BY c.points DESC
        `,
        parameters: [{ name: "@searchQuery", value: searchQuery }],
      };

      const { resources } = await container.items.query(querySpec).fetchAll();

      // Transform to consistent format
      return resources.slice(0, limit).map((item) => ({
        id: item.id || `hn-${item.objectID}`,
        source: "hackernews",
        title: item.title,
        description: item.text || item.story_text || "",
        url:
          item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
        timestamp:
          item.created_at || item.timestamp || new Date().toISOString(),
        popularity: item.points,
        score: item.points,
      }));
    } catch (error) {
      logger.error("Error searching Hacker News data:", error.message);
      return [];
    }
  }

  async getSuggestions(query, limit) {
    if (!this.client) {
      return this._getMockSuggestions(query, limit);
    }

    try {
      // In a real implementation, you would use the suggester
      // For now, return mock data
      return this._getMockSuggestions(query, limit);
    } catch (error) {
      logger.error("Error getting suggestions:", error.message);
      return this._getMockSuggestions(query, limit);
    }
  }

  async indexDocument(document) {
    if (!this.client) {
      logger.info("Mock mode: Document would be indexed:", document);
      return;
    }

    try {
      await this.client.uploadDocuments([document]);
      logger.info("Document indexed successfully:", document.id);
    } catch (error) {
      logger.error("Error indexing document:", error.message);
      throw error;
    }
  }

  async healthCheck() {
    if (!this.client) {
      return false;
    }

    try {
      // Simple search to verify connectivity
      await this.client.search("*", { top: 1 });
      return true;
    } catch (error) {
      logger.error("Search service health check failed:", error.message);
      return false;
    }
  }

  _getMockSearchResults(params) {
    const { query, limit } = params;
    const items = [];

    for (let i = 0; i < Math.min(limit, 10); i++) {
      items.push({
        id: `search-${i}`,
        title: `Result matching "${query}" - ${i}`,
        source: i % 2 === 0 ? "github" : "hackernews",
        description: `This is a search result that matches your query: ${query}`,
        score: (1 - i * 0.1).toFixed(2),
        timestamp: new Date().toISOString(),
      });
    }

    return {
      count: items.length,
      items,
    };
  }

  _getMockSuggestions(query, limit) {
    const suggestions = [
      `${query} tutorial`,
      `${query} best practices`,
      `${query} vs alternatives`,
      `${query} getting started`,
      `${query} latest news`,
    ];

    return suggestions.slice(0, limit);
  }
}

const searchService = new SearchService();
module.exports = searchService;
