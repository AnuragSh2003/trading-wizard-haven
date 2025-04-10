
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, PauseCircle, Settings, TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlgorithmCardProps {
  name: string;
  description: string;
  status: "active" | "paused" | "error";
  performance: number;
  timeRunning: string;
  trades: number;
  className?: string;
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  name,
  description,
  status,
  performance,
  timeRunning,
  trades,
  className
}) => {
  const statusStyles = {
    active: {
      icon: <PlayCircle className="h-4 w-4 mr-1.5" />,
      color: "bg-green-100 text-green-800 border-green-200",
      label: "Active"
    },
    paused: {
      icon: <PauseCircle className="h-4 w-4 mr-1.5" />,
      color: "bg-amber-100 text-amber-800 border-amber-200",
      label: "Paused"
    },
    error: {
      icon: <AlertCircle className="h-4 w-4 mr-1.5" />,
      color: "bg-red-100 text-red-800 border-red-200",
      label: "Error"
    }
  };

  const currentStatus = statusStyles[status];
  const isPositivePerformance = performance >= 0;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md",
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "flex items-center px-2 py-0.5 font-medium text-xs",
              currentStatus.color
            )}
          >
            {currentStatus.icon}
            {currentStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-3 gap-4 mt-2">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1 flex items-center justify-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Performance
            </p>
            <p className={cn(
              "font-semibold",
              isPositivePerformance ? "text-green-600" : "text-red-600"
            )}>
              {isPositivePerformance ? "+" : ""}{performance.toFixed(2)}%
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1 flex items-center justify-center">
              <Clock className="h-3 w-3 mr-1" />
              Running Time
            </p>
            <p className="font-semibold">{timeRunning}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1 flex items-center justify-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Total Trades
            </p>
            <p className="font-semibold">{trades}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button size="sm" variant="outline" className="text-xs">
          <Settings className="h-3.5 w-3.5 mr-1.5" />
          Configure
        </Button>
        <Button 
          size="sm" 
          variant={status === "active" ? "outline" : "default"} 
          className={cn(
            "text-xs",
            status === "active" ? "border-red-200 text-red-700 hover:bg-red-50" : "bg-green-600 hover:bg-green-700"
          )}
        >
          {status === "active" ? (
            <>
              <PauseCircle className="h-3.5 w-3.5 mr-1.5" />
              Pause
            </>
          ) : (
            <>
              <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
              Start
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlgorithmCard;
