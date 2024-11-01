// app/api/metrics/route.js

import { NextResponse } from 'next/server';
import si from 'systeminformation';

export async function GET(request) {
  try {
    const cpu = await si.cpu();
    const cpuLoad = await si.currentLoad();
    const memory = await si.mem();
    const disk = await si.fsSize();
    const network = await si.networkStats();

    const metrics = {
      cpu_usage: cpuLoad.currentLoad,
      cpu_freq: cpu.speed,
      cpu_type: `${cpu.manufacturer} ${cpu.brand}`,
      cpu_times: {
        user: cpuLoad.currentLoadUser,
        system: cpuLoad.currentLoadSystem,
        idle: 100 - cpuLoad.currentLoad,
      },
      ram_usage: (memory.active / memory.total) * 100,
      ram_total: memory.total,
      ram_available: memory.available,
      swap_usage: (memory.swapused / memory.swaptotal) * 100,
      swap_total: memory.swaptotal,
      swap_free: memory.swapfree,
      disk_usage: disk.map((d) => ({
        filesystem: d.fs,
        total: d.size,
        used: d.used,
        free: d.available,
        percent: d.use,
      })),
      network_io: network.map((n) => ({
        iface: n.iface,
        bytes_sent: n.tx_bytes,
        bytes_recv: n.rx_bytes,
        packets_sent: n.tx_packets,
        packets_recv: n.rx_packets,
      })),
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    return new NextResponse('Error fetching system metrics', { status: 500 });
  }
}