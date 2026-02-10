require("dotenv").config();

const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  // Azure Cosmos DB
  cosmos: {
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
    databaseName: process.env.COSMOS_DATABASE_NAME || "TechPulseDB",
    containers: {
      github: process.env.COSMOS_CONTAINER_GITHUB || "github-data",
      hackerNews: process.env.COSMOS_CONTAINER_HACKERNEWS || "hackernews-data",
      metadata: process.env.COSMOS_CONTAINER_METADATA || "metadata",
    },
  },

  // Azure SQL Database
  sql: {
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    options: {
      encrypt: process.env.SQL_ENCRYPT === "true",
      trustServerCertificate:
        process.env.SQL_TRUST_SERVER_CERTIFICATE === "true",
      enableArithAbort: true,
      requestTimeout: 30000,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },

  // Azure Cognitive Search
  search: {
    endpoint: process.env.SEARCH_ENDPOINT,
    apiKey: process.env.SEARCH_API_KEY,
    indexName: process.env.SEARCH_INDEX_NAME || "techpulse-index",
  },

  // Azure Data Lake (Optional)
  dataLake: {
    accountName: process.env.DATALAKE_ACCOUNT_NAME,
    accountKey: process.env.DATALAKE_ACCOUNT_KEY,
    containerName: process.env.DATALAKE_CONTAINER_NAME || "raw-data",
  },

  // External APIs
  github: {
    apiUrl: process.env.GITHUB_API_URL || "https://api.github.com",
    token: process.env.GITHUB_TOKEN,
  },

  hackerNews: {
    apiUrl:
      process.env.HACKERNEWS_API_URL || "https://hacker-news.firebaseio.com/v0",
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",

  // Data Ingestion
  ingestion: {
    schedule: process.env.INGESTION_SCHEDULE || "0 */6 * * *", // Every 6 hours
  },
};

// Validate required configuration
const validateConfig = () => {
  const required = ["cosmos.endpoint", "cosmos.key"];
  const missing = [];

  required.forEach((key) => {
    const keys = key.split(".");
    let value = config;
    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        missing.push(key);
        break;
      }
    }
  });

  if (missing.length > 0 && config.nodeEnv !== "development") {
    console.warn("⚠️  Missing required configuration:", missing.join(", "));
  }
};

validateConfig();

module.exports = config;
