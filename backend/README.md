# TechPulse Analytics - Backend

Backend server for TechPulse Analytics platform built with Node.js, Express, and Azure services.

## 🚀 Features

- **Data Ingestion**: Fetch trending data from GitHub and HackerNews APIs
- **Azure Cosmos DB**: NoSQL storage for raw data
- **Azure SQL Database**: Structured analytics and metrics
- **Azure Cognitive Search**: Full-text search capabilities
- **RESTful APIs**: Well-documented endpoints
- **Health Monitoring**: Service health checks
- **Rate Limiting**: API protection
- **Error Handling**: Comprehensive error management
- **Logging**: Winston-based logging system

## 📋 Prerequisites

- Node.js >= 18.x
- Azure Account (for Azure services)
- GitHub Personal Access Token (optional but recommended)

## 🛠️ Installation

1. Clone the repository and navigate to backend:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
# Edit .env with your Azure credentials
```

## ⚙️ Configuration

Edit `.env` file with your Azure service credentials:

- **COSMOS_ENDPOINT**: Your Cosmos DB endpoint
- **COSMOS_KEY**: Your Cosmos DB primary key
- **SQL_SERVER**: Azure SQL server name
- **SQL_DATABASE**: Database name
- **SEARCH_ENDPOINT**: Cognitive Search endpoint
- **GITHUB_TOKEN**: GitHub personal access token

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check

- `GET /health` - Server health check
- `GET /api/health` - All services health check
- `GET /api/health/cosmos` - Cosmos DB health
- `GET /api/health/sql` - Azure SQL health
- `GET /api/health/search` - Search service health

### Trending Data

- `GET /api/trending` - Get all trending items
  - Query params: `?timeRange=today|week|month&limit=50&source=github|hackernews`
- `GET /api/trending/:source` - Get trending by source (github/hackernews)
  - Query params: `?timeRange=today|week|month&limit=50`
  - **Time Ranges:**
    - `today` or `daily` - Last 24 hours
    - `week` or `weekly` - Last 7 days (default)
    - `month` or `monthly` - Last 30 days

### Analytics

- `GET /api/analytics` - Overall analytics
- `GET /api/analytics/daily` - Daily metrics
- `GET /api/analytics/:source` - Source-specific analytics

### Search

- `GET /api/search?q=query` - Search for content
- `GET /api/search/suggest?q=query` - Autocomplete suggestions

### Data Ingestion

- `POST /api/ingest` - Manually trigger data ingestion
- `GET /api/ingest/status` - Get ingestion status

### Scheduler Management

- `GET /api/ingest/scheduler/status` - Get scheduler status and next run times
- `POST /api/ingest/scheduler/start` - Start the scheduler
- `POST /api/ingest/scheduler/stop` - Stop the scheduler
- `POST /api/ingest/scheduler/trigger/:job` - Manually trigger a specific job
  - Jobs: `github`, `hackernews`, or `all`

### Automated Scheduling

The server includes an automated scheduler that runs:

- **GitHub ingestion**: Every 6 hours
- **HackerNews ingestion**: Every 1 hour
- **Full ingestion**: Every 12 hours (midnight & noon)

To enable in development, set `ENABLE_SCHEDULER=true` in your `.env` file.
In production, the scheduler is always enabled.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── config.js           # Configuration management
│   ├── controllers/            # Request handlers
│   │   ├── trendingController.js
│   │   ├── analyticsController.js
│   │   ├── searchController.js
│   │   ├── ingestController.js
│   │   └── healthController.js
│   ├── middleware/             # Express middleware
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── rateLimiter.js
│   ├── routes/                 # API routes
│   │   ├── trendingRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── searchRoutes.js
│   │   ├── ingestRoutes.js
│   │   └── healthRoutes.js
│   ├── services/               # Business logic
│   │   ├── cosmosService.js
│   │   ├── sqlService.js
│   │   ├── searchService.js
│   │   └── ingestService.js
│   ├── utils/                  # Utility functions
│   │   ├── logger.js
│   │   ├── ApiError.js
│   │   └── catchAsync.js
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
├── logs/                       # Log files
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📝 Development Notes

### Mock Mode

The application can run in mock mode without Azure services configured. Mock data will be returned for all endpoints.

### Logging

Logs are stored in the `logs/` directory:

- `combined.log` - All logs
- `error.log` - Error logs only

### Error Handling

All errors are handled by the global error handler and returned in a consistent format:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error description"
}
```

## 🔒 Security

- **Helmet**: Security headers
- **CORS**: Configurable CORS policy
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Request validation

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Configure all Azure services
3. Use process manager (PM2, systemd)
4. Set up reverse proxy (nginx)
5. Enable HTTPS

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📧 Support

For issues and questions, please open an issue on GitHub.
