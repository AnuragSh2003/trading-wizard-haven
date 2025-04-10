
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "glass";
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  variant = "default",
  className,
}) => {
  const trendStyles = {
    up: "text-algo-green-DEFAULT",
    down: "text-algo-red-DEFAULT",
    neutral: "text-gray-500",
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-md",
        variant === "glass" ? "glass-card" : "",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-semibold mt-1">{value}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            {trend && trendValue && (
              <div className={cn("text-sm font-medium mt-2 flex items-center", trendStyles[trend])}>
                {trend === "up" ? "+" : trend === "down" ? "-" : ""}
                {trendValue}
              </div>
            )}
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
