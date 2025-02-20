import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface FileTypeItem {
  type: string;
  count: number;
}

interface FileTypeDistributionChartProps {
  fileTypes: FileTypeItem[];
}

// Color mapping for different file types
const getFileTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    TIF: "#ef4444",
    TIFF: "#ef4444",
    GEOJSON: "#0ea5e9",
    FGB: "#10b981",
    SHAPEFILE: "#f97316",
    KML: "#10b981",
    CSV: "#8b5cf6",
    GPX: "#f59e0b",
    JPG: "#06b6d4",
    PNG: "#84cc16",
    PDF: "#f43f5e",
    ZIP: "#6366f1",
    UNKNOWN: "#6b7280",
  };

  return colors[type.toUpperCase()] || "#6b7280";
};

export default function FileTypeDistributionChart({
  fileTypes,
}: FileTypeDistributionChartProps) {
  // Handle empty state
  if (!fileTypes || fileTypes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>File Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">No file type data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort data by count (descending) and limit to top 10
  const chartData = [...fileTypes]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Show top 10 file types
    .map((item) => ({
      ...item,
      // Format the type for display - already uppercase from API
      displayType: item.type === "UNKNOWN" ? "Unknown" : item.type,
      color: getFileTypeColor(item.type),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Type Distribution (All Time)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="displayType"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} maps`, ""]}
                labelFormatter={(label) => `File type: ${label}`}
              />
              <Legend />
              <Bar dataKey="count" name="Number of maps">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
