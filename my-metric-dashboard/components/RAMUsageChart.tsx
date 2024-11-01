"use client";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A simple RAM usage area chart";

const chartConfig = {
  ram: {
    label: "RAM Usage",
    color: "hsl(var(--chart-2))", 
  },
};

const initialData = Array.from({ length: 10 }, (_, i) => ({
  time: `00:0${i}`,
  ram: Math.random() * 10 + 20, 
}));

export function RAMUsageChart() {
  const [ramData, setRamData] = useState(initialData);

  useEffect(() => {
    const fetchRamUsage = async () => {
      try {
        const response = await fetch("http://localhost:5000/metrics");
        const data = await response.json();

        setRamData((prevData) => [
          ...prevData.slice(-49), 
          { 
            time: new Date().toLocaleTimeString(),
             ram: data.ram_usage

           },
        ]);
      } catch (error) {
        console.error("Error fetching RAM usage:", error);
      }
    };

    fetchRamUsage();
    const interval = setInterval(fetchRamUsage, 5000);
    return () => clearInterval(interval); 
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>RAM Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={ramData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="ram"
              type="natural"
              fill="var(--color-ram)"
              fillOpacity={0.4}
              stroke="var(--color-ram)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
