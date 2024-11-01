'use client';

import { useState, useEffect } from 'react';

export default function Metrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>CPU Usage: {metrics.cpu_usage.toFixed(2)}%</h1>
      <h2>CPU Type: {metrics.cpu_type}</h2>
      <p>RAM Usage: {metrics.ram_usage.toFixed(2)}%</p>
      {/* Add more metrics as needed */}
    </div>
  );
}