import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const ITEMS_PER_PAGE = 5;

export const RedFlagAlerts = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - replace with real data later
  const alerts = [
    { id: 1, token: "PEPE", risk: "High sell pressure", time: "2m ago" },
    { id: 2, token: "DOGE", risk: "Unusual trading pattern", time: "5m ago" },
    { id: 3, token: "SHIB", risk: "Large wallet movement", time: "10m ago" },
    { id: 4, token: "FLOKI", risk: "Contract interaction", time: "15m ago" },
    { id: 5, token: "WOJAK", risk: "Liquidity removal", time: "20m ago" },
    { id: 6, token: "BONK", risk: "High sell pressure", time: "25m ago" },
    { id: 7, token: "SAMO", risk: "Unusual pattern", time: "30m ago" },
  ];

  const totalPages = Math.ceil(alerts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentAlerts = alerts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <Card className="border-white/5">
      <CardHeader className="border-b border-white/5">
        <CardTitle className="text-lg font-archivo flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Red Flag Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] flex flex-col justify-between">
          <div className="divide-y divide-white/5">
            {currentAlerts.map((alert) => (
              <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-white/5">
                <div>
                  <h3 className="font-mono text-sm text-white">{alert.token}</h3>
                  <p className="text-xs text-white/60">{alert.risk}</p>
                </div>
                <span className="text-xs text-white/40">{alert.time}</span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-white/5 flex items-center justify-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 p-0 ${currentPage === page
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "text-white/60 hover:text-white border-white/10"
                  }`}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
