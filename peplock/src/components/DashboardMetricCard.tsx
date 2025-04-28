import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Rocket, AlertTriangle, BarChart3, ArrowUp, ArrowDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  subtitle: string;
  type: 'launches' | 'risk' | 'volume';
  isLoading?: boolean;
}

const iconMap = {
  launches: Rocket,
  risk: AlertTriangle,
  volume: BarChart3,
};

export const DashboardMetricCard = ({
  title,
  value,
  change,
  subtitle,
  type,
  isLoading = false
}: MetricCardProps) => {
  const Icon = iconMap[type];

  return (
    <Card
      className="
        bg-gradient-to-b from-black/10 to-violet-500/30
        p-6 backdrop-blur-lg border-0 border-white/5
        relative overflow-hidden
        shadow-none
        transition-all duration-500 ease-in-out 
        will-change-[box-shadow]
        hover:shadow-[inset_0_0_4px_rgba(139,92,246,0.1),0_0_6px_rgba(139,92,246,0.15)]
      "
    >
      <div className="absolute -top-[30%] -right-[25%] opacity-[2%]">
        {change >= 0
          ? <ArrowUp size={200} strokeWidth={2} />
          : <ArrowDown size={200} strokeWidth={2} />
        }
      </div>
      <div className="flex flex-col items-start text-left">
        <div className="w-10 h-10 mb-4 rounded-lg flex items-center justify-center bg-gradient-to-b from-violet-500/30 to-white/5">
          <Icon className="w-5 h-5 text-white" />
        </div>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-violet-950 rounded w-24 mb-2"></div>
            <div className="h-4 bg-violet-950 rounded w-16"></div>
          </div>
        ) : (
          <>
            <p className="text-white/60 text-xs font-mono uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-2xl font-archivo font-semibold text-white">{value}</h3>
              <div className={`flex items-center text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span>{Math.abs(change)}%</span>
              </div>
            </div>
          </>
        )}
        {subtitle && <p className="text-white/40 text-2xs font-mono mt-1">{subtitle}</p>}
      </div>
    </Card>
  );
};

export type { MetricCardProps };
