# TechTrek Analytics

<div align="center">

![TechTrek Analytics](https://res.cloudinary.com/dmvzjbgwp/image/upload/v1746853702/placeholder_image.png)

**A comprehensive analytics platform for ingesting, searching, and visualizing data with real-time monitoring and trend analysis.**

[![Status](https://img.shields.io/badge/Status-In%20Development-blue)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)]()
[![React](https://img.shields.io/badge/React-19.x-61dafb)]()
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

[Live Demo](https://techtrek-analytics.vercel.app/) · [Documentation](#documentation) · [Quick Start](#quick-start)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Advanced Analytics](#advanced-analytics)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

**TechTrek Analytics** is a modern, full-stack analytics platform designed to help developers and organizations track technology trends, monitor repository health, and make data-driven decisions. The platform ingests data from multiple sources (GitHub, HackerNews) and provides real-time insights through advanced metrics and visualizations.

### Key Capabilities
- 📊 **Real-time Analytics Dashboard** - Track momentum, engagement, and ecosystem health
- 🔥 **Trending Detection** - AI-powered momentum scoring and velocity tracking
- 🔍 **Advanced Search** - Fast, filtered search across repositories and topics
- 📈 **Growth Analytics** - Period-over-period comparisons and language evolution
- 🎯 **Health Monitoring** - Composite scoring of ecosystem vitality

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TECHTREK ANALYTICS PLATFORM                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                               CLIENT LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Dashboard  │  │  Analytics   │  │   Trending   │  │    Search    │  │
│  │     Page     │  │     Page     │  │     Page     │  │     Page     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                 │                 │           │
│         └─────────────────┴─────────────────┴─────────────────┘           │
│                                     │                                       │
│                    ┌────────────────┴────────────────┐                     │
│                    │     React Router (v7)           │                     │
│                    │     State Management (Zustand)   │                     │
│                    └────────────────┬────────────────┘                     │
│                                     │                                       │
│         ┌───────────────────────────┼───────────────────────────┐          │
│         │                           │                           │          │
│  ┌──────▼───────┐         ┌────────▼────────┐        ┌────────▼────────┐ │
│  │ Custom Hooks │         │  UI Components  │        │  Type Definitions│ │
│  │              │         │                 │        │                  │ │
│  │• Enhanced    │         │• MomentumBadge  │        │• Analytics Types │ │
│  │  Metrics     │         │• HealthGauge    │        │• Trending Types  │ │
│  │• Trending    │         │• PercentileBadge│        │• Metric Types    │ │
│  │• Growth      │         │• Charts/Graphs  │        │                  │ │
│  └──────────────┘         └─────────────────┘        └──────────────────┘ │
│                                                                             │
│                      Frontend: React 19 + TypeScript + Vite                │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  │ HTTPS/REST API
                                  │
┌─────────────────────────────────▼───────────────────────────────────────────┐
│                              API GATEWAY LAYER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                        Express.js Server                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │ │
│  │  │   Middleware │  │   Middleware │  │  Middleware  │               │ │
│  │  │   CORS       │  │   Error      │  │  Rate Limit  │               │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │ │
│  └───────────────────────────────┬───────────────────────────────────────┘ │
│                                  │                                          │
│  ┌───────────────────────────────┴───────────────────────────────────────┐ │
│  │                         API ROUTES                                    │ │
│  │                                                                       │ │
│  │  /api/analytics     /api/trending     /api/search     /api/health    │ │
│  └───────┬──────────────────┬──────────────────┬──────────────┬─────────┘ │
│          │                  │                  │              │           │
└──────────┼──────────────────┼──────────────────┼──────────────┼───────────┘
           │                  │                  │              │
┌──────────▼──────────────────▼──────────────────▼──────────────▼───────────┐
│                           CONTROLLER LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐             │
│  │   Analytics     │  │    Trending     │  │     Search     │             │
│  │   Controller    │  │    Controller   │  │   Controller   │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬───────┘             │
│           │                    │                     │                     │
│           └────────────────────┴─────────────────────┘                     │
│                                │                                            │
└────────────────────────────────┼────────────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────────────┐
│                            SERVICE LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐   │
│  │   Cosmos Service   │  │  SQL Service       │  │   Search Service   │   │
│  │                    │  │                    │  │                    │   │
│  │ • CRUD Operations  │  │ • Query Builder    │  │ • Index Management │   │
│  │ • Enhanced Queries │  │ • Connection Pool  │  │ • Search Queries   │   │
│  └──────────┬─────────┘  └──────────┬─────────┘  └──────────┬─────────┘   │
│             │                       │                        │             │
│  ┌──────────▼───────────────────────▼────────────────────────▼─────────┐   │
│  │                   Analytics Metrics Service                         │   │
│  │                                                                     │   │
│  │  • Momentum Score Calculation      • Engagement Rate & Score       │   │
│  │  • Freshness Index                 • Health Score (4 Components)   │   │
│  │  • Language Diversity              • Period Comparisons            │   │
│  │  • Velocity Leaders                • Virality Index                │   │
│  │  • Growth Classification           • Badge Assignment              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐   │
│  │  Ingestion Service │  │  Schedule Service  │  │   Cache Service    │   │
│  │                    │  │                    │  │                    │   │
│  │ • Data Validation  │  │ • Cron Jobs        │  │ • Redis/Memory     │   │
│  │ • Normalization    │  │ • Task Queue       │  │ • TTL Management   │   │
│  └──────────┬─────────┘  └────────────────────┘  └────────────────────┘   │
│             │                                                               │
└─────────────┼───────────────────────────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────┐         ┌─────────────────────────┐           │
│  │    Azure CosmosDB       │         │      SQL Database       │           │
│  │    (NoSQL Document)     │         │   (Relational Data)     │           │
│  │                         │         │                         │           │
│  │ • Trending Items        │         │ • User Data             │           │
│  │ • Analytics Records     │         │ • Configuration         │           │
│  │ • Partitioned by Date   │         │ • Historical Snapshots  │           │
│  └─────────────────────────┘         └─────────────────────────┘           │
│                                                                             │
│  ┌─────────────────────────┐                                               │
│  │  Azure Cognitive Search │                                               │
│  │  (Full-Text Search)     │                                               │
│  │                         │                                               │
│  │ • Indexed Documents     │                                               │
│  │ • Fuzzy Search          │                                               │
│  │ • Filters & Facets      │                                               │
│  └─────────────────────────┘                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL DATA SOURCES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│         ┌──────────────┐            ┌──────────────┐                       │
│         │  GitHub API  │            │ HackerNews   │                       │
│         │              │            │     API      │                       │
│         │ • Repos      │            │ • Stories    │                       │
│         │ • Stars      │            │ • Points     │                       │
│         │ • Forks      │            │ • Comments   │                       │
│         └──────────────┘            └──────────────┘                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌──────────────┐
│  Data Source │  (GitHub API, HackerNews API)
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│  INGESTION PIPELINE                                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌─────────┐ │
│  │ Validate │ → │ Transform│ → │ Enrich   │ → │  Store  │ │
│  └──────────┘   └──────────┘   └──────────┘   └─────────┘ │
└───────────────────────────────────┬─────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│  STORAGE LAYER                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  CosmosDB    │  │  SQL DB      │  │ Search Index │      │
│  │  (Primary)   │  │  (Relations) │  │  (Queries)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────────────┬─────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│  ANALYTICS ENGINE                                           │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│  │  Momentum    │   │  Engagement  │   │   Health     │    │
│  │  Calculator  │   │  Analyzer    │   │   Monitor    │    │
│  └──────────────┘   └──────────────┘   └──────────────┘    │
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│  │  Freshness   │   │  Diversity   │   │   Growth     │    │
│  │  Index       │   │  Index       │   │   Classifier │    │
│  └──────────────┘   └──────────────┘   └──────────────┘    │
└───────────────────────────────────┬─────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│  REST API LAYER                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  /analytics  │  │  /trending   │  │   /search    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────────────┬─────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ KPI Cards    │  │ Charts       │  │ Tables       │      │
│  │ • Momentum   │  │ • Line       │  │ • Trending   │      │
│  │ • Freshness  │  │ • Scatter    │  │ • Languages  │      │
│  │ • Engagement │  │ • Bar        │  │ • Search     │      │
│  │ • Health     │  │ • Gauge      │  │ • Velocity   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND COMPONENTS                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Pages/                    Components/ui/                   │
│  ├── Dashboard.tsx         ├── MomentumBadge.tsx           │
│  ├── Analytics.tsx         ├── HealthGauge.tsx             │
│  ├── Trending.tsx          ├── PercentileBadge.tsx         │
│  └── Search.tsx            └── Charts/                     │
│                                                              │
│  Hooks/                    Services/                        │
│  ├── useEnhancedMetrics    ├── analyticsService.ts         │
│  ├── useEnhancedTrending   ├── trendingService.ts          │
│  └── useRealGrowthMetrics  └── searchService.ts            │
│                                                              │
│  Store/ (Zustand)          Types/                           │
│  ├── analyticsStore.ts     └── enhancedAnalytics.ts        │
│  └── appStore.ts                                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     BACKEND SERVICES                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Controllers/              Services/                         │
│  ├── analyticsController   ├── cosmosService               │
│  ├── trendingController    ├── sqlService                  │
│  └── searchController      ├── searchService               │
│                            ├── ingestionService            │
│  Routes/                   ├── analyticsMetricsService     │
│  ├── analytics.routes      └── schedulerService            │
│  ├── trending.routes                                        │
│  └── search.routes         Utils/                           │
│                            ├── dbClient.js                  │
│  Middleware/               ├── logger.js                    │
│  ├── errorHandler          └── validators.js               │
│  └── notFound                                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🎯 Analytics Dashboard
- **Momentum Tracking**: Real-time calculation of trending velocity and acceleration
- **Freshness Index**: Percentage of content newer than 7 days
- **Engagement Metrics**: Interaction rates across GitHub (forks/stars) and HackerNews (comments/points)
- **Health Score**: Composite ecosystem health with 4-component breakdown

### 🔥 Trending Intelligence
- **Momentum Scoring**: Advanced algorithm combining velocity, acceleration, recency, and engagement
- **Smart Badges**: 5-tier classification (🔥 Explosive, ⚡ Rising, 📈 Steady, 💎 Solid, ⚠️ Cooling)
- **Velocity Leaders**: Top 3 items with highest growth rates
- **Virality Index**: HackerNews-specific viral content detection

### 📊 Growth Analytics
- **Period Comparisons**: Real-time month-over-month and week-over-week growth
- **Language Classification**: Leaders, Challengers, Established, and Declining languages
- **Growth Matrix**: Visual scatter plot of popularity vs. growth rate
- **Language Diversity**: Shannon entropy-based diversity index

### 🔍 Advanced Search
- **Multi-Source Search**: GitHub repositories and HackerNews stories
- **Smart Filters**: Language, source, date range, and engagement filters
- **Relevance Scoring**: AI-powered result ranking
- **Percentile Rankings**: Show how items rank against the dataset

### 📈 Visualizations
- **Interactive Charts**: Line, bar, scatter, and gauge charts
- **Real-time Updates**: Live data refresh without page reload
- **Responsive Design**: Mobile-first, works on all screen sizes
- **Dark Mode**: Full theme support

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.x | UI framework with modern features |
| **TypeScript** | 5.x | Type safety and developer experience |
| **Vite** | 6.x | Lightning-fast build tool |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **React Router** | 7.x | Client-side routing |
| **Zustand** | 4.x | Lightweight state management |
| **Lucide React** | - | Icon library |
| **Radix UI** | - | Accessible component primitives |
| **Sonner** | - | Toast notifications |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x | JavaScript runtime |
| **Express.js** | 4.x | Web application framework |
| **Azure CosmosDB** | 4.9.x | NoSQL database for documents |
| **SQL** | - | Relational data storage |
| **Azure Cognitive Search** | 12.x | Full-text search service |
| **Axios** | 1.13.x | HTTP client for external APIs |
| **dotenv** | 17.x | Environment configuration |

### DevOps & Deployment
- **Vercel** - Frontend and serverless functions hosting
- **Azure** - Database and search services
- **Git** - Version control
- **GitHub Actions** - CI/CD pipelines

---

## 📁 Project Structure

```
techtrek-analytics/
├── frontend/                      # React frontend application
│   ├── src/
│   │   ├── pages/                # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── Trending.tsx
│   │   │   └── Search.tsx
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/              # Base UI components
│   │   │   │   ├── MomentumBadge.tsx
│   │   │   │   ├── HealthGauge.tsx
│   │   │   │   ├── PercentileBadge.tsx
│   │   │   │   └── ...
│   │   │   └── ...
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useEnhancedMetrics.ts
│   │   │   ├── useEnhancedTrending.ts
│   │   │   └── ...
│   │   ├── services/            # API communication layer
│   │   │   ├── analyticsService.ts
│   │   │   ├── trendingService.ts
│   │   │   └── searchService.ts
│   │   ├── store/               # State management (Zustand)
│   │   │   └── analyticsStore.ts
│   │   ├── types/               # TypeScript definitions
│   │   │   └── enhancedAnalytics.ts
│   │   ├── utils/               # Helper functions
│   │   └── App.tsx              # Root component
│   ├── public/                  # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                       # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   │   ├── analyticsController.js
│   │   │   ├── trendingController.js
│   │   │   └── searchController.js
│   │   ├── services/             # Business logic
│   │   │   ├── cosmosService.js
│   │   │   ├── sqlService.js
│   │   │   ├── searchService.js
│   │   │   ├── analyticsMetricsService.js
│   │   │   ├── ingestionService.js
│   │   │   └── schedulerService.js
│   │   ├── routes/               # API endpoints
│   │   │   ├── analytics.routes.js
│   │   │   ├── trending.routes.js
│   │   │   └── search.routes.js
│   │   ├── middleware/           # Express middleware
│   │   │   ├── errorHandler.js
│   │   │   └── notFound.js
│   │   ├── config/               # Configuration files
│   │   │   └── database.js
│   │   ├── utils/                # Utility functions
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # Server entry point
│   ├── logs/                     # Application logs
│   ├── package.json
│   └── vercel.json               # Vercel deployment config
│
├── ANALYTICS_RECOMMENDATIONS.md  # Analytics strategy document
├── IMPLEMENTATION_SUMMARY.md     # Implementation status
├── PROJECT.mdx                   # Project metadata
├── QUICK_START_GUIDE.md          # Setup instructions
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18.x
- **npm** >= 9.x
- **Azure Account** (for CosmosDB and Cognitive Search)
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-github-profile/techtrek-analytics.git
cd techtrek-analytics
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Azure credentials
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Configure API endpoint
```

4. **Environment Variables**

**Backend** (`.env`):
```env
PORT=3000
NODE_ENV=development

# Azure CosmosDB
COSMOS_ENDPOINT=your-cosmos-endpoint
COSMOS_KEY=your-cosmos-key
COSMOS_DATABASE=TechTrekAnalytics
COSMOS_CONTAINER=AnalyticsData

# Azure Cognitive Search
SEARCH_ENDPOINT=your-search-endpoint
SEARCH_KEY=your-search-key
SEARCH_INDEX=techtrek-index

# SQL Database (optional)
SQL_HOST=your-sql-host
SQL_DATABASE=techtrek
SQL_USER=your-username
SQL_PASSWORD=your-password

# External APIs
GITHUB_TOKEN=your-github-token
```

**Frontend** (`.env`):
```env
VITE_API_BASE_URL=http://localhost:3000
```

5. **Run Development Servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/api/health

---

## 📚 API Documentation

### Analytics Endpoints

#### Get Enhanced Analytics
```http
GET /api/analytics?range=month&compare=true
```

**Query Parameters:**
- `range` (optional): `week`, `month`, `quarter`, `year` (default: `month`)
- `compare` (optional): `true` to include period comparison (default: `false`)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalItems": 1250,
    "totalStars": 45000,
    "totalPoints": 8500,
    "languageStats": [...],
    "sourceBreakdown": {...},
    "metrics": {
      "freshnessIndex": 68.5,
      "healthScore": {
        "score": 78,
        "components": {
          "activityRate": 82,
          "engagement": 75,
          "discussionQuality": 72,
          "freshness": 68
        }
      },
      "languageDiversity": 85,
      "velocityLeaders": [
        {
          "title": "awesome-ai-tools",
          "source": "github",
          "momentumScore": 95,
          "growthRate": 450,
          "badge": { "type": "explosive", "emoji": "🔥" }
        }
      ]
    },
    "comparison": {
      "current": { "items": 1250, "popularity": 53500 },
      "previous": { "items": 1100, "popularity": 48000 },
      "change": {
        "itemsPercent": 13.6,
        "popularityPercent": 11.5,
        "starsPercent": 12.2,
        "pointsPercent": 8.9
      }
    },
    "languageGrowth": {
      "leaders": [...],
      "challengers": [...],
      "established": [...],
      "declining": [...]
    }
  }
}
```

### Trending Endpoints

#### Get Enhanced Trending Items
```http
GET /api/trending?limit=20&enhanced=true&source=github
```

**Query Parameters:**
- `limit` (optional): Number of items (default: `50`)
- `enhanced` (optional): Include momentum metrics (default: `true`)
- `source` (optional): `github`, `hackernews`, or omit for all
- `language` (optional): Filter by programming language
- `minStars` (optional): Minimum stars (GitHub)
- `minPoints` (optional): Minimum points (HackerNews)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "repo-123",
      "title": "awesome-ai-tools",
      "source": "github",
      "stars": 15000,
      "forks": 2500,
      "language": "Python",
      "addedAt": "2026-02-20T00:00:00.000Z",
      "momentum": {
        "score": 95,
        "velocity": 850,
        "acceleration": 125,
        "recencyFactor": 0.95,
        "engagementMultiplier": 1.2
      },
      "engagement": {
        "rate": 16.7,
        "score": 8.5
      },
      "badge": {
        "type": "explosive",
        "emoji": "🔥",
        "label": "Explosive Growth"
      },
      "ageInDays": 2,
      "recency": "2d ago"
    }
  ]
}
```

### Search Endpoints

#### Search Items
```http
GET /api/search?query=machine+learning&source=github&language=Python
```

**Query Parameters:**
- `query` (required): Search term
- `source` (optional): `github` or `hackernews`
- `language` (optional): Programming language filter
- `limit` (optional): Results count (default: `20`)

---

## 🧮 Advanced Analytics

### Metrics Implementation

#### 1. Momentum Score (0-100)
Composite metric combining velocity, acceleration, recency, and engagement:

```javascript
momentumScore = (velocity × 10 + acceleration × 5) × recencyFactor × engagementMultiplier

Where:
- velocity = growthRate per day
- acceleration = change in velocity over time
- recencyFactor = 1 - (ageInDays / 30)
- engagementMultiplier = 1 + (engagementRate / 10)
```

**Badge Assignment:**
- 🔥 **Explosive** (80-100): Viral growth
- ⚡ **Rising** (60-79): Strong momentum
- 📈 **Steady** (40-59): Consistent growth
- 💎 **Solid** (20-39): Stable trajectory
- ⚠️ **Cooling** (0-19): Declining interest

#### 2. Engagement Rate
Source-specific interaction metrics:

- **GitHub**: `(forks / stars) × 100`
- **HackerNews**: `comments / points`

#### 3. Ecosystem Health Score (0-100)
Weighted composite of 4 components:

```javascript
healthScore = 
  activityRate × 40% +
  avgEngagement × 30% +
  discussionQuality × 20% +
  freshness × 10%
```

#### 4. Content Freshness Index (0-100)
Percentage of items added within the last 7 days:

```javascript
freshnessIndex = (itemsNewerThan7Days / totalItems) × 100
```

#### 5. Language Diversity Index (0-100)
Shannon entropy-based calculation:

```javascript
diversity = -Σ(p[i] × log₂(p[i])) / log₂(n) × 100
Where p[i] = proportion of language i
```

#### 6. Language Growth Classification

**Categories:**
- **Leaders** (>100 repos, >15% growth): TypeScript, Python, Rust
- **Challengers** (50-100 repos, >20% growth): Go, Zig, Swift
- **Established** (>100 repos, <15% growth): JavaScript, Java
- **Declining** (<20% growth, low activity): PHP, Ruby

---

## 🌐 Deployment

### Production Deployment (Vercel)

1. **Backend Deployment**
```bash
cd backend
vercel --prod
```

2. **Frontend Deployment**
```bash
cd frontend
vercel --prod
```

### Environment Setup
- Configure environment variables in Vercel dashboard
- Set up Azure CosmosDB and Cognitive Search instances
- Configure CORS for production domain
- Enable rate limiting and security middleware

### Performance Optimization
- ✅ API response caching
- ✅ Database query optimization
- ✅ CDN for static assets
- ✅ Lazy loading for charts
- ✅ Code splitting with Vite

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

# E2E tests
npm run test:e2e

# Linting
npm run lint
```

---

## 📖 Documentation

- **[ANALYTICS_RECOMMENDATIONS.md](./ANALYTICS_RECOMMENDATIONS.md)** - Complete analytics strategy (2000+ lines)
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation status and progress
- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - Detailed setup instructions
- **[PROJECT.mdx](./PROJECT.mdx)** - Project metadata and overview

---

## 🎓 Learning Outcomes

### Backend Architecture
- Designed scalable microservices-oriented architecture
- Implemented complex analytics algorithms
- Mastered Azure CosmosDB partitioning and indexing
- Built efficient data ingestion pipelines

### Frontend Development
- Advanced React patterns with TypeScript
- Custom hooks for complex state management
- Performance optimization techniques
- Accessible UI component design

### Data Visualization
- Interactive chart implementations
- Real-time data updates
- Responsive design patterns
- Color-blind friendly palettes

### DevOps & Deployment
- Serverless architecture on Vercel
- CI/CD pipeline configuration
- Environment management
- Production monitoring

---

## 🎯 Roadmap

### Phase 1: Core Infrastructure ✅ Complete
- [x] Backend API with Express.js
- [x] CosmosDB integration
- [x] Analytics metrics service
- [x] Enhanced API endpoints

### Phase 2: Frontend Foundation ✅ Complete
- [x] React + TypeScript setup
- [x] Type definitions
- [x] Custom hooks
- [x] UI components

### Phase 3: Dashboard Integration 🔄 In Progress (30%)
- [x] useEnhancedMetrics hook
- [ ] Update Dashboard KPIs
- [ ] Velocity leaders display
- [ ] Enhanced charts

### Phase 4: Analytics Page 🔄 Planned
- [ ] Real growth calculations
- [ ] Health score visualization
- [ ] Language growth matrix
- [ ] Emerging topics section

### Phase 5: Trending & Search 🔄 Planned
- [ ] Momentum badges integration
- [ ] Percentile rankings
- [ ] Enhanced search results
- [ ] Related searches

### Phase 6: Advanced Features 🔮 Future
- [ ] Historical data tracking
- [ ] Predictive analytics
- [ ] Custom metric builder
- [ ] Export & reporting
- [ ] Admin dashboard
- [ ] Real-time notifications

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write TypeScript for new frontend code
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 🐛 Known Issues

1. **Historical Data**: Period comparisons use estimated data (90% of current)
   - **Status**: Requires time-series database implementation
   
2. **24h Growth Rates**: Calculated from estimated velocity
   - **Status**: Needs daily snapshot storage

3. **Discussion Quality**: Returns mock score
   - **Status**: Requires NLP analysis implementation

4. **Percentile Rankings**: Calculated but not yet displayed in all views
   - **Status**: Integration in progress

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Full Stack Developer**
- **Role**: Solo Developer
- **Timeline**: Ongoing (2026)
- **Status**: In Development

---

## 🙏 Acknowledgments

- Azure for cloud infrastructure and services
- GitHub and HackerNews for data sources
- React and Node.js communities
- Vercel for seamless deployment

---

## 📞 Support

For questions, issues, or feature requests:
- 📧 Open an issue on GitHub
- 💬 Check existing documentation
- 🔍 Review [ANALYTICS_RECOMMENDATIONS.md](./ANALYTICS_RECOMMENDATIONS.md)

---

<div align="center">

**Built with ❤️ using React, TypeScript, Node.js, and Azure**

⭐ Star this repository if you find it helpful!

</div>
