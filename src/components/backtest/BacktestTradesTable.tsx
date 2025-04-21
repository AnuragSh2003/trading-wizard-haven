
import React from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell, 
  TableCaption 
} from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BacktestTrade } from "@/types/stock";
import { cn } from "@/lib/utils";

interface BacktestTradesTableProps {
  trades: BacktestTrade[];
  className?: string;
}

const BacktestTradesTable: React.FC<BacktestTradesTableProps> = ({ trades, className }) => {
  // Format currency for Indian Rupees
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div className={cn("overflow-x-auto", className)}>
      <Table>
        <TableCaption>Backtest trades details</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Entry Date</TableHead>
            <TableHead>Entry Price</TableHead>
            <TableHead>Exit Date</TableHead>
            <TableHead>Exit Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>P&L</TableHead>
            <TableHead>Exit Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => {
            const isProfitable = trade.pnl > 0;
            
            return (
              <TableRow key={trade.id}>
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 text-xs font-semibold rounded-full",
                    trade.type === "BUY" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                  )}>
                    {trade.type}
                  </span>
                </TableCell>
                <TableCell>{new Date(trade.entryDate).toLocaleDateString()}</TableCell>
                <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
                <TableCell>{new Date(trade.exitDate).toLocaleDateString()}</TableCell>
                <TableCell>{formatCurrency(trade.exitPrice)}</TableCell>
                <TableCell>{trade.quantity}</TableCell>
                <TableCell>
                  <div className={cn(
                    "flex items-center",
                    isProfitable ? "text-green-600" : "text-red-600"
                  )}>
                    {isProfitable ? (
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                    )}
                    <span>{formatCurrency(trade.pnl)}</span>
                    <span className="ml-1 text-xs">
                      ({isProfitable ? "+" : ""}{trade.pnlPercent.toFixed(2)}%)
                    </span>
                  </div>
                </TableCell>
                <TableCell>{trade.exitReason}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default BacktestTradesTable;
