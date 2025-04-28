import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { useSearch } from "@/contexts/SearchContext";
import { KeyboardEvent, useState } from "react";

const getPageTitle = (pathname: string) => {
    if (pathname.startsWith("/token/")) {
        const id = pathname.split("/token/")[1] || "";
        return {
            title: "Token Investigation",
            description: id
        };
    }

    switch (pathname) {
        case "/":
            return {
                title: "Overview",
                description: "Real-time token metrics and alerts of graduated tokens"
            };
        case "/token":
            return {
                title: "Token Analytics",
                description: "Detailed token analysis and metrics"
            };
        case "/wallet-analysis":
            return {
                title: "Wallet Analysis",
                description: "Track and analyze wallet activities"
            };
        case "/alerts":
            return {
                title: "Alerts",
                description: "Manage your token and wallet alerts"
            };
        case "/settings":
            return {
                title: "Settings",
                description: "Configure your preferences"
            };
        default:
            return {
                title: "Overview",
                description: "Real-time token metrics and alerts"
            };
    }
};

export default function Topbar() {
    const location = useLocation();
    const { title, description } = getPageTitle(location.pathname);
    const { handleTokenSearch } = useSearch();
    const [searchQuery, setSearchQuery] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleTokenSearch(searchQuery);
            setSearchQuery('');
        }
    };

    return (
        <div className="fixed top-6 right-0 h-16 px-6 flex items-center justify-between bg-black/20 backdrop-blur-lg border-b border-white/10 z-50 md:left-[16rem] left-0">
            <div>
                <h1 className="text-xl font-archivo font-bold text-white">{title}</h1>
                <p className="text-xs font-mono text-white/60">{description}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                        placeholder="Search any token..."
                        className="w-64 pl-10 py-4 h-8 bg-white/5 border-white/10 text-sm font-mono tracking-tight"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <ProfileDropdown />
            </div>
        </div>
    );
}
