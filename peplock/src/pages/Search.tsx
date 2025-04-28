import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSearch } from "@/contexts/SearchContext";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface TopToken {
    symbol: string;
    address: string;
    volume: string;
}

// Define API response structure based on NewTokensTable.tsx
type TopLaunchToken = {
    current_price_usd: number;
    graduated_at: string;
    price_change_pct: number;
    symbol: string;
    token_address: string;
    volume_usd: number;
};

type TopLaunchesSuccessResponse = {
    success: true;
    data: {
        rows: TopLaunchToken[];
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

type TopLaunchesErrorResponse = {
    success: false;
    error: string;
};

type TopLaunchesResponse = TopLaunchesSuccessResponse | TopLaunchesErrorResponse;

export default function Search() {
    const navigate = useNavigate();
    const { handleTokenSearch } = useSearch();
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch top launches data from API
    const { data: topLaunchesData, isLoading } = trpc.dashboard.getTopLaunches.useQuery<TopLaunchesResponse>();

    // Format volume to K and M with 2 decimal places
    const formatVolume = (volume: number): string => {
        if (volume >= 1000000) {
            return `$${(volume / 1000000).toFixed(2)}M`;
        } else if (volume >= 1000) {
            return `$${(volume / 1000).toFixed(2)}K`;
        } else {
            return `$${volume.toFixed(2)}`;
        }
    };

    // Transform API data to match the TopToken interface
    const topTokens: TopToken[] = (() => {
        if (isLoading || !topLaunchesData) return [];

        // Type guard to check if it's a success response with data
        if (
            topLaunchesData.success === true &&
            'data' in topLaunchesData &&
            topLaunchesData.data?.rows
        ) {
            return topLaunchesData.data.rows
                .slice(0, 10) // Take only top 10
                .map(token => ({
                    symbol: token.symbol,
                    address: token.token_address,
                    volume: formatVolume(token.volume_usd)
                }));
        }

        return [];
    })();

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleTokenSearch(searchQuery);
        setSearchQuery('');
    };

    const handleTokenClick = (address: string) => {
        navigate(`/token/${address}`);
    };

    return (
        <div className="max-w-[1600px] min-h-screen mx-auto py-8 px-4 bg-gradient-to-br from-black to-primary/10">
            {/* Search Section */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold font-mono tracking-tight text-white mb-8">
                    Search Token
                </h1>
                <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto">
                    <div className="relative flex items-center">
                        <SearchIcon className="absolute left-4 h-5 w-5 text-white/40" />
                        <Input
                            type="text"
                            placeholder="Enter token address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-32 h-12 bg-white/5 border-white/10 text-base font-mono tracking-tight"
                        />
                        <Button
                            type="submit"
                            className="absolute right-2 bg-primary hover:bg-primary/90"
                        >
                            Search
                        </Button>
                    </div>
                </form>
            </div>

            {/* Top Tokens Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold font-archivo tracking-tight text-white mb-6">
                    Top 10 Tokens by 24h Volume
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ">
                    {isLoading ? (
                        // Loading state - show 10 placeholder skeletons
                        Array(10).fill(0).map((_, index) => (
                            <div
                                key={`loading-${index}`}
                                className="p-6 rounded-lg bg-white/5 backdrop-blur-lg border border-white/5 animate-pulse"
                            >
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mx-auto mb-3"></div>
                                <div className="text-center">
                                    <div className="h-5 bg-white/10 rounded w-16 mx-auto mb-1"></div>
                                    <div className="h-3 bg-white/10 rounded w-24 mx-auto mb-2"></div>
                                    <div className="h-4 bg-white/10 rounded w-12 mx-auto"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        topTokens.map((token) => (
                            <button
                                key={token.address}
                                onClick={() => handleTokenClick(token.address)}
                                className="p-6 rounded-lg bg-white/5 backdrop-blur-lg border border-white/5 hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mx-auto mb-3">
                                    <span className="text-primary text-xl font-mono">
                                        {token.symbol[0]}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-mono text-white mb-1">{token.symbol}</h3>
                                    <p className="text-xs text-white/60 font-mono mb-2">
                                        {token.address.slice(0, 6)}...{token.address.slice(-4)}
                                    </p>
                                    <p className="text-sm text-primary font-mono">{token.volume}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
} 