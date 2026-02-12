// Helper functions for chart data formatting

export function formatChartData(data: any[], key: string) {
  return data.map((item) => ({
    ...item,
    [key]: item[key],
  }));
}

export function getChartColors(index: number) {
  const colors = [
    "#1f2937", // dark gray
    "#6b7280", // medium gray
    "#9ca3af", // light gray
    "#d1d5db", // lighter gray
  ];
  return colors[index % colors.length];
}

export function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export const chartConfig = {
  repositories: {
    label: "Repositories",
    color: "#1f2937",
  },
  stories: {
    label: "Stories",
    color: "#6b7280",
  },
  stars: {
    label: "Stars",
    color: "#9ca3af",
  },
};
