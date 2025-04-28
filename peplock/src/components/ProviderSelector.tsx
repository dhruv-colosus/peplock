import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProvider } from "@/contexts/ProviderContext";
import { Check, Cross, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { Provider } from "@/mocks/api/mockApiService";

const providerLogos = {
  "pumpfun": "/assets/pumpfun.png",
  "gofundme": "/assets/gofundmeme.png"
};

const providerDisplayNames = {
  "pumpfun": "pump.fun",
  "gofundme": "gofundmeme"
};

export const ProviderSelector = () => {
  const { selectedProvider, setSelectedProvider } = useProvider();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    let timeout;
    if (showToast) {
      timeout = setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [showToast]);

  const handleProviderClick = (provider: Provider) => {
    if (provider === "gofundme") {
      setShowToast(true);
      // Don't set this provider as selected
      return;
    }

    setSelectedProvider(provider);
  };

  return (
    <Card className="border-[1px] border-white/5 bg-[#14121F] p-3 mb-4">
      <div className="flex items-center gap-4">
        <p className="text-xs font-mono text-white/60">SELECT PROVIDER:</p>
        <div className="relative flex gap-6">
          {(Object.keys(providerLogos) as Provider[]).map((provider) => (
            <Button
              key={provider}
              variant="ghost"
              onClick={() => handleProviderClick(provider)}
              className={`relative h-7 px-3 text-xs font-mono transition-all flex items-center gap-2 
                ${provider === "gofundme" ? "cursor-not-allowed opacity-50" : ""}
                ${selectedProvider === provider
                  ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:animate-[slide_0.2s_ease-out]'
                  : 'text-white/30'
                }`}
            >
              <img
                src={providerLogos[provider]}
                alt={`${providerDisplayNames[provider]} logo`}
                className="w-4 h-4 rounded-sm"
              />
              {providerDisplayNames[provider]}
            </Button>
          ))}

          {showToast && (
            <div className=" px-2 py-1 rounded bg-black/40 backdrop-blur-sm text-white text-xs font-mono flex items-center gap-1 border border-white/10 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <X className="h-3 w-3 text-red-400" />
              <span>Currently Unavailable</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};