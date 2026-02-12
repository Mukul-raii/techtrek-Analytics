// Mock data based on API documentation structure

export const mockDashboardMetrics = {
  totalRepositories: {
    value: "3,142",
    change: 12.5,
    trend: "up" as const,
  },
  activeStories: {
    value: "2,847",
    change: 8.2,
    trend: "up" as const,
  },
  topLanguages: {
    value: "28",
    change: 5.3,
    trend: "up" as const,
  },
  avgStars: {
    value: "257K",
    change: 15.7,
    trend: "up" as const,
  },
};

export const mockLanguageStats = [
  {
    rank: 1,
    language: "TypeScript",
    repositories: "342",
    stars: "1.2M",
    percentage: 22,
    trend: "+8.2%",
  },
  {
    rank: 2,
    language: "Python",
    repositories: "298",
    stars: "980K",
    percentage: 19,
    trend: "+12.1%",
  },
  {
    rank: 3,
    language: "JavaScript",
    repositories: "267",
    stars: "856K",
    percentage: 17,
    trend: "-2.3%",
  },
  {
    rank: 4,
    language: "Go",
    repositories: "198",
    stars: "634K",
    percentage: 13,
    trend: "+5.7%",
  },
  {
    rank: 5,
    language: "Rust",
    repositories: "154",
    stars: "512K",
    percentage: 10,
    trend: "+18.4%",
  },
  {
    rank: 6,
    language: "Java",
    repositories: "128",
    stars: "428K",
    percentage: 8,
    trend: "+3.1%",
  },
];

export const mockTrendingRepositories = [
  {
    id: "github-1",
    repository: "codecrafters-io/build-your-own-x",
    description: "Master programming by recreating your favorite technologies from scratch.",
    stars: "464,908",
    forks: "43,652",
    language: "Markdown",
    trend: "+12.5%",
  },
  {
    id: "github-2",
    repository: "google/gemma.cpp",
    description: "lightweight, standalone C++ inference engine for Google's Gemma models.",
    stars: "18,923",
    forks: "1,456",
    language: "C++",
    trend: "+42.3%",
  },
  {
    id: "github-3",
    repository: "anthropics/anthropic-sdk-python",
    description: "The Anthropic Python library provides convenient access to the Anthropic API.",
    stars: "8,234",
    forks: "512",
    language: "Python",
    trend: "+28.7%",
  },
  {
    id: "github-4",
    repository: "vercel/next.js",
    description: "The React Framework for Production",
    stars: "128,456",
    forks: "28,934",
    language: "TypeScript",
    trend: "+5.2%",
  },
  {
    id: "github-5",
    repository: "facebook/react",
    description: "A JavaScript library for building user interfaces.",
    stars: "233,567",
    forks: "47,234",
    language: "JavaScript",
    trend: "+3.1%",
  },
];

export const mockTrendingStories = [
  {
    id: "hn-1",
    title: "Frontier AI agents violate ethical constraints 30–50% of time",
    points: "191",
    comments: "117",
    author: "tiny-automates",
    trend: "+15%",
  },
  {
    id: "hn-2",
    title: "Large Language Models Can Self-Improve at Test Time",
    points: "423",
    comments: "267",
    author: "dang",
    trend: "+28%",
  },
  {
    id: "hn-3",
    title: "Why I Am Leaving Capitalism Behind",
    points: "234",
    comments: "142",
    author: "sohkamyung",
    trend: "+12%",
  },
  {
    id: "hn-4",
    title: "PostgreSQL: 25 Years of innovation",
    points: "512",
    comments: "289",
    author: "kiyanwang",
    trend: "+34%",
  },
  {
    id: "hn-5",
    title: "The Hidden Costs of Microservices",
    points: "678",
    comments: "356",
    author: "dragonwriter",
    trend: "+42%",
  },
];

export const mockSourceStatistics = {
  github: {
    totalRepositories: 3142,
    totalStars: 7708631,
    totalForks: 1285619,
    avgStars: 256954,
    topLanguages: ["TypeScript", "Python", "JavaScript", "Go", "Rust"],
  },
  hackernews: {
    totalStories: 2847,
    totalPoints: 618234,
    totalComments: 478765,
    avgPoints: 217,
    avgComments: 168,
  },
};

export const mockActivityData = [
  { date: "2026-02-06", repositories: 245, stories: 198, stars: 12450 },
  { date: "2026-02-07", repositories: 268, stories: 212, stars: 14230 },
  { date: "2026-02-08", repositories: 291, stories: 225, stars: 16890 },
  { date: "2026-02-09", repositories: 312, stories: 238, stars: 18234 },
  { date: "2026-02-10", repositories: 328, stories: 251, stars: 21567 },
  { date: "2026-02-11", repositories: 345, stories: 267, stars: 24890 },
  { date: "2026-02-12", repositories: 368, stories: 283, stars: 28345 },
];

export const mockTopRepositories = [
  {
    rank: 1,
    name: "build-your-own-x",
    owner: "codecrafters-io",
    stars: "464K",
    forks: "43K",
    language: "Markdown",
  },
  {
    rank: 2,
    name: "react",
    owner: "facebook",
    stars: "234K",
    forks: "47K",
    language: "JavaScript",
  },
  {
    rank: 3,
    name: "next.js",
    owner: "vercel",
    stars: "128K",
    forks: "29K",
    language: "TypeScript",
  },
  {
    rank: 4,
    name: "typescript",
    owner: "microsoft",
    stars: "99K",
    forks: "12K",
    language: "TypeScript",
  },
  {
    rank: 5,
    name: "kubernetes",
    owner: "kubernetes",
    stars: "112K",
    forks: "41K",
    language: "Go",
  },
];
