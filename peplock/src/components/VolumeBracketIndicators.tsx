import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import React from "react";

// Define type for the volume brackets data based on actual API response
type VolumeBracketRow = {
  token_count: number;
  volume_bracket: string;
};

export const VolumeBracketIndicators = () => {
  const { data, isLoading } = trpc.dashboard.getVolumeBrackets.useQuery();

  // Extract and transform the volume brackets data from the API response
  const volumeBrackets = React.useMemo(() => {
    try {
      // Type narrowing with type guard conditions
      if (!data) return [];
      if (typeof data !== 'object') return [];
      if (!('success' in data) || data.success !== true) return [];
      if (!('data' in data) || typeof data.data !== 'object' || !data.data) return [];

      const apiData = data.data;
      if (!('rows' in apiData) || !Array.isArray(apiData.rows)) return [];

      // Safe to work with the data now
      const rows = apiData.rows as VolumeBracketRow[];

      // Handle empty array case
      if (rows.length === 0) return [];

      // Find the maximum count to calculate percentages
      const maxCount = Math.max(...rows.map(row => row.token_count));

      return rows.map(row => ({
        label: row.volume_bracket,
        count: row.token_count,
        percentage: Math.round((row.token_count / maxCount) * 100)
      }));
    } catch (error) {
      console.error('Error processing volume bracket data:', error);
      return [];
    }
  }, [data]);

  return (
    <Card className="glass-card p-6">
      <h3 className="text-xs font-mono uppercase text-white/60 tracking-wider mb-3">Volume Brackets</h3>
      <div className="space-y-3">
        {isLoading ? (
          <div className="h-24 flex items-center justify-center">
            <span className="text-white/60">Loading...</span>
          </div>
        ) : volumeBrackets.length > 0 ? (
          volumeBrackets.map((bracket) => (
            <div key={bracket.label} className="space-y-1.5">
              <div className="flex justify-between items-center text-2xs">
                <span className="text-white/80 font-mono">{bracket.label}</span>
                <span className="text-white/80 font-mono">{bracket.count} tokens</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${bracket.percentage}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-24 flex items-center justify-center">
            <span className="text-white/60">No data available</span>
          </div>
        )}
      </div>
    </Card>
  );
};
