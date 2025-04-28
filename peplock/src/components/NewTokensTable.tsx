import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowUpRight, TrendingUp, Copy, ExternalLink, Check, AlertTriangle } from "lucide-react";
import { trpc } from "@/lib/trpc";

// Token type definition based on the API response
type TopLaunchToken = {
  current_price_usd: number;
  graduated_at: string;
  price_change_pct: number;
  symbol: string;
  token_address: string;
  volume_usd: number;
  pct_supply_top10_wallets?: number;
};

// Define API response structure
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

export const NewTokensTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const itemsPerPage = 20;

  // Fetch top launches data
  const { data: topLaunchesData, isLoading, error } = trpc.dashboard.getTopLaunches.useQuery();

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

  // Format wallet concentration percentage
  const formatWalletConcentration = (pct?: number | string): string => {
    if (pct === undefined || pct === null) return "N/A";

    // Convert to number if it's a string
    const numericPct = typeof pct === 'string' ? parseFloat(pct) : pct;

    // Check if it's a valid number after conversion
    if (isNaN(numericPct)) return "N/A";

    return `${numericPct.toFixed(2)}%`;
  };

  // Check if wallet concentration is high (over 80%)
  const isHighWalletConcentration = (pct?: number | string): boolean => {
    if (pct === undefined || pct === null) return false;

    // Convert to number if it's a string
    const numericPct = typeof pct === 'string' ? parseFloat(pct) : pct;

    // Check if it's a valid number after conversion
    if (isNaN(numericPct)) return false;

    return numericPct > 80;
  };

  // Calculate time since graduation
  const formatTimeSince = (dateString: string): string => {
    try {
      const graduatedDate = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - graduatedDate.getTime();

      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
      }
    } catch (error) {
      return "Invalid date";
    }
  };

  // Copy token address to clipboard with tooltip toast
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

  // Open token on GeckoTerminal
  const openGeckoTerminal = (tokenAddress: string) => {
    window.open(`https://www.geckoterminal.com/solana/tokens/${tokenAddress}`, "_blank");
  };

  // Format token address for display (truncated)
  const formatAddress = (address: string): string => {
    if (!address) return "";
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  // Get tokens data with error handling
  const tokens: TopLaunchToken[] = (() => {
    if (isLoading || error || !topLaunchesData) return [];

    try {
      // Type guard to check if it's a success response with data
      if (
        topLaunchesData.success === true &&
        'data' in topLaunchesData &&
        topLaunchesData.data?.rows
      ) {
        return topLaunchesData.data.rows as TopLaunchToken[];
      }
      return [];
    } catch (err) {
      console.error("Error parsing token data:", err);
      return [];
    }
  })();

  const totalPages = Math.ceil(tokens.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const displayedTokens = tokens.slice(startIdx, startIdx + itemsPerPage);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Pagination logic: show limited pages with ellipsis for many pages
  const getPageNumbers = () => {
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than the max, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Start with the first page
    const pages = [1];

    // Calculate the range of pages to show around the current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis before the range if needed
    if (startPage > 2) {
      pages.push(-1); // -1 represents ellipsis
    } else if (startPage === 2) {
      // Don't add page 2 here, it will be added in the loop below
    }

    // Add the range of pages
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages && !pages.includes(i)) {
        pages.push(i);
      }
    }

    // Add ellipsis after the range if needed
    if (endPage < totalPages - 1) {
      pages.push(-2); // -2 represents ellipsis
    } else if (endPage === totalPages - 1) {
      if (!pages.includes(totalPages - 1)) {
        pages.push(totalPages - 1);
      }
    }

    // Add the last page if it's not already included
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Card className="border-white/5 mt-6">
      <CardHeader className="border-b border-white/5">
        <CardTitle className="font-mono flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-b from-violet-500/30 to-white/5">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-archivo tracking-tighter opacity-85">Top Token Volumes</h3>
            <p className="text-xs font-mono font-light tracking-tight text-white/60">Past 24 Hrs</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="py-8 text-center text-white/60">Loading token data...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-400">Error loading token data</div>
        ) : tokens.length === 0 ? (
          <div className="py-8 text-center text-white/60">No token data available</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 bg-white/5">
                <TableHead className="text-white/60 w-[160px]">Token</TableHead>
                <TableHead className="text-white/60 text-right w-[120px]">Price</TableHead>
                <TableHead className="text-white/60 text-right w-[120px]">24h Change</TableHead>
                <TableHead className="text-white/60 text-right w-[100px]">Volume</TableHead>
                <TableHead className="text-white/60 text-right w-[120px]">Top 10 Wallet</TableHead>
                <TableHead className="text-white/60 text-right w-[150px]">Token Address</TableHead>
                <TableHead className="text-white/60 text-right w-[100px]">Launched</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTokens.map((token, idx) => (
                <TableRow
                  key={`${token.token_address}-${startIdx + idx}`}
                  className="border-white/5 hover:bg-white/5"
                >
                  <TableCell className="py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-xs font-mono">{token.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-sm text-white">{token.symbol}</span>
                          <ExternalLink
                            className="h-3 w-3 text-white/40 cursor-pointer"
                            onClick={() => openGeckoTerminal(token.token_address)}
                          />
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-white py-1">
                    ${token.current_price_usd.toFixed(3)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-mono text-sm py-1 ${token.price_change_pct >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {token.price_change_pct >= 0 ? '+' : ''}{token.price_change_pct.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-white py-1">
                    {formatVolume(token.volume_usd)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm py-1">
                    <div className="flex items-center justify-end">
                      <span className={isHighWalletConcentration(token.pct_supply_top10_wallets) ? 'text-amber-500' : 'text-white'}>
                        {formatWalletConcentration(token.pct_supply_top10_wallets)}
                      </span>
                      {isHighWalletConcentration(token.pct_supply_top10_wallets) && (
                        <AlertTriangle className="h-3 w-3 text-amber-500 ml-1" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-white py-1">
                    <div className="flex items-center justify-end gap-1 relative">
                      <span>{formatAddress(token.token_address)}</span>
                      <div className="relative">
                        {copiedId === token.token_address && (
                          <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded bg-black/40 backdrop-blur-sm text-white text-xs font-mono flex items-center gap-1 border border-white/10 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                            <Check className="h-3 w-3 text-green-400" />
                            <span>Copied</span>
                          </div>
                        )}
                        <Copy
                          className="h-3 w-3 text-white/40 cursor-pointer hover:text-white/80 transition-colors"
                          onClick={() => copyToClipboard(token.token_address, token.token_address)}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-white/60 py-1">
                    {formatTimeSince(token.graduated_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {/* Improved Pagination Controls */}
      {tokens.length > 0 && (
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
            // Render ellipsis
            if (page < 0) {
              return (
                <span key={`ellipsis-${page}-${idx}`} className="px-3 py-1 text-white/40">
                  ...
                </span>
              );
            }

            // Render page number
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
