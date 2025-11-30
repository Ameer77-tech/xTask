import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import clsx from "clsx";
import { ArrowUp, ArrowDown } from "lucide-react";
const DashboardCard = ({ title, count, description, trend }) => {
  return (
    <Card className={"bg-secondary rounded-2xl border-0"}>
      <CardHeader className={"p-0 flex justify-center mb-2"}>
        <CardTitle className={"text-sm font-medium text-muted-foreground"}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={"p-0"}>
        <p className={clsx("font-bold text-center text-7xl lg:text-5xl px-5", title.toLowerCase() === "due today" ? "text-destructive" : title.toLowerCase() === "over due" ? "text-muted-foreground" : "text-accent")}>{count}</p>
        <CardDescription className={"pt-3"}>
          {trend == "up" ? (
            <p className="flex items-center text-emerald-500 lg:justify-end md:justify-end justify-center text-xs lg:text-sm lg:px-5">
              <ArrowUp size={15} className="text-emerald-500" />{" "}
              <span>10% since last week</span>
            </p>
          ) : (
            <p className="flex items-center text-red-500  lg:justify-end md:justify-end justify-center text-xs lg:text-sm lg:px-5">
              <ArrowDown size={15} className="text-red-500" />{" "}
              <span>10% since last week</span>
            </p>
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
