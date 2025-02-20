import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TimeRange } from "./TimeRangeSelector";
import { groupDataByTimePeriod } from "@/utils/chart.utils";

interface DailyActivityDataPoint {
  day: string;
  downloads: number;
  stars: number;
}

interface DailyActivityChartProps {
  dailyData: DailyActivityDataPoint[];
  timeRange: TimeRange;
}

export default function DailyActivityChart({
  dailyData,
  timeRange,
}: DailyActivityChartProps) {
  // Handle empty state
  if (!dailyData || dailyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">No activity data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process data based on time range
  const processedData = useMemo(() => {
    // Ensure dailyData is an array before spreading
    const safeData = Array.isArray(dailyData) ? dailyData : [];
    let data = [...safeData];

    // If not daily view, we need to aggregate the data
    if (timeRange !== "day") {
      return groupDataByTimePeriod(data, timeRange, "day", [
        "downloads",
        "stars",
      ]);
    }

    // Format dates for daily data
    return data.map((item) => {
      const date = new Date(item.day);
      return {
        ...item,
        formattedDay: `${date.getMonth() + 1}/${date.getDate()}`,
      };
    });
  }, [dailyData, timeRange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={processedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={timeRange === "day" ? "formattedDay" : "period"}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value, name) => {
                  if (name === "downloads") return [`${value}`, "Downloads"];
                  if (name === "stars") return [`${value}`, "Stars"];
                  return [`${value}`, name];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="downloads"
                name="Downloads"
                stroke="#0ea5e9"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="stars"
                name="Stars"
                stroke="#f97316"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
