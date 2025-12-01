"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const Charts = () => {
  const BarData = [
    { name: "Completed", value: 90 },
    { name: "Pending", value: 30 },
    { name: "Overdue", value: 200 },
  ];

  const lineData = [
    { day: "Mon", completed: 5 },
    { day: "Tue", completed: 8 },
    { day: "Wed", completed: 6 },
    { day: "Thu", completed: 10 },
    { day: "Fri", completed: 7 },
    { day: "Sat", completed: 9 },
    { day: "Sun", completed: 4 },
  ];

  return (
    <div className="p-5 grid lg:grid-cols-2 grid-cols-1 gap-6">
      <div className="w-full h-80 rounded-2xl p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Task Status</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={BarData}>
            <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
            <YAxis tick={{ fill: "#94a3b8" }} />
            <Tooltip
              itemStyle={{
                color: "black",
              }}
              labelStyle={{
                color: "var(--accent)",
              }}
              formatter={(value) => `${value} tasks`}
            />
            <Legend verticalAlign="bottom" height={36} />
            <Bar
              dataKey="value"
              fill="var(--accent)"
              radius={[8, 8, 0, 0]}
              style={{ transition: "all 0.3s ease-in-out" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full h-80 rounded-2xl p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">
          Tasks Completed Over the Week
        </h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={lineData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis
              label={{ value: "Tasks", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              itemStyle={{
                color: "black",
              }}
              labelStyle={{
                color: "var(--accent)",
              }}
              contentStyle={{
                backgroundColor: "var(--foreground)",
                borderRadius: "8px",
                border: "none",
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#2f639e"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
