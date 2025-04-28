import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TokenPrice {
    symbol: string;
    price: number;
    change: number;

}


export const TokenPriceTickerBar = () => {
    const [prices, setPrices] = useState<TokenPrice[]>([
        { symbol: "SOL", price: 125.45, change: 2.5, },
        { symbol: "BONK", price: 0.00001234, change: -1.2 },
        { symbol: "JTO", price: 3.45, change: 5.7 },
        { symbol: "PYTH", price: 0.45, change: -0.8 },
    ]);


    useEffect(() => {
        async function fetchPrices() {
            const res = await fetch(
                "https://api.coingecko.com/api/v3/coins/markets" +
                "?vs_currency=usd&order=market_cap_desc&per_page=10&page=1" +
                "&price_change_percentage=24h"
            );
            const data = await res.json();
            setPrices(data.map((c: { symbol: string; current_price: number; price_change_percentage_24h: number }) => ({
                symbol: c.symbol.toUpperCase(),
                price: c.current_price,
                change: c.price_change_percentage_24h,
            })));
        }

        fetchPrices();
        const iv = setInterval(fetchPrices, 60_000);
        return () => clearInterval(iv);
    }, []);

    // figure out how many times we need to repeat your set
    const [repeat, setRepeat] = useState(2);
    const measurer = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        function calc() {
            if (!measurer.current) return;
            const singleWidth = measurer.current.getBoundingClientRect().width;
            const viewport = window.innerWidth;
            // we want at least 2× viewport of content to scroll through
            const count = Math.ceil((viewport * 2) / singleWidth);
            setRepeat(count);
        }
        calc();
        window.addEventListener("resize", calc);
        return () => window.removeEventListener("resize", calc);
    }, [prices]);

    // build our repeated array
    const repeated = Array.from({ length: repeat }).flatMap(() => prices);

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] glass-card border-b border-white/5 overflow-hidden">
            {/* invisible one‑off for measuring */}
            <div
                ref={measurer}
                className="absolute top-0 left-[-9999px] flex whitespace-nowrap"
            >
                {prices.map((t, i) => (
                    <div key={i} className="flex-shrink-0 px-4 py-1 min-w-[150px]"></div>
                ))}
            </div>

            {/* the actual scrolling strip */}
            <div className="flex whitespace-nowrap animate-scroll-x">
                {repeated.map((token, idx) => (
                    <div
                        key={`${token.symbol}-${idx}`}
                        className="
              flex-shrink-0
              flex items-center space-x-1 px-4 py-1
              min-w-[150px] border-r last:border-r-0 border-white/5
            "
                    >
                        <span className="font-mono text-xs text-white/60">
                            {token.symbol}
                        </span>
                        <span className="font-medium text-sm text-white">
                            ${token.price.toFixed(token.price < 0.01 ? 8 : 2)}
                        </span>
                        <div className={`${token.change >= 0 ? "text-green-400" : "text-red-400"} flex items-center`}>
                            {token.change >= 0
                                ? <ArrowUpRight size={12} />
                                : <ArrowDownRight size={12} />
                            }
                            <span className="text-xs">
                                {Math.abs(token.change).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
