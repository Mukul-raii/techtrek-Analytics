// Date formatting utilities
export const formatDate = (date: string | number): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
};

export const formatRelativeTime = (date: string | number): string => {
  const now = Date.now();
  const then = typeof date === 'string' ? new Date(date).getTime() : date;
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  
  return formatDate(date);
};

// Number formatting utilities
export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// String utilities
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// URL utilities
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getGithubRepoName = (url: string): string => {
  const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
  return match ? match[1] : '';
};

// Color utilities for charts
export const getLanguageColor = (language: string): string => {
  const colors: Record<string, string> = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3776ab',
    Java: '#007396',
    Go: '#00add8',
    Rust: '#ce422b',
    Ruby: '#cc342d',
    PHP: '#777bb4',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#239120',
    Swift: '#ffac45',
    Kotlin: '#7f52ff',
    Dart: '#0175c2',
    Shell: '#89e051',
  };
  
  return colors[language] || '#94a3b8';
};
