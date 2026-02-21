const logger = require("../utils/logger");

/**
 * Analytics Metrics Service
 * Provides derived metrics calculations for advanced analytics
 * - Momentum scores
 * - Engagement rates
 * - Content freshness
 * - Health scores
 * - Language growth analysis
 */
class AnalyticsMetricsService {
  /**
   * Calculate momentum score for an item (0-100)
   * Formula: (velocity * 10 + acceleration * 5) * recencyFactor * engagementMultiplier
   */
  calculateMomentumScore(item, historicalData = null) {
    try {
      // Calculate velocity (growth rate per day)
      const velocity = this.calculateVelocity(item, historicalData);

      // Calculate acceleration (change in growth rate)
      const acceleration = this.calculateAcceleration(item, historicalData);

      // Calculate recency factor (decay over time)
      const recencyFactor = this.calculateRecencyFactor(item);

      // Calculate engagement multiplier
      const engagementMultiplier = this.calculateEngagementMultiplier(item);

      // Composite score
      const rawScore =
        (velocity * 10 + acceleration * 5) *
        recencyFactor *
        engagementMultiplier;

      // Normalize to 0-100
      const score = Math.min(100, Math.max(0, rawScore));

      return {
        score: Math.round(score * 10) / 10, // Round to 1 decimal
        velocity: Math.round(velocity * 10) / 10,
        acceleration: Math.round(acceleration * 10) / 10,
        recencyFactor: Math.round(recencyFactor * 100) / 100,
        engagementMultiplier: Math.round(engagementMultiplier * 100) / 100,
      };
    } catch (error) {
      logger.error("Error calculating momentum score:", error.message);
      return {
        score: 0,
        velocity: 0,
        acceleration: 0,
        recencyFactor: 1,
        engagementMultiplier: 1,
      };
    }
  }

  /**
   * Calculate velocity (growth rate per day)
   */
  calculateVelocity(item, historicalData) {
    if (!historicalData || historicalData.length === 0) {
      // Estimate based on current metrics
      const ageInDays = this.getAgeInDays(item);
      if (ageInDays === 0) return 0;

      if (item.source === "github") {
        return (item.stars || 0) / ageInDays / 1000; // Normalize
      } else if (item.source === "hackernews") {
        return (item.points || 0) / ageInDays / 10; // Normalize
      }
    }

    // Calculate from historical data if available
    // For now, return estimated velocity
    return Math.random() * 10; // Mock - replace with actual calculation
  }

  /**
   * Calculate acceleration (change in velocity)
   */
  calculateAcceleration(item, historicalData) {
    // Mock implementation - in production, compare velocity trends
    return Math.random() * 5 - 2.5; // Random between -2.5 and 2.5
  }

  /**
   * Calculate recency factor (0-1, decays over 30 days)
   */
  calculateRecencyFactor(item) {
    const ageInDays = this.getAgeInDays(item);
    const maxAge = 30; // Decay over 30 days
    return Math.max(0, 1 - ageInDays / maxAge);
  }

  /**
   * Calculate engagement multiplier based on interaction metrics
   */
  calculateEngagementMultiplier(item) {
    const engagementRate = this.calculateEngagementRate(item);
    return 1 + engagementRate / 10; // Boost up to 1.0 + (10/10) = 2.0
  }

  /**
   * Calculate engagement rate
   * GitHub: (forks / stars) * 100
   * HackerNews: (comments / points)
   */
  calculateEngagementRate(item) {
    try {
      if (item.source === "github") {
        const stars = item.stars || 0;
        const forks = item.forks || 0;
        if (stars === 0) return 0;
        return (forks / stars) * 100;
      } else if (item.source === "hackernews") {
        const points = item.points || 0;
        const comments = item.comments || 0;
        if (points === 0) return 0;
        return comments / points;
      }
      return 0;
    } catch (error) {
      logger.error("Error calculating engagement rate:", error.message);
      return 0;
    }
  }

  /**
   * Calculate normalized engagement score (0-10)
   */
  calculateEngagementScore(item) {
    const rate = this.calculateEngagementRate(item);

    if (item.source === "github") {
      // GitHub: 0-20% fork rate is typical, normalize to 0-10
      return Math.min(10, (rate / 20) * 10);
    } else if (item.source === "hackernews") {
      // HN: 0-2.0 comment/point ratio is typical, normalize to 0-10
      return Math.min(10, (rate / 2) * 10);
    }

    return 0;
  }

  /**
   * Calculate content freshness index
   * Returns percentage of items that are less than 7 days old
   */
  calculateFreshnessIndex(items) {
    if (!items || items.length === 0) return 0;

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const freshItems = items.filter((item) => {
      const itemDate = new Date(item.timestamp || item.createdAt);
      return itemDate.getTime() > sevenDaysAgo;
    });

    const percentage = (freshItems.length / items.length) * 100;
    return Math.round(percentage * 10) / 10;
  }

  /**
   * Calculate ecosystem health score (0-100)
   * Composite of: activity rate, engagement, discussion quality, freshness
   */
  calculateHealthScore(analytics) {
    try {
      // Activity rate (40%): Percentage of items with recent activity
      const activityRate = this.calculateActivityRate(analytics) * 0.4;

      // Engagement score (30%): Average engagement across items
      const engagementScore = this.calculateAverageEngagement(analytics) * 0.3;

      // Discussion quality (20%): Based on comment length and depth
      const discussionQuality =
        this.calculateDiscussionQuality(analytics) * 0.2;

      // Freshness (10%): Percentage of recent content
      const freshness = this.calculateFreshnessIndex(analytics.items || []) * 0.1;

      const totalScore = activityRate + engagementScore + discussionQuality + freshness;

      return {
        score: Math.round(totalScore * 10) / 10,
        components: {
          activityRate: Math.round(activityRate * 10) / 10,
          engagement: Math.round(engagementScore * 10) / 10,
          discussionQuality: Math.round(discussionQuality * 10) / 10,
          freshness: Math.round(freshness * 10) / 10,
        },
      };
    } catch (error) {
      logger.error("Error calculating health score:", error.message);
      return { score: 0, components: {} };
    }
  }

  /**
   * Calculate activity rate
   */
  calculateActivityRate(analytics) {
    // Mock implementation - percentage of items with activity in last 7 days
    return 85; // 85% activity rate
  }

  /**
   * Calculate average engagement across all items
   */
  calculateAverageEngagement(analytics) {
    const items = analytics.items || [];
    if (items.length === 0) return 0;

    const totalEngagement = items.reduce((sum, item) => {
      return sum + this.calculateEngagementScore(item);
    }, 0);

    return totalEngagement / items.length;
  }

  /**
   * Calculate discussion quality score
   */
  calculateDiscussionQuality(analytics) {
    // Mock implementation - in production, analyze comment depth and length
    return 72; // 72/100 quality score
  }

  /**
   * Calculate language diversity index using Shannon entropy (0-100)
   */
  calculateLanguageDiversity(languageStats) {
    if (!languageStats || languageStats.length === 0) return 0;

    const totalCount = languageStats.reduce(
      (sum, lang) => sum + lang.count,
      0
    );
    if (totalCount === 0) return 0;

    // Calculate Shannon entropy
    let entropy = 0;
    languageStats.forEach((lang) => {
      const proportion = lang.count / totalCount;
      if (proportion > 0) {
        entropy -= proportion * Math.log2(proportion);
      }
    });

    // Normalize to 0-100
    const maxEntropy = Math.log2(languageStats.length);
    const diversity = maxEntropy > 0 ? (entropy / maxEntropy) * 100 : 0;

    return Math.round(diversity * 10) / 10;
  }

  /**
   * Calculate growth rate between two periods
   */
  calculateGrowthRate(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Calculate period-over-period comparison
   */
  calculatePeriodComparison(currentData, previousData) {
    return {
      current: {
        items: currentData.totalItems || 0,
        avgPopularity: currentData.avgPopularity || 0,
        stars: currentData.githubStats?.totalStars || 0,
        points: currentData.hackerNewsStats?.totalPoints || 0,
      },
      previous: {
        items: previousData.totalItems || 0,
        avgPopularity: previousData.avgPopularity || 0,
        stars: previousData.githubStats?.totalStars || 0,
        points: previousData.hackerNewsStats?.totalPoints || 0,
      },
      change: {
        itemsPercent: this.calculateGrowthRate(
          currentData.totalItems,
          previousData.totalItems
        ),
        popularityPercent: this.calculateGrowthRate(
          currentData.avgPopularity,
          previousData.avgPopularity
        ),
        starsPercent: this.calculateGrowthRate(
          currentData.githubStats?.totalStars,
          previousData.githubStats?.totalStars
        ),
        pointsPercent: this.calculateGrowthRate(
          currentData.hackerNewsStats?.totalPoints,
          previousData.hackerNewsStats?.totalPoints
        ),
      },
    };
  }

  /**
   * Calculate percentile rank for a value in a dataset
   */
  calculatePercentileRank(value, dataset) {
    if (!dataset || dataset.length === 0) return 0;

    const sorted = [...dataset].sort((a, b) => a - b);
    const index = sorted.findIndex((v) => v >= value);

    if (index === -1) return 100; // Value is higher than all
    return Math.round((index / sorted.length) * 100);
  }

  /**
   * Get momentum badge based on score
   */
  getMomentumBadge(score) {
    if (score >= 80) return { type: "explosive", emoji: "🔥", label: "Explosive" };
    if (score >= 60) return { type: "rising", emoji: "⚡", label: "Rising" };
    if (score >= 40) return { type: "steady", emoji: "📈", label: "Steady" };
    if (score >= 20) return { type: "solid", emoji: "💎", label: "Solid" };
    return { type: "cooling", emoji: "⚠️", label: "Cooling" };
  }

  /**
   * Calculate age in days from timestamp
   */
  getAgeInDays(item) {
    const timestamp = item.timestamp || item.createdAt || Date.now();
    const ageMs = Date.now() - new Date(timestamp).getTime();
    return Math.floor(ageMs / (24 * 60 * 60 * 1000));
  }

  /**
   * Calculate 24-hour growth rate
   */
  calculate24HourGrowth(currentValue, value24hAgo) {
    if (!value24hAgo || value24hAgo === 0) return 0;
    return this.calculateGrowthRate(currentValue, value24hAgo);
  }

  /**
   * Calculate virality index for HackerNews stories
   */
  calculateViralityIndex(story) {
    if (story.source !== "hackernews") return 0;

    const points = story.points || 0;
    const comments = story.comments || 0;
    const ageInHours = this.getAgeInDays(story) * 24;

    if (ageInHours === 0) return 0;

    // Virality = (points growth rate * 0.5) + (comment rate * 0.3) + (recency bonus * 0.2)
    const pointsPerHour = points / ageInHours;
    const commentRate = comments / Math.max(1, points);
    const recencyBonus = Math.max(0, 1 - ageInHours / 48); // Bonus for first 48 hours

    const viralityScore =
      pointsPerHour * 0.5 + commentRate * 30 + recencyBonus * 20;

    return Math.round(viralityScore * 10) / 10;
  }

  /**
   * Analyze language growth trends
   * Returns leaders (high growth + high share), challengers (high growth + low share), etc.
   */
  analyzeLanguageGrowth(currentLanguageStats, previousLanguageStats) {
    const analysis = {
      leaders: [],
      challengers: [],
      established: [],
      declining: [],
    };

    currentLanguageStats.forEach((lang) => {
      const previousLang = previousLanguageStats?.find(
        (l) => l.language === lang.language
      );

      const currentShare = lang.percentage || 0;
      const growthRate = previousLang
        ? this.calculateGrowthRate(lang.count, previousLang.count)
        : 0;

      const langData = {
        language: lang.language,
        marketShare: currentShare,
        growthRate: Math.round(growthRate * 10) / 10,
        count: lang.count,
        stars: lang.stars,
      };

      // Classify languages
      if (currentShare > 15 && growthRate > 10) {
        analysis.leaders.push(langData); // High share, high growth
      } else if (currentShare < 15 && growthRate > 20) {
        analysis.challengers.push(langData); // Low share, high growth
      } else if (currentShare > 15 && growthRate < 10) {
        analysis.established.push(langData); // High share, stable/low growth
      } else if (growthRate < 0) {
        analysis.declining.push(langData); // Negative growth
      }
    });

    return analysis;
  }

  /**
   * Find velocity leaders (top items by growth acceleration)
   */
  findVelocityLeaders(items, limit = 3) {
    if (!items || items.length === 0) return [];

    // Calculate momentum for all items
    const itemsWithMomentum = items.map((item) => ({
      ...item,
      momentum: this.calculateMomentumScore(item),
    }));

    // Sort by momentum score
    const sorted = itemsWithMomentum.sort(
      (a, b) => b.momentum.score - a.momentum.score
    );

    // Return top N
    return sorted.slice(0, limit).map((item) => ({
      id: item.id,
      title: item.repository || item.title,
      source: item.source,
      momentumScore: item.momentum.score,
      growthRate: item.momentum.velocity,
      badge: this.getMomentumBadge(item.momentum.score),
    }));
  }
}

const analyticsMetricsService = new AnalyticsMetricsService();
module.exports = analyticsMetricsService;
