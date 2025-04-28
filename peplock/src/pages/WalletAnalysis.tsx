import { WalletAnalysisTable } from "@/components/WalletAnalysisTable";

export default function WalletAnalysis() {
    return (
        <div className=" min-h-screen">
            <h2 className="text-3xl font-bold tracking-tight text-white my-2 ">Top wallet Deep Analysis</h2>
            <p className="text-white/60">Analyze wallet behavior patterns and trading activities to identify potential risks and opportunities.</p>

            <WalletAnalysisTable />
        </div>
    )
} 