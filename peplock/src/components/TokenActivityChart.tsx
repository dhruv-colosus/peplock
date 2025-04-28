import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
} from "recharts";
import { trpc } from "@/lib/trpc";

type ChartMetric = "new_users" | "recurring_users" | "combined";

// Define API response structure
type ChartDataSuccessResponse = {
  success: true;
  data: {
    rows: Array<{
      day: string;
      new_users: number;
      recurring_users: number;
    }>;
    metadata?: {
      column_names?: string[];
      datapoint_count?: number;
      execution_time_millis?: number;
      pending_time_millis?: number;
      result_set_bytes?: number;
      row_count?: number;
      total_result_set_bytes?: number;
      total_row_count?: number;
    };
  };
};

type ChartDataErrorResponse = {
  success: false;
  error: string;
};

type ChartDataResponse = ChartDataSuccessResponse | ChartDataErrorResponse;

// Format date for display
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const TokenActivityChart = () => {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>("new_users");
  const { data: chartData, isLoading } = trpc.dashboard.getchartdata.useQuery();

  const formattedData = chartData && 'success' in chartData && chartData.success && 'data' in chartData && chartData.data.rows
    ? chartData.data.rows.map(row => ({
      ...row,
      formattedDate: formatDate(row.day as string)
    }))
    : [];

  return (
    <Card className="glass-card p-4 h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-archivo tracking-tighter font-bold opacity-85">
          User Activity
        </h3>
        <div className="flex gap-2">
          {(["new_users", "recurring_users", "combined"] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              className={`px-3 py-1 text-xs font-mono rounded-md ${activeMetric === metric
                ? "bg-primary text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
            >
              {metric === "new_users" ? "New Users" :
                metric === "recurring_users" ? "Recurring Users" :
                  "Combined"}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/60">Loading chart data...</p>
          </div>
        ) : (
          <ComposedChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="newUsersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="15%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="recurringUserGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="15%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="formattedDate"
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              tickLine={false}
              width={30}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(23, 23, 28, 0.95)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
              itemStyle={{ color: "#fff" }}
              labelStyle={{ color: "rgba(255,255,255,0.7)" }}
              formatter={(value: number) => new Intl.NumberFormat().format(value)}
              labelFormatter={(label) => label}
            />
            <Legend wrapperStyle={{ color: "#fff", fontSize: "10px" }} />

            {(activeMetric === "new_users" || activeMetric === "combined") && (
              <>
                <Area
                  type="monotone"
                  dataKey="new_users"
                  fill="url(#newUsersGradient)"
                  stroke="none"
                  isAnimationActive={false}
                  name="New Users"
                />
                <Line
                  type="natural"
                  dataKey="new_users"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                  name="New Users"
                  connectNulls
                />
              </>
            )}

            {(activeMetric === "recurring_users" || activeMetric === "combined") && (
              <>
                <Area
                  type="monotone"
                  dataKey="recurring_users"
                  fill="url(#recurringUserGradient)"
                  stroke="none"
                  isAnimationActive={false}
                  name="Recurring Users"
                />
                <Line
                  type="natural"
                  dataKey="recurring_users"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                  name="Recurring Users"
                  connectNulls
                />
              </>
            )}
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
};
