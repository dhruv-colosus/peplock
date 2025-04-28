
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const transactionData = [
  { name: "Organic Transactions", value: 65 },
  { name: "Bot Transactions", value: 35 },
];

const selloffData = [
  { name: "Normal Selling", value: 70 },
  { name: "Rapid Dumps", value: 30 },
];

const COLORS = ["#8B5CF6", "#EF4444"];

export const ActivityOverview = () => {
  return (
    <Card className="glass-card p-6">
      <h3 className="text-xs font-mono uppercase text-white/60 tracking-wider mb-4">Activity Overview</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xs text-white/60 font-mono mb-2 text-center">Transaction Types</p>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transactionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                >
                  {transactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(23, 23, 28, 0.95)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    fontSize: "12px"
                  }}
                />
                <Legend 
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ fontSize: "10px", color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <p className="text-2xs text-white/60 font-mono mb-2 text-center">Sell-off Patterns</p>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={selloffData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                >
                  {selloffData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(23, 23, 28, 0.95)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    fontSize: "12px"
                  }}
                />
                <Legend 
                  layout="vertical"
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ fontSize: "10px", color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-archivo text-white">$1.2M</p>
            <p className="text-2xs text-white/40 font-mono">Daily On-chain Volume</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-archivo text-white">21</p>
            <p className="text-2xs text-white/40 font-mono">Rapid Sell-off Incidents</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
