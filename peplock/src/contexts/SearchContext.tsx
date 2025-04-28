import { createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchContextType {
    handleTokenSearch: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();

    const handleTokenSearch = (query: string) => {
        if (query.trim()) {
            navigate(`/token/${query.trim()}`);
        }
    };

    return (
        <SearchContext.Provider value={{ handleTokenSearch }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
} 