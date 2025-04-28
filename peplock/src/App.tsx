import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
// import { httpBatchLink } from "@trpc/client";
// import { trpc } from "@/lib/trpc";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { TokenPriceTickerBar } from "@/components/TokenPriceTickerBar";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Token from "./pages/Token";
import TokenAnalytics from "./pages/TokenAnalytics";
import WalletAnalysis from "./pages/WalletAnalysis";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { SearchProvider } from "./contexts/SearchContext";
import { Providers } from "./providers/Providers";
import { trpc } from "./lib/trpc";
import { httpBatchLink } from "@trpc/react-query";
const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",
        }),
      ],
    })
  );

  return (
    <Providers>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>

        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <div className="min-h-screen bg-background">
              <BrowserRouter>
                <SearchProvider>
                  <TokenPriceTickerBar />
                  <Sidebar />
                  <div className="md:pl-64">
                    <TopBar />
                    <main className="pt-[5.5rem] px-4 md:px-6 bg-black">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/token/:tokenAddress" element={<Token />} />
                        <Route path="/token" element={<Search />} />
                        <Route path="/wallet-analysis" element={<WalletAnalysis />} />
                        <Route path="/alerts" element={<Alerts />} />
                        <Route path="/settings" element={<Settings />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </SearchProvider>
              </BrowserRouter>
            </div>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </Providers>
  );
}

export default App;
