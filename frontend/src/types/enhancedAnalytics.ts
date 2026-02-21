// Enhanced Analytics Types with Derived Metrics

export interface MomentumScore {
  score: number; // 0-100
  velocity: number;
  acceleration: number;
  recencyFactor: number;
  engagementMultiplier: number;
}

export interface MomentumBadge {
  type: "explosive" | "rising" | "steady" | "solid" | "cooling";
  emoji: string;
  label: string;
}

export interface EngagementMetrics {
  rate: number;
  score: number; // 0-10
}

export interface HealthScore {
  score: number; // 0-100
  components: {
    activityRate: number;
    engagement: number;
    discussionQuality: number;
    freshness: number;
  };
}

export interface PeriodComparison {
  current: {
    items: number;
    avgPopularity: number;
    stars: number;
    points: number;
  };
  previous: {
    items: number;
    avgPopularity: number;
    stars: number;
    points: number;
  };
  change: {
    itemsPercent: number;
    popularityPercent: number;
    starsPercent: number;
    pointsPercent: number;
  };
}

export interface VelocityLeader {
  id: string;
  title: string;
  source: string;
  momentumScore: number;
  growthRate: number;
  badge: MomentumBadge;
}

export interface LanguageGrowthData {
  language: string;
  marketShare: number;
  growthRate: number;
  count: number;
  stars: number;
}

export interface LanguageGrowthAnalysis {
  leaders: LanguageGrowthData[];
  challengers: LanguageGrowthData[];
  established: LanguageGrowthData[];
  declining: LanguageGrowthData[];
}

export interface EnhancedMetrics {
  freshnessIndex: number; // 0-100
  healthScore: HealthScore;
  languageDiversity: number; // 0-100
  velocityLeaders: VelocityLeader[];
}

export interface EnhancedAnalyticsData {
  totalItems: number;
  githubCount: number;
  hackerNewsCount: number;
  avgPopularity: number;
  languageStats: Array<{
    language: string;
    count: number;
    stars: number;
    avgStars: number;
    percentage: number;
  }>;
  githubStats: {
    totalRepositories: number;
    totalStars: number;
    totalForks: number;
    avgStars: number;
    topLanguages: string[];
  };
  hackerNewsStats: {
    totalStories: number;
    totalPoints: number;
    totalComments: number;
    avgPoints: number;
    avgComments: number;
  };
  metrics: EnhancedMetrics;
  comparison?: PeriodComparison;
  languageGrowth?: LanguageGrowthAnalysis;
}

export interface EnhancedTrendingItem {
  id: string;
  source: "github" | "hackernews";
  // GitHub specific
  repository?: string;
  stars?: number;
  forks?: number;
  language?: string;
  owner?: string;
  topics?: string[];
  description?: string;
  // HackerNews specific
  title?: string;
  points?: number;
  comments?: number;
  author?: string;
  // Common
  url: string;
  timestamp: string;
  // Enhanced metrics
  momentum: MomentumScore;
  engagement: EngagementMetrics;
  badge: MomentumBadge;
  ageInDays: number;
  recency: string;
  viralityIndex?: number; // For HN only
}

// Dashboard specific types
export interface DashboardKPICard {
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "stable";
  subtitle?: string;
  icon?: string;
}

export interface MomentumKPI {
  score: number;
  change: number;
  trend: "up" | "down" | "stable";
  sparklineData?: number[];
}

export interface FreshnessKPI {
  percentage: number;
  change: number;
  breakdown: {
    fresh: number;
    mixed: number;
    stale: number;
  };
}

export interface EngagementKPI {
  score: number; // 0-10
  change: number;
  trend: "up" | "down" | "stable";
  avgAcrossSources: {
    github: number;
    hackernews: number;
  };
}

export interface VelocityLeadersKPI {
  leaders: Array<{
    title: string;
    source: string;
    growthPercent: number;
    badge: MomentumBadge;
  }>;
}

// Chart data types
export interface ActivityDataPoint {
  date: string;
  items: number;
  engagement: number;
}

export interface LanguageGrowthPoint {
  language: string;
  marketShare: number;
  growthRate: number;
  repos: number;
  quadrant: "leaders" | "challengers" | "established" | "declining";
}

// Percentile ranking
export interface PercentileRank {
  stars?: number;
  engagement?: number;
  growth?: number;
}

export interface EnhancedSearchResult extends EnhancedTrendingItem {
  relevanceScore?: number;
  percentileRank?: PercentileRank;
}
