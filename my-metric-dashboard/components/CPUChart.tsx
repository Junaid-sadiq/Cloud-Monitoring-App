"use client";

import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Configuration for the chart's appearance
const chartConfig = {
  cpu: {
    label: "CPU Usage",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Dummy initial data to populate the chart
const initialData = Array.from({ length: 10 }, (_, i) => ({
  time: `00:0${i}`,
  cpu: Math.random() * 10 + 20, // Dummy values between 20-30% for example
}));

export function CPUChart() {
  const [cpuData, setCpuData] = useState(initialData);
  const [cpuType, setCpuType] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const fetchCpuUsage = async () => {
      try {
        const response = await fetch("/api/metrics");
        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data

        setCurrentTime(new Date().toLocaleTimeString());

        setCpuData((prevData) => [
          ...prevData.slice(-49), // Limit to last 50 entries for smooth updates
          { time: new Date().toLocaleTimeString(), cpu: data.cpu_usage },
        ]);

        setCpuType(data.cpu_type || "Unknown CPU Type");
        console.log("CPU type:", data.cpu_type); 
      } catch (error) {
        console.error("Error fetching CPU usage:", error);
      }
    };

    fetchCpuUsage();
    const interval = setInterval(fetchCpuUsage, 5000); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>CPU Usage</CardTitle>
        <CardDescription>{cpuType}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={cpuData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="cpu"
              type="monotone"
              fill="var(--color-cpu)"
              fillOpacity={0.4}
              stroke="var(--color-cpu)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}