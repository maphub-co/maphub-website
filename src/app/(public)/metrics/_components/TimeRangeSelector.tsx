import React from "react";
import { 
  Select,
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/Select";

export type TimeRange = "day" | "week" | "month";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
}

export default function TimeRangeSelector({
  value,
  onChange,
  className,
}: TimeRangeSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as TimeRange)}
    >
      <SelectTrigger className={`w-[180px] ${className}`}>
        <SelectValue placeholder="Select time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Time Range</SelectLabel>
          <SelectItem value="day">Daily</SelectItem>
          <SelectItem value="week">Weekly</SelectItem>
          <SelectItem value="month">Monthly</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
} 