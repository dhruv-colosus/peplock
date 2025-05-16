import { LayoutDashboard, Boxes, Wallet, Bell, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "./ui/separator";
import { useSearch } from "@/contexts/SearchContext";
import { KeyboardEvent, useState } from "react";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Boxes, label: "Token Analytics", path: "/token" },
    { icon: Wallet, label: "Wallet Analysis", path: "/wallet-analysis" },
    { icon: Bell, label: "Alerts", path: "/alerts" },
    { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
    const location = useLocation();
    const { handleTokenSearch } = useSearch();
    const [searchQuery, setSearchQuery] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleTokenSearch(searchQuery);
            setSearchQuery('');
        }
    };

    return (
        <div className="fixed top-6 left-0 w-64 h-[calc(100vh-1.5rem)] bg-black/20 backdrop-blur-lg border-r border-white/5 z-50">
            <div className="flex flex-col h-full">
                <div className="p-4 h-16 flex items-center border-b border-white/5">
                    <Link to="/">
                        <h1 className="font-['Press_Start_2P'] font-bold tracking-tight flex items-center gap-2 text-white">
                            <img src="assets/icon.png" alt="PepLock" className="w-6 h-6" />
                            PEPLOCK
                        </h1>
                    </Link>
                </div>

                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input
                            placeholder="Search..."
                            className="w-full pl-10 h-8 bg-white/5 border-white/10 text-sm font-mono tracking-tight"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>

                <nav className="flex-1 px-2 space-y-1">
                    {navItems.map((item) => {
                        const cleanedPath = item.path.replace(/:\w+/, '');
                        const isActive = cleanedPath === '/'
                            ? location.pathname === '/'
                            : location.pathname.startsWith(cleanedPath);
                        return (
                            <Button
                                key={item.label}
                                variant={isActive ? "secondary" : "ghost"}
                                className={`w-full justify-start rounded-lg text-sm font-archivo font-semibold tracking-tight ${isActive
                                    ? 'bg-gradient-to-r from-primary/70 to-primary/40 text-white'
                                    : 'text-white/30 hover:text-white'
                                    }`}
                                asChild
                            >
                                <Link to={item.path}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Link>
                            </Button>
                        );
                    })}
                </nav>
                <div className="mt-auto">
                    <div className="p-4">
                        <div
                            className="
    relative
    w-full p-4 rounded-lg
    bg-[url('/assets/purple.jpg')] bg-cover bg-center
    border border-white/10 backdrop-blur-sm
  "
                        >
                            <div className="absolute inset-0 bg-black/20 rounded-lg"></div>

                            <div className="relative flex flex-col gap-3">
                                <h3 className="text-sm font-['Press_Start_2P'] text-white">
                                    Go fund meme now
                                </h3>
                                <Button
                                    onClick={() => window.open("https://www.gofundmeme.io/", "_blank")}
                                    size="sm"
                                    className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs"
                                >
                                    Buy Now
                                </Button>
                            </div>
                        </div>

                    </div>

                    <Separator className="my-4 bg-white/10" />

                    <div className="flex px-4 pb-4 items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-sm font-mono">A</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-archivo text-white">Account</p>
                            <p className="text-xs text-white/60">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 