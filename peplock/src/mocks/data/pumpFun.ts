export const pumpFunMockData = {
  metrics: {
    newTokenLaunches: {
      value: 247,
      change: 12.5,
      subtitle: "Last 24 hours",
    },
    highRiskTokens: {
      value: 18,
      change: -23.4,
      subtitle: "Triggering multiple red flags",
    },
    totalVolume: {
      value: "$1.2M",
      change: 8.7,
      subtitle: "Daily on-chain volume",
    },
  },
  redFlagAlerts: [
    {
      id: 1,
      tokenName: "PEPE2",
      alert: "Suspicious wallet activity",
      severity: "high",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      tokenName: "DOGE3",
      alert: "Large sell pressure",
      severity: "medium",
      timestamp: new Date().toISOString(),
    },
  ],
  volumeBrackets: [
    { bracket: "$0-$1K", count: 156 },
    { bracket: "$1K-$10K", count: 89 },
    { bracket: "$10K-$100K", count: 34 },
    { bracket: "$100K+", count: 12 },
  ],
  newTokens: [
    {
      id: "1",
      name: "PEPE2",
      symbol: "PP2",
      launchTime: new Date().toISOString(),
      initialLiquidity: "$50K",
      currentPrice: "$0.00001",
      priceChange: 125.5,
      volume24h: "$250K",
      riskScore: 85,
    },
    {
      id: "2",
      name: "DOGE3",
      symbol: "DG3",
      launchTime: new Date().toISOString(),
      initialLiquidity: "$75K",
      currentPrice: "$0.0002",
      priceChange: -15.3,
      volume24h: "$180K",
      riskScore: 45,
    },
  ],
  chartData: Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    launches: Math.floor(Math.random() * 20),
    volume: Math.floor(Math.random() * 100000),
  })),
};
