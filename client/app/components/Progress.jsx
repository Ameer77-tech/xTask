"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const ProgressCard = ({ title, completed, total }) => {
  const remaining = total - completed;
  const data = [
    { name: "Completed", value: completed, fill: "#10b981" },
    { name: "Remaining", value: remaining, fill: "#3f3f46" }, 
  ];
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className={"bg-secondary rounded-2xl border-0"}>
      <CardHeader className="p-0 flex justify-start mb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground px-5">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <div className="lg:text-4xl text-4xl font-bold">
            {completed}
            <span className="text-lg text-muted-foreground">/{total} <span className="text-sm font-light ml-1">tasks completed</span></span>
          </div>
          <p className="text-xs text-emerald-500 mt-1">
            {percentage}% completed
          </p>
        </div>
        <div className="w-20 h-20">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%" 
                cy="50%"
                innerRadius={25} 
                outerRadius={35}
                paddingAngle={5}
              >

                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
