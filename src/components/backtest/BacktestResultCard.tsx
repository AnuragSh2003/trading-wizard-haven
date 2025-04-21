
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import { BacktestResult } from "@/types/stock";
import { cn } from "@/lib/utils";

interface BacktestResultCardProps {
  result: BacktestResult;
  className?: string;
}

const BacktestResultCard: React.FC<BacktestResultCardProps> = ({ result, className }) => {
  const isPositiveReturn = result.totalReturn >= 0;
  const formattedReturn = `${isPositiveReturn ? '+' : ''}${(result.totalReturn * 100).toFixed(2)}%`;
  
  // Format currency for Indian Rupees
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <Card className={cn("shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold">{result.strategy}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(result.startDate).toLocaleDateString()} - {new Date(result.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className={cn(
            "text-lg font-bold flex items-center",
            isPositiveReturn ? "text-green-600" : "text-red-600"
          )}>
            {isPositiveReturn ? (
              <ArrowUpRight className="mr-1 h-5 w-5" />
            ) : (
              <ArrowDownRight className="mr-1 h-5 w-5" />
            )}
            {formattedReturn}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-1 mb-6 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={result.equityCurve}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 10 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={['dataMin - 1000', 'dataMax + 1000']}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Equity']}
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              />
              <Line 
                type="monotone" 
                dataKey="equity" 
                stroke={isPositiveReturn ? "#10B981" : "#EF4444"} 
                strokeWidth={2} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Initial Capital</p>
            <p className="font-semibold">{formatCurrency(result.initialCapital)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Final Capital</p>
            <p className="font-semibold">{formatCurrency(result.finalCapital)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Sharpe Ratio</p>
            <p className="font-semibold">{result.sharpeRatio.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Max Drawdown</p>
            <p className="font-semibold text-red-600">-{(result.maxDrawdown * 100).toFixed(2)}%</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Win Rate</p>
            <p className="font-semibold">{(result.statistics.winRate * 100).toFixed(2)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Profit Factor</p>
            <p className="font-semibold">{result.statistics.profitFactor.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Total Trades</p>
            <p className="font-semibold">{result.statistics.totalTrades}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Avg. Profit</p>
            <p className={cn(
              "font-semibold",
              result.statistics.averageWin > result.statistics.averageLoss ? "text-green-600" : "text-red-600"
            )}>
              {formatCurrency(result.statistics.averageWin - result.statistics.averageLoss)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BacktestResultCard;
