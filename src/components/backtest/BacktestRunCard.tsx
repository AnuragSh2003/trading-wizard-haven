
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Play } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BacktestRunCardProps {
  strategies: string[];
  symbols: string[];
  onRun: (params: any) => void;
  className?: string;
  isLoading?: boolean;
}

const BacktestRunCard: React.FC<BacktestRunCardProps> = ({ 
  strategies, 
  symbols, 
  onRun,
  className,
  isLoading = false
}) => {
  const [selectedStrategy, setSelectedStrategy] = React.useState<string>("");
  const [selectedSymbols, setSelectedSymbols] = React.useState<string[]>([]);
  const [initialCapital, setInitialCapital] = React.useState<number>(100000);
  const [startDate, setStartDate] = React.useState<Date | undefined>(
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // 1 year ago
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(new Date());
  
  const handleRun = () => {
    if (!selectedStrategy || selectedSymbols.length === 0 || !startDate || !endDate) {
      // Would normally show an error toast here
      return;
    }
    
    onRun({
      strategy: selectedStrategy,
      symbols: selectedSymbols,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      initialCapital
    });
  };
  
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle>Run Backtest</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Strategy</label>
            <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                {strategies.map((strategy) => (
                  <SelectItem key={strategy} value={strategy}>
                    {strategy}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Symbols</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={selectedSymbols.length ? `${selectedSymbols.length} selected` : "Select symbols"} />
              </SelectTrigger>
              <SelectContent>
                {symbols.map((symbol) => (
                  <SelectItem 
                    key={symbol} 
                    value={symbol}
                    onSelect={() => {
                      if (selectedSymbols.includes(symbol)) {
                        setSelectedSymbols(selectedSymbols.filter(s => s !== symbol));
                      } else {
                        setSelectedSymbols([...selectedSymbols, symbol]);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedSymbols.includes(symbol)} 
                        onChange={() => {}} 
                        className="mr-2"
                      />
                      {symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedSymbols.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedSymbols.map(symbol => (
                  <div 
                    key={symbol} 
                    className="bg-gray-100 px-2 py-1 rounded-md text-xs flex items-center"
                  >
                    {symbol}
                    <button 
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => setSelectedSymbols(selectedSymbols.filter(s => s !== symbol))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Initial Capital (₹)</label>
            <Input 
              type="number" 
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              min={1000}
            />
          </div>
          
          <Button 
            className="w-full"
            onClick={handleRun}
            disabled={isLoading || !selectedStrategy || selectedSymbols.length === 0 || !startDate || !endDate}
          >
            <Play className="mr-2 h-4 w-4" />
            {isLoading ? "Running..." : "Run Backtest"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BacktestRunCard;
