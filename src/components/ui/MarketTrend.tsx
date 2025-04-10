
import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketTrendProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  marketCap?: string;
  className?: string;
}

const MarketTrend: React.FC<MarketTrendProps> = ({
  symbol,
  name,
  price,
  change,
  volume,
  marketCap,
  className,
}) => {
  const isPositive = change >= 0;
  const changeAbs = Math.abs(change);
  
  const priceFormatted = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  }, [price]);

  return (
    <div 
      className={cn(
        "flex items-center justify-between py-4 border-b border-gray-100 last:border-0",
        className
      )}
    >
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex h-8 w-8 bg-gray-100 rounded-full items-center justify-center text-xs font-semibold text-gray-700">
          {symbol.slice(0, 2)}
        </div>
        <div>
          <div className="flex items-center">
            <p className="font-medium">{name}</p>
            <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0 h-4 text-gray-500">
              {symbol}
            </Badge>
          </div>
          {marketCap && (
            <p className="text-xs text-gray-500 mt-1">
              Market Cap: {marketCap}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-sm text-gray-500">
          {volume}
        </div>
        <div className="flex flex-col items-end">
          <p className="font-medium">{priceFormatted}</p>
          <div className="flex items-center mt-1">
            <div 
              className={cn(
                "text-xs font-medium",
                isPositive ? "text-algo-green-DEFAULT" : "text-algo-red-DEFAULT"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3 inline mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 inline mr-1" />
              )}
              {isPositive ? "+" : ""}{change.toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="hidden md:block w-24">
          <Progress 
            value={50 + (isPositive ? Math.min(changeAbs, 10) * 3 : -Math.min(changeAbs, 10) * 3)} 
            className={cn(
              "h-1.5",
              isPositive ? "text-algo-green-DEFAULT" : "text-algo-red-DEFAULT"
            )} 
          />
        </div>
      </div>
    </div>
  );
};

export default MarketTrend;
