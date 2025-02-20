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

interface DailyVisibilityDataPoint {
  day: string;
  public_maps: number;
  private_maps: number;
}

interface DailyMapsVisibilityChartProps {
  dailyData: DailyVisibilityDataPoint[];
  timeRange: TimeRange;
}

export default function DailyMapsVisibilityChart({
  dailyData,
  timeRange,
}: DailyMapsVisibilityChartProps) {
  // Handle empty state
  if (!dailyData || dailyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Maps Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">
              No map visibility data available
            </p>
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
        "public_maps",
        "private_maps",
      ]);
    }

    // Format dates for daily data and calculate total
    return data.map((item) => {
      const date = new Date(item.day);
      return {
        ...item,
        total_maps: item.public_maps + item.private_maps,
        formattedDay: `${date.getMonth() + 1}/${date.getDate()}`,
      };
    });
  }, [dailyData, timeRange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maps Visibility</CardTitle>
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
                  if (name === "public_maps")
                    return [`${value} maps`, "Public Maps"];
                  if (name === "private_maps")
                    return [`${value} maps`, "Private Maps"];
                  return [`${value} maps`, "Total Maps"];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="public_maps"
                name="Public Maps"
                stroke="#0ea5e9"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="private_maps"
                name="Private Maps"
                stroke="#f97316"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="total_maps"
                name="Total Maps"
                stroke="#6366f1"
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
