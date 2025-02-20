import { TimeRange } from "@/app/(public)/metrics/_components/TimeRangeSelector";

/**
 * Groups data by the specified time period (week or month)
 *
 * @param data Array of data points with a date field
 * @param timeRange The time range to group by ('day', 'week', or 'month')
 * @param dateField The name of the date field in the data objects
 * @param valueFields Array of field names to sum during grouping
 * @returns Array of grouped data objects
 */
export function groupDataByTimePeriod<T extends Record<string, any>>(
  data: T[],
  timeRange: TimeRange,
  dateField: string,
  valueFields: string[]
): Array<Record<string, any>> {
  if (timeRange === "day") {
    return data; // No grouping needed for daily data
  }

  const groupedData: Record<string, Record<string, any>> = {};

  data.forEach((item) => {
    const date = new Date(item[dateField]);
    let period: string;

    if (timeRange === "week") {
      // Get the week number and year
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Go to Sunday
      period = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    } else {
      // Month grouping
      period = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    }

    if (!groupedData[period]) {
      groupedData[period] = { period };

      // Initialize all value fields with 0
      valueFields.forEach((field) => {
        groupedData[period][field] = 0;
      });
    }

    // Sum values for each field
    valueFields.forEach((field) => {
      groupedData[period][field] += Number(item[field]) || 0;
    });
  });

  // Convert to array and sort by period
  return Object.values(groupedData).sort((a, b) => {
    if (timeRange === "month") {
      // Sort by YYYY-MM format
      return a.period.localeCompare(b.period);
    } else {
      // For week, convert to dates and sort
      const [aMonth, aDay] = a.period.split("/").map(Number);
      const [bMonth, bDay] = b.period.split("/").map(Number);

      // Create date objects for comparison (using current year)
      const currentYear = new Date().getFullYear();
      const dateA = new Date(currentYear, aMonth - 1, aDay);
      const dateB = new Date(currentYear, bMonth - 1, bDay);

      return dateA.getTime() - dateB.getTime();
    }
  });
}
