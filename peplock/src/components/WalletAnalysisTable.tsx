import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Copy, Check, AlertTriangle, TrendingUp, Clock } from "lucide-react";
// import { trpc } from "@/lib/trpc";

// Wallet data type definition
type WalletData = {
    wallet_address: string;
    behavior_pattern: string;
    total_transactions: number;
    active_hours: string;
    total_sold: number;
    total_bought: number;
    risk_level: 'Low' | 'Medium' | 'High';
};

export const WalletAnalysisTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const itemsPerPage = 10;

    // Mock loading states until API is implemented
    const isLoading = false;
    const error = null;

    // Format wallet address for display (truncated)
    const formatAddress = (address: string): string => {
        if (!address) return "";
        return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
    };

    // Format currency values
    const formatCurrency = (amount: number): string => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(2)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(2)}K`;
        } else {
            return `$${amount.toFixed(2)}`;
        }
    };

    // Copy wallet address to clipboard with tooltip toast
    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedId(id);
                setTimeout(() => {
                    setCopiedId(null);
                }, 2000);
            })
            .catch(err => {
                console.error("Failed to copy address: ", err);
            });
    };

    // Mock data for demonstration
    const wallets: WalletData[] = [
        {
            wallet_address: "7X5Qz7EuDDJhRgJt2StPxbQKdReHLHJFvpzeDoLbyb3f",
            behavior_pattern: "Sniper",
            total_transactions: 248,
            active_hours: "01:00-06:00 UTC",
            total_sold: 183500,
            total_bought: 205700,
            risk_level: 'Low'
        },
        {
            wallet_address: "9zNYJjfTrpkPYKxBAqK4VnrKDVzBjpgT8GkHiNgMjrvJ",
            behavior_pattern: "Swing Trader",
            total_transactions: 427,
            active_hours: "08:00-16:00 UTC",
            total_sold: 523000,
            total_bought: 489000,
            risk_level: 'Medium'
        },
        {
            wallet_address: "3kT9PZxFKoqG3XfQbz6fm3rPRFPxFTWMDYPAJGt3QXdJ",
            behavior_pattern: "Whale",
            total_transactions: 942,
            active_hours: "All hours",
            total_sold: 2340000,
            total_bought: 2780000,
            risk_level: 'High'
        },
        {
            wallet_address: "DNfgHwMdQ4SGmGpUKMoJj9ELFvowcKwR7zBLdZDPxcP5",
            behavior_pattern: "Bot",
            total_transactions: 3245,
            active_hours: "All hours",
            total_sold: 850000,
            total_bought: 892000,
            risk_level: 'High'
        },
        {
            wallet_address: "E5ZJQuJY7fET4DAGJsZYYyW8uyyehCcnPri5YtD2CyFT",
            behavior_pattern: "Accumulator",
            total_transactions: 183,
            active_hours: "12:00-20:00 UTC",
            total_sold: 125000,
            total_bought: 345000,
            risk_level: 'Low'
        },
        {
            wallet_address: "A8VHQrYqEgNNifMy6YZQJvSAJj8NnhbU4W8G8jKLM9LH",
            behavior_pattern: "Retail",
            total_transactions: 62,
            active_hours: "16:00-23:00 UTC",
            total_sold: 8500,
            total_bought: 7200,
            risk_level: 'Low'
        },
        {
            wallet_address: "B9xQF2Z2TcpMFvD3q4KvVU7M8E8C6PNrwZXhkJM1REUm",
            behavior_pattern: "FOMO Trader",
            total_transactions: 147,
            active_hours: "Variable",
            total_sold: 215000,
            total_bought: 198000,
            risk_level: 'Medium'
        },
        {
            wallet_address: "CJG5CWBdYAFDK3GXikGUq8TVnbWKT7sZ3SgWHJxnJUSW",
            behavior_pattern: "Strategic",
            total_transactions: 324,
            active_hours: "04:00-12:00 UTC",
            total_sold: 478000,
            total_bought: 512000,
            risk_level: 'Medium'
        },
        {
            wallet_address: "D4TZ2yD9SNaSqL8RUVvs5FGmgUrEPXvZd2JuDyDteMF7",
            behavior_pattern: "Liquidity Provider",
            total_transactions: 768,
            active_hours: "All hours",
            total_sold: 1230000,
            total_bought: 1230000,
            risk_level: 'Low'
        },
        {
            wallet_address: "FPZqduT2oNgPvmCH3iLBxu4hUxjuSokVXrKNxDQVJRdB",
            behavior_pattern: "Arbitrageur",
            total_transactions: 1342,
            active_hours: "All hours",
            total_sold: 928000,
            total_bought: 935000,
            risk_level: 'Medium'
        },
        {
            wallet_address: "GTeQn56NxHu1JFsaEBW5qgV3LV4KCAaM1xj8JRfyS2HJ",
            behavior_pattern: "Flash Trader",
            total_transactions: 2165,
            active_hours: "Variable",
            total_sold: 1420000,
            total_bought: 1390000,
            risk_level: 'High'
        },
        {
            wallet_address: "H7j24UyPj9CdDEqaRvwLCHNBnfsXfCkGPq9UJNYe6VuE",
            behavior_pattern: "MEV Bot",
            total_transactions: 4521,
            active_hours: "All hours",
            total_sold: 2810000,
            total_bought: 2795000,
            risk_level: 'High'
        }
    ];

    const totalPages = Math.ceil(wallets.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const displayedWallets = wallets.slice(startIdx, startIdx + itemsPerPage);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // Pagination logic: show limited pages with ellipsis for many pages
    const getPageNumbers = () => {
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [1];
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        if (startPage > 2) {
            pages.push(-1); // -1 represents ellipsis
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i !== 1 && i !== totalPages && !pages.includes(i)) {
                pages.push(i);
            }
        }

        if (endPage < totalPages - 1) {
            pages.push(-2); // -2 represents ellipsis
        }

        if (totalPages > 1 && !pages.includes(totalPages)) {
            pages.push(totalPages);
        }

        return pages;
    };

    const getRiskBadge = (riskLevel: string) => {
        switch (riskLevel) {
            case 'Low':
                return <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">Low</span>;
            case 'Medium':
                return <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">Medium</span>;
            case 'High':
                return <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">High</span>;
            default:
                return <span className="px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs">Unknown</span>;
        }
    };

    return (
        <Card className="border-white/5 mt-6">
            <CardHeader className="border-b border-white/5">
                <CardTitle className="font-mono flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-b from-blue-500/30 to-white/5">
                        <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-archivo tracking-tighter opacity-85">Top Wallets Analysis</h3>
                        <p className="text-xs font-mono font-light tracking-tight text-white/60">Trading Patterns & Behavior</p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="py-8 text-center text-white/60">Loading wallet data...</div>
                ) : error ? (
                    <div className="py-8 text-center text-red-400">Error loading wallet data</div>
                ) : wallets.length === 0 ? (
                    <div className="py-8 text-center text-white/60">No wallet data available</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 bg-white/5">
                                <TableHead className="text-white/60 w-[170px]">Wallet Address</TableHead>
                                <TableHead className="text-white/60 w-[140px]">Behavior Pattern</TableHead>
                                <TableHead className="text-white/60 text-right w-[100px]">Transactions</TableHead>
                                <TableHead className="text-white/60 w-[120px]">Active Hours</TableHead>
                                <TableHead className="text-white/60 text-right w-[110px]">Total Sold</TableHead>
                                <TableHead className="text-white/60 text-right w-[110px]">Total Bought</TableHead>
                                <TableHead className="text-white/60 w-[100px] text-center">Risk Level</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedWallets.map((wallet, idx) => (
                                <TableRow
                                    key={`${wallet.wallet_address}-${startIdx + idx}`}
                                    className="border-white/5 hover:bg-white/5"
                                >
                                    <TableCell className="py-2">
                                        <div className="flex items-center gap-1 relative">
                                            <span className="font-mono text-sm text-white">{formatAddress(wallet.wallet_address)}</span>
                                            <div className="relative">
                                                {copiedId === wallet.wallet_address && (
                                                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded bg-black/40 backdrop-blur-sm text-white text-xs font-mono flex items-center gap-1 border border-white/10 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                                        <Check className="h-3 w-3 text-green-400" />
                                                        <span>Copied</span>
                                                    </div>
                                                )}
                                                <Copy
                                                    className="h-3 w-3 text-white/40 cursor-pointer hover:text-white/80 transition-colors"
                                                    onClick={() => copyToClipboard(wallet.wallet_address, wallet.wallet_address)}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm text-white py-2">
                                        {wallet.behavior_pattern}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm text-white py-2">
                                        {wallet.total_transactions.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm text-white/80 py-2">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-white/40" />
                                            <span>{wallet.active_hours}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm text-red-400 py-2">
                                        {formatCurrency(wallet.total_sold)}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm text-green-400 py-2">
                                        {formatCurrency(wallet.total_bought)}
                                    </TableCell>
                                    <TableCell className="text-center py-2">
                                        {getRiskBadge(wallet.risk_level)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            {/* Pagination Controls */}
            {wallets.length > 0 && (
                <div className="flex justify-center items-center space-x-2 py-3">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous page"
                    >
                        Prev
                    </button>

                    {getPageNumbers().map((page, idx) => {
                        if (page < 0) {
                            return (
                                <span key={`ellipsis-${page}-${idx}`} className="px-3 py-1 text-white/40">
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={`page-${page}`}
                                onClick={() => goToPage(page)}
                                className={`px-3 py-1 rounded hover:bg-white/20 ${currentPage === page ? 'bg-white/20 font-semibold' : 'bg-transparent'
                                    }`}
                                aria-label={`Page ${page}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next page"
                    >
                        Next
                    </button>
                </div>
            )}
        </Card>
    );
}; 