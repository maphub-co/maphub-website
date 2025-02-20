import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { TimeRange } from './TimeRangeSelector';

interface MetricsTrendChartProps {
  title: string;
  downloads: number;
  stars: number;
  timeRange: TimeRange;
}

export default function MetricsTrendChart({ 
  title,
  downloads,
  stars,
  timeRange
}: MetricsTrendChartProps) {
  // Create labels based on time range
  const getTimeLabel = () => {
    switch (timeRange) {
      case 'day':
        return 'Daily';
      case 'week':
        return 'Weekly';
      case 'month':
        return 'Monthly';
      default:
        return '';
    }
  };

  const data = [
    {
      name: getTimeLabel(),
      Downloads: downloads,
      Stars: stars,
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Downloads" fill="#0ea5e9" />
              <Bar dataKey="Stars" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 