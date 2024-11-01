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
  network: {
    label: "Network Usage",
    color: "hsl(var(--chart-3))",
  },
};

const initialData = Array.from({ length: 10 }, (_, i) => ({
  time: `00:0${i}`,
  bytes_sent: Math.random() * 1000 * 1024, // Dummy values in bytes
  bytes_recv: Math.random() * 1000 * 1024, // Dummy values in bytes
}));

// Function to format bytes into human-readable units
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function NetworkUsageChart() {
  const [networkData, setNetworkData] = useState(initialData);

  useEffect(() => {
    const fetchNetworkUsage = async () => {
      try {
        const response = await fetch("http://localhost:5000/metrics");
        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data

        if (data.network_io) {
          setNetworkData((prevData) => [
            ...prevData.slice(-49),
            {
              time: new Date().toLocaleTimeString(),
              bytes_sent: data.network_io.bytes_sent,
              bytes_recv: data.network_io.bytes_recv,
              packets_sent: data.network_io.packets_sent,
              packets_recv: data.network_io.packets_recv,
            },
          ]);
          console.log("Updated network data:", networkData); // Log the updated network data
        } else {
          console.error("Error: network_io data is missing in the response");
        }
      } catch (error) {
        console.error("Error fetching network usage:", error);
      }
    };

    fetchNetworkUsage();
    const interval = setInterval(fetchNetworkUsage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={networkData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickFormatter={formatBytes} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="bytes_sent"
              type="monotone"
              fill="var(--color-network)"
              fillOpacity={0.4}
              stroke="var(--color-network)"
            />
            <Area
              dataKey="bytes_recv"
              type="monotone"
              fill="var(--color-network-recv)"
              fillOpacity={0.4}
              stroke="var(--color-network-recv)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}