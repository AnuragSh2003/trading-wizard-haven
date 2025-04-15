import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScreenerTypeSelector } from "@/components/screener/ScreenerTypeSelector";
import TradingChart from "@/components/ui/TradingChart";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  Bookmark,
  RefreshCw,
  Download,
  Info,
  ShoppingCart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  generateMockStocks, 
  getIndicatorsByType, 
  analyzeStock,
  IndicatorConfig
} from "@/utils/screenerUtils";
import { Stock, ScreenerResult } from "@/types/stock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TradeDialog from "@/components/screener/TradeDialog";

const Screener = () => {
  const [screenerType, setScreenerType] = useState<'Trend' | 'Momentum' | 'Volatility' | 'Volume' | 'Custom'>('Trend');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [results, setResults] = useState<ScreenerResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ScreenerResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [indicators, setIndicators] = useState<IndicatorConfig[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<Set<string>>(new Set());
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [changeRange, setChangeRange] = useState<[number, number]>([-10, 10]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const stockData = generateMockStocks(20);
      setStocks(stockData);
      
      const selectedIndicators = getIndicatorsByType(screenerType);
      setIndicators(selectedIndicators);
      
      const screeningResults = stockData.map(stock => 
        analyzeStock(stock, selectedIndicators)
      );
      
      screeningResults.sort((a, b) => Math.abs(b.totalScore) - Math.abs(a.totalScore));
      
      setResults(screeningResults);
      setIsLoading(false);
      
      if (screeningResults.length > 0 && !selectedResult) {
        setSelectedResult(screeningResults[0]);
      }
      
      setSelectedStocks(new Set());
    };
    
    fetchData();
  }, [screenerType]);

  const handleScreenerTypeChange = (type: 'Trend' | 'Momentum' | 'Volatility' | 'Volume' | 'Custom') => {
    setScreenerType(type);
    setSelectedResult(null);
    toast({
      title: "Screener updated",
      description: `Changed to ${type} indicators`,
    });
  };

  const filteredResults = results.filter(result => 
    (result.stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.stock.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    result.stock.price >= priceRange[0] && 
    result.stock.price <= priceRange[1] &&
    result.stock.change >= changeRange[0] &&
    result.stock.change <= changeRange[1]
  );

  const handleRefresh = () => {
    setScreenerType(screenerType);
    toast({
      title: "Data refreshed",
      description: "Latest market data has been loaded",
    });
  };

  const handleExport = () => {
    toast({
      title: "Results exported",
      description: "Screener results have been exported to CSV",
    });
  };

  const toggleStockSelection = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const newSelected = new Set(selectedStocks);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStocks(newSelected);
  };

  const handleTradeSelectedStocks = () => {
    if (selectedStocks.size === 0) {
      toast({
        title: "No stocks selected",
        description: "Please select at least one stock to trade",
      });
      return;
    }
    
    setIsTradeDialogOpen(true);
  };

  const getSelectedStocksData = () => {
    return results.filter(result => selectedStocks.has(result.id));
  };

  const handleCloseDetails = () => {
    setSelectedResult(null);
  };

  const renderSignalBadge = (signal: 'Buy' | 'Short' | 'Wait') => {
    return (
      <Badge 
        className={cn(
          "font-medium py-1 px-2 text-white",
          signal === "Buy" ? "bg-[#22c55e]" : 
          signal === "Short" ? "bg-[#ea384c]" : 
          "bg-gray-400"
        )}
      >
        {signal}
      </Badge>
    );
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  const handleChangeRangeChange = (values: number[]) => {
    setChangeRange([values[0], values[1]]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-24 md:px-6">
        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Technical Indicator Screener</h1>
              <p className="text-muted-foreground mt-1">Find trading opportunities using technical analysis indicators</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="h-10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="h-10"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Select Screener Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-md">
                  <p className="text-sm text-gray-500 mb-4">
                    Choose one of the 5 screener types below to view stocks filtered by key technical indicators.
                    Each screener shows a table with indicator scores and a final trading signal.
                  </p>
                  <ScreenerTypeSelector onScreenerTypeChange={handleScreenerTypeChange} />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={cn(
                selectedResult ? "lg:col-span-2" : "lg:col-span-3"
              )}>
                <Card className="shadow-sm h-full">
                  <CardHeader className="pb-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="flex items-center">
                        <CardTitle className="text-lg font-semibold">
                          {screenerType} Indicators
                        </CardTitle>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="px-2">
                                <Info className="h-4 w-4 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm p-4">
                              <p className="font-medium mb-2">About {screenerType} Indicators</p>
                              <ul className="text-sm space-y-1 list-disc pl-4">
                                {indicators.map(indicator => (
                                  <li key={indicator.name}>
                                    <span className="font-medium">{indicator.name}</span>: {indicator.description}
                                  </li>
                                ))}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9"
                          onClick={() => setShowFilters(!showFilters)}
                        >
                          <SlidersHorizontal className="h-4 w-4 mr-2" />
                          Filters
                        </Button>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="Search stocks..." 
                            className="pl-9 w-full sm:w-[200px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showFilters && (
                      <div className="bg-gray-50 p-4 mb-4 rounded-md border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium mb-3">Price Range (₹)</h3>
                            <div className="px-2">
                              <Slider 
                                defaultValue={[0, 5000]} 
                                max={5000} 
                                step={100}
                                value={[priceRange[0], priceRange[1]]}
                                onValueChange={handlePriceRangeChange}
                                className="mb-2"
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>₹{priceRange[0]}</span>
                                <span>₹{priceRange[1]}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-3">Change Percentage (%)</h3>
                            <div className="px-2">
                              <Slider 
                                defaultValue={[-10, 10]} 
                                min={-10}
                                max={10} 
                                step={0.5}
                                value={[changeRange[0], changeRange[1]]}
                                onValueChange={handleChangeRangeChange}
                                className="mb-2"
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{changeRange[0]}%</span>
                                <span>{changeRange[1]}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="overflow-x-auto mt-4">
                      {isLoading ? (
                        <div className="py-12 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[40px]"></TableHead>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Change</TableHead>
                                <TableHead className="hidden md:table-cell">Signals</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Signal</TableHead>
                                <TableHead className="hidden md:table-cell">Strength</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredResults.length > 0 ? filteredResults.map((result) => (
                                <TableRow 
                                  key={result.id}
                                  className={cn(
                                    "cursor-pointer",
                                    selectedResult?.id === result.id ? "bg-primary/5" : ""
                                  )}
                                  onClick={() => setSelectedResult(result)}
                                >
                                  <TableCell>
                                    <Checkbox 
                                      checked={selectedStocks.has(result.id)}
                                      onCheckedChange={(checked) => {
                                        const newSelected = new Set(selectedStocks);
                                        if (checked) {
                                          newSelected.add(result.id);
                                        } else {
                                          newSelected.delete(result.id);
                                        }
                                        setSelectedStocks(newSelected);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                        {result.stock.symbol.slice(0, 2)}
                                      </div>
                                      <div>
                                        <div className="font-medium">{result.stock.name}</div>
                                        <div className="text-xs text-gray-500">{result.stock.symbol}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    ₹{result.stock.price.toLocaleString('en-IN', { 
                                      maximumFractionDigits: 2,
                                      minimumFractionDigits: 2
                                    })}
                                  </TableCell>
                                  <TableCell className={cn(
                                    "font-medium",
                                    result.stock.change >= 0 ? "text-algo-green-DEFAULT" : "text-algo-red-DEFAULT"
                                  )}>
                                    <div className="flex items-center">
                                      {result.stock.change >= 0 ? (
                                        <TrendingUp className="h-4 w-4 mr-1" />
                                      ) : (
                                        <TrendingDown className="h-4 w-4 mr-1" />
                                      )}
                                      {result.stock.change >= 0 ? "+" : ""}{result.stock.change.toFixed(2)}%
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    <div className="flex gap-1">
                                      <Badge className="bg-[#22c55e] text-white">
                                        {result.buySignals}
                                      </Badge>
                                      <Badge className="bg-[#ea384c] text-white">
                                        {result.shortSignals}
                                      </Badge>
                                    </div>
                                  </TableCell>
                                  <TableCell className={cn(
                                    "font-medium",
                                    result.totalScore > 0 ? "text-algo-green-DEFAULT" : 
                                    result.totalScore < 0 ? "text-algo-red-DEFAULT" : 
                                    "text-gray-500"
                                  )}>
                                    {result.totalScore > 0 ? "+" : ""}{result.totalScore}
                                  </TableCell>
                                  <TableCell>
                                    {renderSignalBadge(result.finalSignal)}
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    <div className="flex items-center">
                                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                        <div 
                                          className={cn(
                                            "h-2 rounded-full",
                                            result.finalSignal === "Buy" ? "bg-algo-green-DEFAULT" : 
                                            result.finalSignal === "Short" ? "bg-algo-red-DEFAULT" : 
                                            "bg-gray-400"
                                          )}
                                          style={{ width: `${(result.strength / 10) * 100}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs text-gray-500">{result.strength}/10</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="h-8 text-xs">
                                      View
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )) : (
                                <TableRow>
                                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                    No stocks match your search criteria
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                          
                          {selectedStocks.size > 0 && (
                            <div className="mt-4 flex justify-between items-center bg-blue-50 p-4 rounded-md border border-blue-100">
                              <div>
                                <span className="font-medium">{selectedStocks.size} stocks selected</span>
                              </div>
                              <Button 
                                onClick={handleTradeSelectedStocks}
                                className="bg-[#0EA5E9] hover:bg-[#0284c7] text-white font-medium shadow-sm py-2 px-4"
                                size="default"
                              >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Trade Selected
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {selectedResult && (
                <div className="lg:col-span-1">
                  <div className="space-y-6">
                    <Card className="shadow-sm">
                      <CardHeader className="pb-0">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                              {selectedResult.stock.symbol.slice(0, 2)}
                            </div>
                            <CardTitle className="text-lg font-semibold">{selectedResult.stock.name}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={handleCloseDetails}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-0">
                        <TradingChart 
                          title={`${selectedResult.stock.symbol}`}
                          symbol={selectedResult.stock.symbol}
                          height={220}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">Technical Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Signal</span>
                            <span className="flex items-center">
                              {renderSignalBadge(selectedResult.finalSignal)}
                              <span className="text-xs text-gray-500 ml-2">Score: {selectedResult.totalScore}</span>
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Strength</span>
                            <div className="flex items-center">
                              <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className={cn(
                                    "h-2 rounded-full",
                                    selectedResult.finalSignal === "Buy" ? "bg-algo-green-DEFAULT" : 
                                    selectedResult.finalSignal === "Short" ? "bg-algo-red-DEFAULT" : 
                                    "bg-gray-400"
                                  )}
                                  style={{ width: `${(selectedResult.strength / 10) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{selectedResult.strength}/10</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Active Indicators</div>
                            <div className="flex flex-wrap gap-2">
                              {selectedResult.indicators.length > 0 ? (
                                selectedResult.indicators.map((indicator, index) => (
                                  <Badge 
                                    key={index} 
                                    className={cn(
                                      "font-normal",
                                      indicator.includes("(Buy)") ? "bg-[#22c55e] text-white" : 
                                      "bg-[#ea384c] text-white"
                                    )}
                                  >
                                    {indicator}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500">No active indicators</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="pt-1">
                            <h4 className="text-sm font-medium mb-2">Key Metrics</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              {screenerType === 'Trend' && (
                                <>
                                  <div className="text-gray-500">SMA 50</div>
                                  <div className={cn(
                                    selectedResult.stock.price > selectedResult.stock.sma50 ? "text-algo-green-DEFAULT" : "text-algo-red-DEFAULT"
                                  )}>₹{selectedResult.stock.sma50.toFixed(2)}</div>
                                  
                                  <div className="text-gray-500">SMA 200</div>
                                  <div className={cn(
                                    selectedResult.stock.price > selectedResult.stock.sma200 ? "text-algo-green-DEFAULT" : "text-algo-red-DEFAULT"
                                  )}>₹{selectedResult.stock.sma200.toFixed(2)}</div>
                                  
                                  <div className="text-gray-500">MACD</div>
                                  <div className={cn(
                                    selectedResult.stock.macd > selectedResult.stock.macdSignal ? "text-algo-green-DEFAULT" : "text-algo-red-DEFAULT"
                                  )}>{selectedResult.stock.macd.toFixed(2)}</div>
                                  
                                  <div className="text-gray-500">ADX</div>
                                  <div className={cn(
                                    selectedResult.stock.adx > 25 ? "font-medium" : ""
                                  )}>{selectedResult.stock.adx.toFixed(2)}</div>
                                </>
                              )}
                              
                              {screenerType === 'Momentum' && (
                                <>
                                  <div className="text-gray-500">RSI</div>
                                  <div className={cn(
                                    selectedResult.stock.rsi < 30 ? "text-algo-green-DEFAULT" : 
                                    selectedResult.stock.rsi > 70 ? "text-algo-red-DEFAULT" : ""
                                  )}>{selectedResult.stock.rsi.toFixed(2)}</div>
                                  
                                  <div className="text-gray-500">Stoch %K</div>
                                  <div className={cn(
                                    selectedResult.stock.stochK < 20 ? "text-algo-green-DEFAULT" : 
                                    selectedResult.stock.stochK > 80 ? "text-algo-red-DEFAULT" : ""
                                  )}>{selectedResult.stock.stochK.toFixed(2)}</div>
                                  
                                  <div className="text-gray-500">CCI</div>
                                  <div className={cn(
                                    selectedResult.stock.cci < -100 ? "text-algo-green-DEFAULT" : 
                                    selectedResult.stock.cci > 100 ? "text-algo-red-DEFAULT" : ""
                                  )}>{selectedResult.stock.cci.toFixed(2)}</div>
                                  
                                  <div className="text-gray-500">Momentum</div>
                                  <div className={cn(
                                    selectedResult.stock.momentumValue > 0 ? "text-algo-green-DEFAULT" : 
                                    selectedResult.stock.momentumValue < 0 ? "text-algo-red-DEFAULT" : ""
                                  )}>{selectedResult.stock.momentumValue.toFixed(2)}</div>
                                </>
                              )}
                              
                              {screenerType === 'Volatility' && (
                                <>
                                  <div className="text-gray-500">BB Upper</div>
                                  <div>{selectedResult.stock.bbandsUpper.toFixed(2)}</div>
                                  
                                  <div className="text-gray-500">BB Lower</div>
                                  <div>{selectedResult.stock.bbandsLower.toFixed(2)}</div>
                                  
                                  <div className="text-gray-500">ATR</div>
                                  <div>{selectedResult.stock.atr.toFixed(2)}</div>
                                  
                                  <div className="text-gray-500">ATR %</div>
                                  <div>{((selectedResult.stock.atr / selectedResult.stock.price) * 100).toFixed(2)}%</div>
                                </>
                              )}
                              
                              {screenerType === 'Volume' && (
                                <>
                                  <div className="text-gray-500">Volume</div>
                                  <div>{selectedResult.stock.volume.toLocaleString()}</div>
                                  
                                  <div className="text-gray-500">Vol MA(20)</div>
                                  <div className={cn(
                                    selectedResult.stock.volume > selectedResult.stock.volumeMA20 ? "text-algo-green-DEFAULT" : ""
                                  )}>{selectedResult.stock.volumeMA20.toLocaleString()}</div>
                                  
                                  <div className="text-gray-500">OBV</div>
                                  <div className={cn(
                                    selectedResult.stock.obv > 0 ? "text-algo-green-DEFAULT" : 
                                    selectedResult.stock.obv < 0 ? "text-algo-red-DEFAULT" : ""
                                  )}>{selectedResult.stock.obv.toLocaleString()}</div>
                                  
                                  <div className="text-gray-500">CMF</div>
                                  <div className={cn(
                                    selectedResult.stock.cmf > 0.1 ? "text-algo-green-DEFAULT" : 
                                    selectedResult.stock.cmf < -0.1 ? "text-algo-red-DEFAULT" : ""
                                  )}>{selectedResult.stock.cmf.toFixed(2)}</div>
                                </>
                              )}
                              
                              {screenerType === 'Custom' && (
                                <>
                                  <div className="text-gray-500">Golden Cross</div>
                                  <div className={selectedResult.stock.isGoldenCross ? "text-algo-green-DEFAULT" : ""}>
                                    {selectedResult.stock.isGoldenCross ? "Yes" : "No"}
                                  </div>
                                  
                                  <div className="text-gray-500">Death Cross</div>
                                  <div className={selectedResult.stock.isDeathCross ? "text-algo-red-DEFAULT" : ""}>
                                    {selectedResult.stock.isDeathCross ? "Yes" : "No"}
                                  </div>
                                  
                                  <div className="text-gray-500">Price Pattern</div>
                                  <div className={cn(
                                    ['bullish_engulfing', 'hammer', 'morning_star', 'piercing_line'].includes(selectedResult.stock.priceActionPattern) ? "text-algo-green-DEFAULT" :
                                    ['bearish_engulfing', 'shooting_star', 'evening_star', 'dark_cloud_cover'].includes(selectedResult.stock.priceActionPattern) ? "text-algo-red-DEFAULT" : ""
                                  )}>
                                    {selectedResult.stock.priceActionPattern === 'none' ? 'None' : 
                                     selectedResult.stock.priceActionPattern.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                  </div>
                                  
                                  <div className="text-gray-500">52W High/Low</div>
                                  <div className={cn(
                                    selectedResult.stock.is52WeekHigh ? "text-algo-green-DEFAULT" :
                                    selectedResult.stock.is52WeekLow ? "text-algo-red-DEFAULT" : ""
                                  )}>
                                    {selectedResult.stock.is52WeekHigh ? "At 52W High" : 
                                     selectedResult.stock.is52WeekLow ? "At 52W Low" : "Neither"}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <Button className="w-full" size="sm">
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Run Backtest on this Stock
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      
      <TradeDialog
        isOpen={isTradeDialogOpen}
        onClose={() => setIsTradeDialogOpen(false)}
        selectedStocks={getSelectedStocksData()}
      />
    </div>
  );
};

export default Screener;
