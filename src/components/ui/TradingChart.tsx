
import React, { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TradingChartProps {
  title?: string;
  symbol?: string;
  className?: string;
  variant?: "default" | "filled" | "glass";
  height?: number;
}

const TradingChart: React.FC<TradingChartProps> = ({
  title = "Price Chart",
  symbol = "NIFTY50",
  className,
  variant = "default",
  height = 300,
}) => {
  const [timeframe, setTimeframe] = useState("1D");
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate sample data
  useEffect(() => {
    setIsLoading(true);
    
    const generateData = () => {
      const newData = [];
      const basePrice = 22500 + Math.random() * 1000;
      const volatility = timeframe === "1D" ? 100 : timeframe === "1W" ? 300 : 800;
      const points = timeframe === "1D" ? 24 : timeframe === "1W" ? 7 : 30;
      
      let currentPrice = basePrice;
      const trend = Math.random() > 0.5 ? 1 : -1;
      
      for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.5) * volatility;
        const trendInfluence = trend * (Math.random() * volatility * 0.3);
        currentPrice += change + trendInfluence;
        
        const timestamp = new Date();
        timestamp.setHours(0, 0, 0, 0);
        
        if (timeframe === "1D") {
          timestamp.setHours(i);
        } else if (timeframe === "1W") {
          timestamp.setDate(timestamp.getDate() - (6 - i));
        } else {
          timestamp.setDate(timestamp.getDate() - (29 - i));
        }
        
        newData.push({
          timestamp: timestamp.toISOString(),
          price: Math.max(currentPrice, basePrice * 0.7),
          label: timeframe === "1D" 
            ? `${i}:00` 
            : timestamp.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        });
      }
      
      return newData;
    };
    
    // Simulate network delay
    const timer = setTimeout(() => {
      setData(generateData());
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [timeframe]);

  const priceFormatter = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const currentPrice = useMemo(() => {
    return data.length ? data[data.length - 1].price : 0;
  }, [data]);
  
  const startPrice = useMemo(() => {
    return data.length ? data[0].price : 0;
  }, [data]);
  
  const priceChange = currentPrice - startPrice;
  const percentChange = startPrice ? (priceChange / startPrice) * 100 : 0;
  const isPriceUp = priceChange >= 0;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      {
        "bg-white": variant === "default",
        "bg-gray-50": variant === "filled",
        "glass-card": variant === "glass",
      },
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center">
              {title}
              <span className="text-sm font-normal text-gray-500 ml-2">{symbol}</span>
            </CardTitle>
            <div className="flex items-center mt-1">
              <div className="text-xl font-semibold">{priceFormatter(currentPrice)}</div>
              <div className={cn(
                "ml-2 text-sm font-medium flex items-center",
                isPriceUp ? "text-algo-green-DEFAULT" : "text-algo-red-DEFAULT"
              )}>
                <span>{isPriceUp ? "+" : ""}{priceChange.toFixed(0)}</span>
                <span className="ml-1">({isPriceUp ? "+" : ""}{percentChange.toFixed(2)}%)</span>
              </div>
            </div>
          </div>
          <div>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px]" style={{ height: `${height}px` }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-full max-w-md mx-auto">
                <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded mt-4 w-32 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isPriceUp ? "#10B981" : "#EF4444"} 
                      stopOpacity={0.3} 
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isPriceUp ? "#10B981" : "#EF4444"} 
                      stopOpacity={0} 
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10 }}
                  minTickGap={20}
                />
                <YAxis 
                  domain={["dataMin - 100", "dataMax + 100"]}
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  tickFormatter={priceFormatter}
                  orientation="right"
                />
                <Tooltip 
                  formatter={(value: number) => [`${priceFormatter(value)}`, "Price"]}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{ 
                    borderRadius: "8px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                    padding: "10px",
                    border: "none"
                  }}
                />
                <ReferenceLine 
                  y={startPrice} 
                  stroke="#888888" 
                  strokeDasharray="3 3"
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPriceUp ? "#10B981" : "#EF4444"} 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrice)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingChart;
