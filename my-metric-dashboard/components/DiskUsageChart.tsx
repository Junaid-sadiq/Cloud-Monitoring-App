"use client";

import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  disk: {
    label: "Disk Usage",
    color: "hsl(var(--chart-4))",
  },
};

const initialData = Array.from({ length: 10 }, (_, i) => ({
  time: `00:0${i}`,
  used: Math.random() * 100 * 1024 * 1024, // Dummy values in bytes
  free: Math.random() * 100 * 1024 * 1024, // Dummy values in bytes
}));

// Function to format bytes into human-readable units
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function DiskUsageChart() {
  const [diskData, setDiskData] = useState(initialData);

  useEffect(() => {
    const fetchDiskUsage = async () => {
      try {
        const response = await fetch("http://localhost:5000/metrics");
        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data

        if (data.disk_usage) {
          setDiskData((prevData) => [
            ...prevData.slice(-49),
            {
              time: new Date().toLocaleTimeString(),
              used: data.disk_usage.used,
              free: data.disk_usage.free,
            },
          ]);
          console.log("Updated disk data:", diskData); // Log the updated disk data
        } else {
          console.error("Error: disk_usage data is missing in the response");
        }
      } catch (error) {
        console.error("Error fetching disk usage:", error);
      }
    };

    fetchDiskUsage();
    const interval = setInterval(fetchDiskUsage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disk Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={diskData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickFormatter={formatBytes} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="used"
              type="monotone"
              fill="var(--color-disk-used)"
              fillOpacity={0.4}
              stroke="var(--color-disk-used)"
            />
            <Area
              dataKey="free"
              type="monotone"
              fill="var(--color-disk-free)"
              fillOpacity={0.4}
              stroke="var(--color-disk-free)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}