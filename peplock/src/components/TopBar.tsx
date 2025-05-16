import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { useSearch } from "@/contexts/SearchContext";
import { KeyboardEvent, useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
    { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>, label: "Dashboard", path: "/" },
    { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"></path><path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"></path><path d="M4 12h16"></path><path d="M8 12v4"></path><path d="M12 12v4"></path><path d="M16 12v4"></path></svg>, label: "Token Analytics", path: "/token" },
    { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12H9"></path></svg>, label: "Wallet Analysis", path: "/wallet-analysis" },
    { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>, label: "Alerts", path: "/alerts" },
    { icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>, label: "Settings", path: "/settings" },
];

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

interface TopbarProps {
    toggleMobileMenu: () => void;
    isMobileMenuOpen: boolean;
}

export default function Topbar({ toggleMobileMenu, isMobileMenuOpen }: TopbarProps) {
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
        <>
            <div className="fixed top-6 right-0 h-16 px-6 flex items-center justify-between bg-black/20 backdrop-blur-xl border-b border-white/10 z-50 md:left-[16rem] left-0">
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
                    <button
                        className="md:hidden text-white p-2"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                    <div className="hidden md:block">
                        <ProfileDropdown />
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`
                    fixed top-[5.5rem] left-0 right-0 bg-black/90 border-b border-white/10 z-40 md:hidden
                    transition-all duration-200 ease-in-out overflow-hidden
                    ${isMobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'}
                `}
            >
                <div className="p-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input
                            placeholder="Search any token..."
                            className="w-full pl-10 h-8 bg-white/5 border-white/10 text-sm font-mono tracking-tight"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <nav className="space-y-2">
                        {navItems.map((item, index) => {
                            const isActive = item.path === location.pathname;
                            return (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className={`
                                        flex items-center gap-2 p-2 rounded-md
                                        ${isActive
                                            ? 'bg-gradient-to-r from-primary/70 to-primary/40 text-white'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                    onClick={toggleMobileMenu}
                                >
                                    <item.icon />
                                    <span className="text-sm font-semibold">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-sm font-mono">A</span>
                        </div>
                        <div>
                            <p className="text-sm text-white">Account</p>
                            <p className="text-xs text-white/60">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
