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

const Charts = ({ data }) => {
  const BarData = [
    { name: "Completed", value: data.barChart.completed },
    { name: "Pending", value: data.barChart.pending },
    { name: "Overdue", value: data.barChart.overDue },
  ];

  const lineData = Object.entries(data.lineChart).map(([day, completed]) => ({
    day,
    completed,
  }));
  console.log(lineData);

  return (
    <div className="p-5 grid lg:grid-cols-2 grid-cols-1 gap-6">
      <div className="w-full h-80 rounded-2xl p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Task Status Graph</h3>
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
              allowDecimals={false}
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
