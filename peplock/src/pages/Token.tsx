import { useParams } from "react-router-dom";
import { Copy, AlertTriangle, TrendingDown, Clock, Activity, DollarSign, AlertCircle, BarChart3, Wallet, CheckCircle, ArrowUpDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from 'recharts';
import { trpc } from "@/lib/trpc";

// Mock data for demonstration
const mockPriceData = [
    { time: '00:00', price: 1.2, volume: 20 },
    { time: '04:00', price: 1.8, volume: 35 },
    { time: '08:00', price: 1.4, volume: 25 },
    { time: '12:00', price: 0.8, volume: 40 },
    { time: '16:00', price: 0.3, volume: 15 },
    { time: '20:00', price: 0.1, volume: 5 },
];

const mockTransactions = [
    { from: 'Creator', to: '0x5678...', amount: '1,000,000', time: '2 hours ago', type: 'sell' },
    { from: '0x8765...', to: 'Exchange', amount: '500,000', time: '1 hour ago', type: 'swap' },
    { from: '0x1234...', to: '0xABCD...', amount: '750,000', time: '45 minutes ago', type: 'transfer' },
];

// Define the token info type based on the API response
interface TokenInfo {
    name?: string;
    symbol?: string;
    current_holders?: number;
}

// Define the holder info type
interface HolderInfo {
    holder?: string;
    balance?: string;
    holding?: string;
    supply?: string;
}

// Define the price data type
interface PriceData {
    block_time: string;
    price: number;
}

// Define the volume data type
interface VolumeData {
    day: string;
    volume_usd: number;
}

// Format holding as percentage with 1 decimal place
const formatPercentage = (holding?: string) => {
    if (!holding) return "0.0%";
    const holdingNum = parseFloat(holding);
    return (holdingNum * 100).toFixed(1) + "%";
};

// Format price with 8 decimal places
const formatPrice = (price?: number) => {
    if (!price) return "$0.00000000";
    return `$${price.toFixed(8)}`;
};

export default function Token() {
    const { tokenAddress } = useParams<{ tokenAddress: string }>();
    const isRugged = true; // This would be determined by your backend logic

    // Fetch token data from our API
    const { data: tokenData, isLoading } = trpc.token.getTokenInfo.useQuery(
        { tokenId: tokenAddress || "" },
        { enabled: !!tokenAddress }
    );

    // Fetch top holders
    const { data: holdersData, isLoading: isLoadingHolders } = trpc.token.getTopHolders.useQuery(
        { tokenId: tokenAddress || "" },
        { enabled: !!tokenAddress }
    );

    // Fetch price data
    const { data: priceData, isLoading: isLoadingPrice } = trpc.token.getPriceData.useQuery(
        { tokenId: tokenAddress || "" },
        { enabled: !!tokenAddress }
    );

    // Add new query for volume data
    const { data: volumeData, isLoading: isLoadingVolume } = trpc.analysis.getTokenVolume.useQuery(
        { tokenId: tokenAddress || "" },
        { enabled: !!tokenAddress }
    );

    const tokenInfo = tokenData && tokenData.success && 'data' in tokenData
        ? tokenData.data?.rows?.[0] as TokenInfo || null
        : null;

    const topHolders = holdersData && holdersData.success && 'data' in holdersData
        ? holdersData.data?.rows as HolderInfo[] || []
        : [];

    const priceHistory = priceData && priceData.success && 'data' in priceData
        ? (priceData.data.rows as unknown as PriceData[]) || []
        : [];

    const latestPrice = priceData && priceData.success && 'data' in priceData
        ? priceData.data.latestPrice as number
        : 0;

    const previousPrice = priceHistory.length > 1 ? priceHistory[priceHistory.length - 2].price : latestPrice;
    const priceChange = previousPrice > 0 ? ((latestPrice - previousPrice) / previousPrice) * 100 : 0;

    const volumeHistory = volumeData && volumeData.success && 'data' in volumeData
        ? (volumeData.data.rows as unknown as VolumeData[] || [])
            .slice(0, 7) // Get first 7 days
            .map(item => ({
                ...item,
                volume_usd: Number(item.volume_usd) || 0
            }))
        : [];

    const handleCopyAddress = () => {
        if (tokenAddress) {
            navigator.clipboard.writeText(tokenAddress);
        }
    };

    return (
        <div className="py-6">
            {/* Rug Alert Banner */}
            {isRugged && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <span className="text-red-400 font-archivo font-medium text-xs">HIGH RISK ALERT: Potential Rug Pull Detected</span>
                    </div>
                </div>
            )}

            {/* Token Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        {isLoading ? "Loading..." : tokenInfo?.name || "Unknown"} ({isLoading ? "..." : tokenInfo?.symbol || "???"})
                    </h1>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <span className="text-xs font-mono text-white/60">
                            {tokenAddress?.slice(0, 8)}...{tokenAddress?.slice(-6)}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0"
                            onClick={handleCopyAddress}
                        >
                            <Copy className="h-3.5 w-3.5 text-white/40 hover:text-white" />
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-white/60">
                    Created May 1, 2024 • Last active 2 hours ago
                </p>
            </div>

            {/* Token Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-card p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xs text-white/50 uppercase">Current Price</h3>
                        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500/30 to-red-400/10">
                            <DollarSign className="h-3.5 w-3.5 text-red-400" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-mono font-bold text-white">
                            {isLoadingPrice ? "..." : formatPrice(latestPrice)}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${priceChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            {isLoadingPrice ? "..." : `${priceChange.toFixed(2)}%`}
                        </span>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xs text-white/50 uppercase">Current Holders</h3>
                        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-blue-400/10">
                            <Users className="h-3.5 w-3.5 text-blue-400" />
                        </div>
                    </div>
                    <span className="text-xl font-mono font-bold text-white">
                        {isLoading ? "..." : (tokenInfo?.current_holders?.toLocaleString() || "0")}
                    </span>
                </div>

                <div className="glass-card p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xs text-white/50 uppercase">Liquidity</h3>
                        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-purple-400/10">
                            <ArrowUpDown className="h-3.5 w-3.5 text-purple-400" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold font-mono text-white">$12,345</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">-95%</span>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xs text-white/50 uppercase">Risk Level</h3>
                        <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500/30 to-red-400/10">
                            <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-red-400">High</span>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Price Chart & Risk Indicators */}
                <div className=" lg:col-span-2 space-y-6">
                    {/* Price Chart */}
                    <div className="glass-card rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-sm font-medium text-white">Price History</h2>
                        </div>
                        <div className="p-4">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={priceHistory}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis
                                            dataKey="block_time"
                                            stroke="rgba(255,255,255,0.3)"
                                            fontSize={12}
                                            tickFormatter={(value) => {
                                                const date = new Date(value);
                                                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            }}
                                        />
                                        <YAxis
                                            stroke="rgba(255,255,255,0.3)"
                                            fontSize={12}
                                            tickFormatter={(value) => `$${value.toFixed(8)}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(0,0,0,0.8)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '4px',
                                                fontSize: '12px'
                                            }}
                                            formatter={(value: unknown) => {
                                                const numValue = Number(value);
                                                return [`$${numValue.toFixed(8)}`, 'Price'];
                                            }}
                                            labelFormatter={(label) => new Date(label as string).toLocaleString()}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorPrice)"
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Risk Indicators */}
                    <div className="glass-card rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-sm font-medium text-white">Rug Pull Indicators</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-md bg-red-500/10 border border-red-500/20">
                                <div className="mt-0.5">
                                    <DollarSign className="h-4 w-4 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-white mb-1">Liquidity Removal</h3>
                                    <p className="text-xs text-white/60">95% of liquidity was removed in a single transaction at 15:30 UTC, 2 hours after launch.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-md bg-green-500/10 border border-green-500/20">
                                <div className="mt-0.5">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-white mb-1">Contract Verification</h3>
                                    <p className="text-xs text-white/60">Contract is fully verified on blockchain explorer with readable source code.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-md bg-red-500/10 border border-red-500/20">
                                <div className="mt-0.5">
                                    <Activity className="h-4 w-4 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-white mb-1">Activity Collapse</h3>
                                    <p className="text-xs text-white/60">Transaction volume dropped to near-zero after price crash.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Holders Table - Moved here and made bigger */}
                    <div className="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-sm font-medium text-white">Top Holders</h2>
                        </div>
                        <div className="overflow-hidden">
                            {isLoadingHolders ? (
                                <div className="p-4 text-center text-white/60">Loading holders data...</div>
                            ) : topHolders.length === 0 ? (
                                <div className="p-4 text-center text-white/60">No holders data available</div>
                            ) : (
                                <div className="w-full">
                                    <div className="bg-white/5 border-b border-white/10 px-4 py-2">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-xs font-medium text-white/60">Holder Address</div>
                                            <div className="text-xs font-medium text-white/60 text-right">Balance</div>
                                            <div className="text-xs font-medium text-white/60 text-right">% of Supply</div>
                                        </div>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {topHolders.map((holder, index) => (
                                            <div key={index} className="px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="text-xs font-mono text-white truncate">
                                                        {holder.holder?.slice(0, 6)}...{holder.holder?.slice(-4)}
                                                    </div>
                                                    <div className="text-xs font-mono text-white text-right">
                                                        {parseFloat(holder.balance || "0").toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                    </div>
                                                    <div className="text-xs font-mono text-white text-right">
                                                        {formatPercentage(holder.holding)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Fund Movement Tracker & Volume Chart */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Transaction Flow Analysis */}
                    <div className="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-sm font-medium text-white">Fund Movement</h2>
                        </div>
                        <div className="px-4 py-2">
                            <div className="space-y-2">
                                {mockTransactions.map((tx, index) => (
                                    <div key={index} className="p-3 border-b border-white/5 last:border-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs font-medium text-white">
                                                {tx.from} → {tx.to}
                                            </div>
                                            <div className="text-xs text-white/40">
                                                {tx.time}
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="text-sm font-medium text-white">
                                                {tx.amount} PEPE
                                            </div>
                                            <div className={`text-xs px-1.5 py-0.5 rounded ${tx.type === 'sell'
                                                ? 'bg-red-500/20 text-red-400'
                                                : tx.type === 'swap'
                                                    ? 'bg-yellow-500/20 text-yellow-400'
                                                    : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {tx.type}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-3 border-t border-white/10 bg-white/5">
                            <Button variant="outline" size="sm" className="w-full text-xs">
                                View All Transactions
                            </Button>
                        </div>
                    </div>

                    {/* Volume Chart */}
                    <div className="rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-sm font-medium text-white">Volume (Last 7 Days)</h2>
                        </div>
                        <div className="p-4">
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={volumeHistory}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis
                                            dataKey="day"
                                            stroke="rgba(255,255,255,0.3)"
                                            fontSize={12}
                                            tickFormatter={(value) => {
                                                const date = new Date(value);
                                                return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                            }}
                                        />
                                        <YAxis
                                            stroke="rgba(255,255,255,0.3)"
                                            fontSize={12}
                                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(0,0,0,0.8)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '4px',
                                                fontSize: '12px'
                                            }}
                                            formatter={(value: unknown) => {
                                                const numValue = Number(value);
                                                return [`$${numValue.toLocaleString()}`, 'Volume'];
                                            }}
                                            labelFormatter={(label) => new Date(label as string).toLocaleDateString()}
                                        />
                                        <Bar
                                            dataKey="volume_usd"
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 