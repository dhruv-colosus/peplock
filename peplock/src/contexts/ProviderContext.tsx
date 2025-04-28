import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Provider } from '@/mocks/api/mockApiService';

interface ProviderContextType {
    selectedProvider: Provider;
    setSelectedProvider: (provider: Provider) => void;
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export function ProviderContextProvider({ children }: { children: ReactNode }) {
    const [selectedProvider, setSelectedProvider] = useState<Provider>('pumpfun');

    return (
        <ProviderContext.Provider value={{ selectedProvider, setSelectedProvider }}>
            {children}
        </ProviderContext.Provider>
    );
}

export function useProvider() {
    const context = useContext(ProviderContext);
    if (context === undefined) {
        throw new Error('useProvider must be used within a ProviderContextProvider');
    }
    return context;
} 