"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Download,
  Star,
  Map,
  Globe,
  Lock,
  Loader2,
  FileType,
  HardDrive,
  Users,
} from "lucide-react";

// Services
import {
  fetchInternalMetrics,
  InternalMetricsData,
} from "@/services/metrics.services";

// Custom components
import MetricCard from "./_components/MetricCard";
import TimeRangeSelector, { TimeRange } from "./_components/TimeRangeSelector";
import UserGrowthChart from "./_components/UserGrowthChart";
import DailyMapsVisibilityChart from "./_components/DailyMapsVisibilityChart";
import FileTypeDistributionChart from "./_components/DailyFileTypeChart";
import DailyActivityChart from "./_components/DailyActivityChart";

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<InternalMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("day");

  useEffect(() => {
    const getMetrics = async () => {
      try {
        setLoading(true);
        const data = await fetchInternalMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
        setError("Failed to load metrics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <p className="text-destructive mb-4">{error}</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <p className="text-destructive mb-4">No metrics data available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Internal Metrics
          </h1>
          <p className="text-muted-foreground">
            A dashboard displaying platform usage and performance metrics
          </p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* 4 Key Metric Blocks */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <MetricCard
          title="Total Users"
          value={metrics.users.total}
          icon={<Users className="h-4 w-4" />}
          description={`${metrics.users.free} free, ${metrics.users.plus} plus, ${metrics.users.pro} pro`}
        />

        {/* Total Maps */}
        <MetricCard
          title="Total Maps"
          value={metrics.maps.total}
          icon={<Map className="h-4 w-4" />}
          description={`${metrics.maps.private} private, ${metrics.maps.public} public`}
        />

        {/* Total Downloads */}
        <MetricCard
          title="Total Downloads"
          value={metrics.downloads.total}
          icon={<Download className="h-4 w-4" />}
        />

        {/* Total Storage */}
        <MetricCard
          title="Total Storage"
          value={metrics.data_size.pretty_size}
          icon={<HardDrive className="h-4 w-4" />}
          description={`${metrics.data_size.private_pretty} private, ${metrics.data_size.public_pretty} public`}
        />
      </div>

      {/* Charts Grid - 2 columns on larger screens, 1 column on mobile */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Growth Chart */}
        <div className="grid gap-4">
          <UserGrowthChart data={metrics.users.growth} timeRange={timeRange} />
        </div>

        {/* Maps Visibility Over Time */}
        <div className="grid gap-4">
          <DailyMapsVisibilityChart
            dailyData={metrics.maps.daily_visibility}
            timeRange={timeRange}
          />
        </div>

        {/* Daily Activity */}
        <div className="grid gap-4">
          <DailyActivityChart
            dailyData={metrics.daily_activity}
            timeRange={timeRange}
          />
        </div>

        {/* File Type Distribution */}
        <div className="grid gap-4">
          <FileTypeDistributionChart fileTypes={metrics.file_types} />
        </div>
      </div>
    </div>
  );
}
