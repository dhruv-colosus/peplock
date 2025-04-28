export const goFundMeMockData = {
  metrics: {
    newTokenLaunches: {
      value: 183,
      change: -5.2,
      subtitle: "Last 24 hours",
    },
    highRiskTokens: {
      value: 25,
      change: 15.7,
      subtitle: "Triggering multiple red flags",
    },
    totalVolume: {
      value: "$890K",
      change: -12.3,
      subtitle: "Daily on-chain volume",
    },
  },
  redFlagAlerts: [
    {
      id: 1,
      tokenName: "MOON1",
      alert: "Contract verification failed",
      severity: "high",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      tokenName: "STAR2",
      alert: "Honeypot risk detected",
      severity: "high",
      timestamp: new Date().toISOString(),
    },
  ],
  volumeBrackets: [
    { bracket: "$0-$1K", count: 123 },
    { bracket: "$1K-$10K", count: 67 },
    { bracket: "$10K-$100K", count: 28 },
    { bracket: "$100K+", count: 8 },
  ],
  newTokens: [
    {
      id: "1",
      name: "MOON1",
      symbol: "MN1",
      launchTime: new Date().toISOString(),
      initialLiquidity: "$35K",
      currentPrice: "$0.000005",
      priceChange: -45.2,
      volume24h: "$150K",
      riskScore: 92,
    },
    {
      id: "2",
      name: "STAR2",
      symbol: "STR",
      launchTime: new Date().toISOString(),
      initialLiquidity: "$60K",
      currentPrice: "$0.0003",
      priceChange: 78.5,
      volume24h: "$220K",
      riskScore: 65,
    },
  ],
  chartData: Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    launches: Math.floor(Math.random() * 15),
    volume: Math.floor(Math.random() * 75000),
  })),
};
