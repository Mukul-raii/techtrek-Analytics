const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');
const config = require('../config/config');
const logger = require('../utils/logger');

class SearchService {
  constructor() {
    this.client = null;
  }

  async initialize() {
    if (!config.search.endpoint || !config.search.apiKey) {
      logger.warn('Azure Cognitive Search configuration missing. Running in mock mode.');
      return;
    }

    try {
      this.client = new SearchClient(
        config.search.endpoint,
        config.search.indexName,
        new AzureKeyCredential(config.search.apiKey)
      );

      logger.info('✅ Azure Cognitive Search initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize Cognitive Search:', error.message);
      throw error;
    }
  }

  async search(params) {
    if (!this.client) {
      return this._getMockSearchResults(params);
    }

    try {
      const { query, source, date, language, limit, offset } = params;

      const searchOptions = {
        top: limit,
        skip: offset,
        includeTotalCount: true
      };

      // Add filters
      const filters = [];
      if (source) filters.push(`source eq '${source}'`);
      if (language) filters.push(`language eq '${language}'`);
      if (date) filters.push(`timestamp ge ${date}`);

      if (filters.length > 0) {
        searchOptions.filter = filters.join(' and ');
      }

      const results = await this.client.search(query, searchOptions);
      
      const items = [];
      for await (const result of results.results) {
        items.push(result.document);
      }

      return {
        count: results.count || items.length,
        items
      };
    } catch (error) {
      logger.error('Error performing search:', error.message);
      return this._getMockSearchResults(params);
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
      logger.error('Error getting suggestions:', error.message);
      return this._getMockSuggestions(query, limit);
    }
  }

  async indexDocument(document) {
    if (!this.client) {
      logger.info('Mock mode: Document would be indexed:', document);
      return;
    }

    try {
      await this.client.uploadDocuments([document]);
      logger.info('Document indexed successfully:', document.id);
    } catch (error) {
      logger.error('Error indexing document:', error.message);
      throw error;
    }
  }

  async healthCheck() {
    if (!this.client) {
      return false;
    }

    try {
      // Simple search to verify connectivity
      await this.client.search('*', { top: 1 });
      return true;
    } catch (error) {
      logger.error('Search service health check failed:', error.message);
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
        source: i % 2 === 0 ? 'github' : 'hackernews',
        description: `This is a search result that matches your query: ${query}`,
        score: (1 - i * 0.1).toFixed(2),
        timestamp: new Date().toISOString()
      });
    }

    return {
      count: items.length,
      items
    };
  }

  _getMockSuggestions(query, limit) {
    const suggestions = [
      `${query} tutorial`,
      `${query} best practices`,
      `${query} vs alternatives`,
      `${query} getting started`,
      `${query} latest news`
    ];

    return suggestions.slice(0, limit);
  }
}

const searchService = new SearchService();
module.exports = searchService;
