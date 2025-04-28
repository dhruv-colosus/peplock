import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

type RiskyToken = {
    symbol: string;
    address: string;
    priceChangePct: number;
    riskReason: string;
};

type RiskyTokensResponse =
    | {
        success: true;
        data: {
            totalRiskyTokens: number;
            riskyTokens: RiskyToken[];
        };
    }
    | { success: false; error: string };

const ITEMS_PER_PAGE = 5;

export const RiskyTokensDisplay: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, error } = trpc.analysis.getRiskyTokens.useQuery<RiskyTokensResponse>();

    const handleTokenClick = (address: string) => {
        navigate(`/token/${address}`);
    };

    if (isLoading) {
        return (
            <Card className="border-white/5">
                <CardHeader className="border-b border-white/5">
                    <CardTitle className="text-lg font-archivo flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Risky Tokens
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex flex-col">
                        <div className="divide-y divide-white/5">
                            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                                <div
                                    key={i}
                                    className="p-4 flex items-center justify-between hover:bg-white/5"
                                >
                                    <div className="animate-pulse">
                                        <div className="h-4 w-16 bg-white/20 rounded mb-2" />
                                        <div className="h-3 w-24 bg-white/10 rounded" />
                                    </div>
                                    <div className="animate-pulse">
                                        <div className="h-3 w-10 bg-white/10 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !data || data.success === false) {
        return (
            <Card className="border-white/5">
                <CardHeader className="border-b border-white/5">
                    <CardTitle className="text-lg font-archivo flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Risky Tokens
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <p className="text-red-500">Failed to load risky tokens</p>
                </CardContent>
            </Card>
        );
    }

    const { riskyTokens } = data.data;
    const totalPages = Math.ceil(riskyTokens.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentRiskyTokens = riskyTokens.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <Card className="border-white/5">
            <CardHeader className="border-b border-white/5">
                <CardTitle className="text-lg font-archivo flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Risky Tokens
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="min-h-[300px] flex flex-col">
                    <div className="divide-y divide-white/5 flex-grow">
                        {currentRiskyTokens.length === 0 ? (
                            <div className="p-4 text-white/60 text-center">
                                No risky tokens detected
                            </div>
                        ) : (
                            currentRiskyTokens.map(token => (
                                <div
                                    key={token.address}
                                    className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer"
                                    onClick={() => handleTokenClick(token.address)}
                                >
                                    <div>
                                        <h3 className="font-mono text-sm text-white">{token.symbol}</h3>
                                        <p className="text-xs text-white/60">{token.riskReason}</p>
                                    </div>
                                    <span
                                        className={`text-xs ${token.priceChangePct > 0 ? 'text-green-500' : 'text-red-500'
                                            }`}
                                    >
                                        {token.priceChangePct > 0 ? '+' : ''}
                                        {token.priceChangePct.toFixed(2)}%
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="p-4 border-t border-white/5 flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="h-8 px-2"
                            >
                                Prev
                            </Button>

                            <Button
                                variant="default"
                                size="sm"
                                disabled
                                className="h-8 w-8 p-0"
                            >
                                {currentPage}
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="h-8 px-2"
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
