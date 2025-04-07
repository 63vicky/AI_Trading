'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  {
    name: 'Jan',
    total: 45000,
  },
  {
    name: 'Feb',
    total: 48000,
  },
  {
    name: 'Mar',
    total: 47000,
  },
  {
    name: 'Apr',
    total: 52000,
  },
  {
    name: 'May',
    total: 49000,
  },
  {
    name: 'Jun',
    total: 55000,
  },
  {
    name: 'Jul',
    total: 58000,
  },
  {
    name: 'Aug',
    total: 61000,
  },
  {
    name: 'Sep',
    total: 65000,
  },
  {
    name: 'Oct',
    total: 63000,
  },
  {
    name: 'Nov',
    total: 68000,
  },
  {
    name: 'Dec',
    total: 72000,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
