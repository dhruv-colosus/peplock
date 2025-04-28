import { DashboardMetricCard } from "@/components/DashboardMetricCard";
import { TokenActivityChart } from "@/components/TokenActivityChart";
import { VolumeBracketIndicators } from "@/components/VolumeBracketIndicators";
import { RedFlagAlerts } from "@/components/RedFlagAlerts";
import { ProviderSelector } from "@/components/ProviderSelector";
import { NewTokensTable } from "@/components/NewTokensTable";
import { RiskyTokensDisplay } from "@/components/RiskyTokensDisplay";
import { WelcomeModal } from "@/components/WelcomeModal";
import { useQuery } from '@tanstack/react-query';
import { mockApiService } from "@/mocks/api/mockApiService";
import { useProvider } from "@/contexts/ProviderContext";
import { trpc } from "@/lib/trpc";
import React from 'react';

// Define a type for successful response data
type GraduatedTokensResponse = {
  success: true;
  data: {
    rows: Array<{
      withdraw_token_last_24h: number;
      pct_change: string;
    }>;
  };
};

// Define a type for 24h volume response data
type VolumeDataResponse = {
  success: true;
  data: {
    rows: Array<{
      revenue_usd_last_24h: number;
      pct_change: string;
    }>;
  };
};

// Define a type for risky tokens response data
type RiskyTokensResponse = {
  success: true;
  data: {
    totalRiskyTokens: number;
    riskyTokens: Array<{
      symbol: string;
      address: string;
      priceChangePct: number;
      walletConcentration: number;
      riskReason: string;
    }>;
  };
};

const Index = () => {
  const { selectedProvider } = useProvider();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData', selectedProvider],
    queryFn: () => mockApiService.fetchDashboardData(selectedProvider)
  });

  const {
    data: graduatedTokensData,
    isLoading: isLoadingGraduatedTokens
  } = trpc.dashboard.getGraduatedtokens.useQuery();

  const {
    data: volumeData,
    isLoading: isLoadingVolume
  } = trpc.dashboard.get24hVolume.useQuery();

  const {
    data: riskyTokensData,
    isLoading: isLoadingRiskyTokens
  } = trpc.analysis.getRiskyTokens.useQuery<RiskyTokensResponse>();

  // Define a type guard for success responses with proper row types
  const isSuccessWithData = <T extends { rows: unknown[] }>(response: unknown): response is { success: true, data: T } => {
    return response !== null &&
      typeof response === 'object' &&
      'success' in response &&
      (response as { success?: boolean }).success === true &&
      'data' in response &&
      (response as { data?: unknown }).data !== undefined;
  };

  const graduatedTokenCount = (() => {
    if (isLoadingGraduatedTokens ||
      !graduatedTokensData ||
      !isSuccessWithData<{ rows: { withdraw_token_last_24h: number; pct_change: string }[] }>(graduatedTokensData) ||
      !graduatedTokensData.data.rows.length) {
      return "...";
    }

    return graduatedTokensData.data.rows[0]?.withdraw_token_last_24h?.toString() || "...";
  })();

  const graduatedTokenChange = (() => {
    if (isLoadingGraduatedTokens ||
      !graduatedTokensData ||
      !isSuccessWithData<{ rows: { withdraw_token_last_24h: number; pct_change: string }[] }>(graduatedTokensData) ||
      !graduatedTokensData.data.rows.length) {
      return 0;
    }

    const pctChangeStr = graduatedTokensData.data.rows[0]?.pct_change;
    if (!pctChangeStr) return 0;

    // Parse the change value and round to 2 decimal places
    return parseFloat(parseFloat(pctChangeStr).toFixed(2));
  })();

  const riskyTokenCount = (() => {
    if (isLoadingRiskyTokens || !riskyTokensData || !riskyTokensData.success) {
      return "...";
    }
    return riskyTokensData.data.totalRiskyTokens.toString();
  })();

  const riskyTokensPercentage = (() => {
    if (isLoadingRiskyTokens ||
      isLoadingGraduatedTokens ||
      !riskyTokensData ||
      !riskyTokensData.success ||
      !graduatedTokensData ||
      !isSuccessWithData<{ rows: { withdraw_token_last_24h: number; pct_change: string }[] }>(graduatedTokensData) ||
      !graduatedTokensData.data.rows.length) {
      return 0;
    }

    const graduatedTokens = graduatedTokensData.data.rows[0]?.withdraw_token_last_24h;
    const riskyTokens = riskyTokensData.data.totalRiskyTokens;

    if (!graduatedTokens || graduatedTokens === 0) return 0;

    return parseFloat(((riskyTokens / graduatedTokens) * 100).toFixed(2));
  })();

  const volumeAmount = (() => {
    if (isLoadingVolume ||
      !volumeData ||
      !isSuccessWithData<{ rows: { revenue_usd_last_24h: number; pct_change: string }[] }>(volumeData) ||
      !volumeData.data.rows.length) {
      return "...";
    }

    const revenueUsd = volumeData.data.rows[0]?.revenue_usd_last_24h;
    if (!revenueUsd) return "...";

    // Format as currency
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(revenueUsd);
  })();

  const volumeChange = (() => {
    if (isLoadingVolume ||
      !volumeData ||
      !isSuccessWithData<{ rows: { revenue_usd_last_24h: number; pct_change: string }[] }>(volumeData) ||
      !volumeData.data.rows.length) {
      return 0;
    }

    const pctChangeStr = volumeData.data.rows[0]?.pct_change;
    if (!pctChangeStr) return 0;

    // Parse the change value and round to 2 decimal places
    return parseFloat(parseFloat(pctChangeStr).toFixed(2));
  })();

  return (
    <div className="max-w-[1600px] min-h-screen mx-auto py-4 ">
      <WelcomeModal />
      <ProviderSelector />

      {/* Main content grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left side content */}
        <div className="col-span-12 lg:col-span-9">
          {/* Top metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <DashboardMetricCard
              title="New Graduated Launches"
              value={isLoadingGraduatedTokens ? "..." : graduatedTokenCount}
              change={graduatedTokenChange}
              subtitle="Last 24 hours"
              type="launches"
              isLoading={isLoadingGraduatedTokens}
            />
            <DashboardMetricCard
              title="High Risk Tokens"
              value={riskyTokenCount}
              change={riskyTokensPercentage}
              subtitle="% of graduated tokens"
              type="risk"
              isLoading={isLoadingRiskyTokens}
            />
            <DashboardMetricCard
              title="Total Volume"
              value={isLoadingVolume ? "..." : volumeAmount}
              change={volumeChange}
              subtitle="Last 24 hours"
              type="volume"
              isLoading={isLoadingVolume}
            />
          </div>

          {/* Chart and Table */}
          <div className="space-y-4">
            <TokenActivityChart />
            <NewTokensTable />
          </div>
        </div>

        {/* Right side content */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <RiskyTokensDisplay />
          <VolumeBracketIndicators />
        </div>
      </div>
    </div>
  );
};

export default Index;
