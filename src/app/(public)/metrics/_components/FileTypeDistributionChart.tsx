import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface FileTypeDistributionChartProps {
  fileTypes: Array<{ type: string; count: number }>;
}

// Function to generate a predictable color for each file type
const getFileTypeColor = (fileType: string): string => {
  // Base color palette - vibrant colors for common file types
  const colorMap: Record<string, string> = {
    // Raster formats
    'raster': '#4338ca', // indigo
    'tif': '#0891b2',    // cyan
    'tiff': '#0e7490',   // dark cyan
    'jpg': '#0284c7',    // sky blue
    'jpeg': '#0ea5e9',   // light blue
    'png': '#0369a1',    // blue
    // Vector formats
    'vector': '#0ea5e9',  // sky blue
    'geojson': '#059669', // emerald
    'json': '#0d9488',    // teal
    'fgb': '#65a30d',     // lime
    'kml': '#d97706',     // amber
    'kmz': '#ea580c',     // dark orange
    'gpkg': '#dc2626',    // red
    'shp': '#b91c1c',     // dark red
    // Tabular formats
    'csv': '#a21caf',     // purple
    'xlsx': '#c026d3',    // fuchsia
    'xls': '#a21caf',     // purple
    // Archive formats
    'zip': '#7c3aed',     // violet
    'gz': '#6d28d9',      // purple
    'tar': '#8b5cf6',     // purple
  };
  
  // If we have a predefined color, use it
  if (colorMap[fileType.toLowerCase()]) {
    return colorMap[fileType.toLowerCase()];
  }
  
  // Otherwise, generate a color based on the string
  let hash = 0;
  for (let i = 0; i < fileType.length; i++) {
    hash = fileType.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate vibrant colors with good saturation and lightness
  const h = hash % 360;
  return `hsl(${h}, 70%, 50%)`;
};

export default function FileTypeDistributionChart({ 
  fileTypes 
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

  // Sort data by count (descending) and limit to top 15
  const chartData = [...(Array.isArray(fileTypes) ? fileTypes : [])]
    .sort((a, b) => b.count - a.count)
    .slice(0, 15) // Show top 15 file types
    .map(item => ({
      ...item,
      // Format the type for display - uppercase the extension
      type: item.type === 'unknown' ? 'Unknown' : item.type.toUpperCase(),
      color: getFileTypeColor(item.type)
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 60,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="type" 
                tick={{ fontSize: 12 }}
                width={80}
              />
              <Tooltip 
                formatter={(value) => [`${value} maps`, '']}
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