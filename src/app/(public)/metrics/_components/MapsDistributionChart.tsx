import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface MapsDistributionChartProps {
  publicMaps: number;
  privateMaps: number;
}

export default function MapsDistributionChart({ 
  publicMaps, 
  privateMaps 
}: MapsDistributionChartProps) {
  const data = [
    { name: 'Public Maps', value: publicMaps, color: '#0ea5e9' },
    { name: 'Private Maps', value: privateMaps, color: '#f97316' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maps Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} maps`, '']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 