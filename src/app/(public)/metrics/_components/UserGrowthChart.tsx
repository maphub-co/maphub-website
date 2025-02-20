import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TimeRange } from "./TimeRangeSelector";

interface GrowthDataPoint {
  date: string;
  total_users: number;
  new_users: number;
}

interface UserGrowthChartProps {
  data: {
    daily: GrowthDataPoint[];
    weekly: GrowthDataPoint[];
    monthly: GrowthDataPoint[];
  };
  timeRange: TimeRange;
}

export default function UserGrowthChart({
  data,
  timeRange,
}: UserGrowthChartProps) {
  // Get the appropriate data set based on the selected time range
  const getDataForTimeRange = () => {
    switch (timeRange) {
      case "day":
        return Array.isArray(data?.daily) ? data.daily : [];
      case "week":
        return Array.isArray(data?.weekly) ? data.weekly : [];
      case "month":
        return Array.isArray(data?.monthly) ? data.monthly : [];
      default:
        return Array.isArray(data?.daily) ? data.daily : [];
    }
  };

  const currentData = getDataForTimeRange();

  // Handle empty state
  if (!currentData || currentData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">
              No user growth data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ensure currentData is an array before spreading
  const safeCurrentData = Array.isArray(currentData) ? currentData : [];

  // Sort data chronologically
  const sortedData = [...safeCurrentData].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // Format dates for display based on time range
  const formattedData = sortedData.map((item) => {
    const date = new Date(item.date);
    let formattedDate;

    if (timeRange === "day") {
      formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    } else if (timeRange === "week") {
      formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    } else {
      // Monthly - use YYYY-MM format
      formattedDate = item.date.substring(0, 7);
    }

    return {
      ...item,
      formattedDate,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          User Growth Over Time (
          {timeRange === "day"
            ? "Daily"
            : timeRange === "week"
            ? "Weekly"
            : "Monthly"}
          )
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value, name) => {
                  if (name === "total_users")
                    return [`${value} total users`, "Total Users"];
                  if (name === "new_users")
                    return [`${value} new users`, "New Users"];
                  return [`${value}`, name];
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="total_users"
                name="Total Users"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="new_users"
                name="New Users"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
