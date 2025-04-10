import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TradingChart from "@/components/ui/TradingChart";
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown,
  Bookmark,
  BookmarkPlus,
  RefreshCw,
  Download,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const fetchScreenerData = async (filters: ScreenerFilters): Promise<ScreenerResult[]> => {
  console.log("Fetching screener data with filters:", filters);
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return mockScreenerData.filter(item => {
    if (filters.minPrice && item.price < filters.minPrice) return false;
    if (filters.maxPrice && item.price > filters.maxPrice) return false;
    if (filters.minVolume && parseFloat(item.volume.replace(/[^0-9.]/g, '')) < filters.minVolume) return false;
    if (filters.minChange && item.change < filters.minChange) return false;
    if (filters.maxChange && item.change > filters.maxChange) return false;
    if (filters.patternType && filters.patternType !== "all" && item.pattern !== filters.patternType) return false;
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !item.symbol.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
};

interface ScreenerFilters {
  search: string;
  minPrice?: number;
  maxPrice?: number;
  minVolume?: number;
  minChange?: number;
  maxChange?: number;
  patternType: string;
  timeframe: string;
}

interface ScreenerResult {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
  pattern: string;
  signal: "buy" | "sell" | "neutral";
  strength: number;
  timeframe: string;
}

const mockScreenerData: ScreenerResult[] = [
  { 
    id: "1", 
    symbol: "RELIANCE", 
    name: "Reliance Industries", 
    price: 2950.75, 
    change: 1.24, 
    volume: "₹24.8Cr", 
    marketCap: "₹19.9L Cr", 
    pattern: "double_bottom",
    signal: "buy",
    strength: 8,
    timeframe: "1D"
  },
  { 
    id: "2", 
    symbol: "TCS", 
    name: "Tata Consultancy Services", 
    price: 3890.40, 
    change: 2.87, 
    volume: "₹15.3Cr", 
    marketCap: "₹14.2L Cr", 
    pattern: "ascending_triangle",
    signal: "buy",
    strength: 7,
    timeframe: "1D"
  },
  { 
    id: "3", 
    symbol: "INFY", 
    name: "Infosys", 
    price: 1630.25, 
    change: 5.62, 
    volume: "₹8.2Cr", 
    marketCap: "₹6.7L Cr", 
    pattern: "breakout",
    signal: "buy",
    strength: 9,
    timeframe: "1D"
  },
  { 
    id: "4", 
    symbol: "HDFCBANK", 
    name: "HDFC Bank", 
    price: 1540.85, 
    change: -0.82, 
    volume: "₹5.5Cr", 
    marketCap: "₹8.6L Cr", 
    pattern: "head_shoulders",
    signal: "sell",
    strength: 6,
    timeframe: "1D"
  },
  { 
    id: "5", 
    symbol: "BHARTIARTL", 
    name: "Bharti Airtel", 
    price: 1190.65, 
    change: -1.56, 
    volume: "₹3.2Cr", 
    marketCap: "₹6.7L Cr", 
    pattern: "falling_wedge",
    signal: "neutral",
    strength: 4,
    timeframe: "1D"
  },
  { 
    id: "6", 
    symbol: "ICICIBANK", 
    name: "ICICI Bank", 
    price: 978.45, 
    change: 2.38, 
    volume: "₹6.8Cr", 
    marketCap: "₹6.9L Cr", 
    pattern: "cup_handle",
    signal: "buy",
    strength: 7,
    timeframe: "1D"
  },
  { 
    id: "7", 
    symbol: "SBIN", 
    name: "State Bank of India", 
    price: 725.30, 
    change: 3.75, 
    volume: "₹4.5Cr", 
    marketCap: "₹6.5L Cr", 
    pattern: "double_top",
    signal: "sell",
    strength: 6,
    timeframe: "1D"
  },
  { 
    id: "8", 
    symbol: "TATAMOTORS", 
    name: "Tata Motors", 
    price: 932.60, 
    change: -0.67, 
    volume: "₹3.7Cr", 
    marketCap: "₹3.1L Cr", 
    pattern: "descending_triangle",
    signal: "sell",
    strength: 7,
    timeframe: "1D"
  },
  { 
    id: "9", 
    symbol: "ASIANPAINT", 
    name: "Asian Paints", 
    price: 2893.25, 
    change: 0.42, 
    volume: "₹2.2Cr", 
    marketCap: "₹2.8L Cr", 
    pattern: "bullish_flag",
    signal: "buy",
    strength: 6,
    timeframe: "1D"
  },
  { 
    id: "10", 
    symbol: "WIPRO", 
    name: "Wipro", 
    price: 452.80, 
    change: 1.14, 
    volume: "₹1.8Cr", 
    marketCap: "₹2.4L Cr", 
    pattern: "rounding_bottom",
    signal: "buy",
    strength: 5,
    timeframe: "1D"
  },
];

const patternTypes = [
  { value: "all", label: "All Patterns" },
  { value: "double_bottom", label: "Double Bottom" },
  { value: "double_top", label: "Double Top" },
  { value: "head_shoulders", label: "Head and Shoulders" },
  { value: "ascending_triangle", label: "Ascending Triangle" },
  { value: "descending_triangle", label: "Descending Triangle" },
  { value: "breakout", label: "Breakout" },
  { value: "falling_wedge", label: "Falling Wedge" },
  { value: "cup_handle", label: "Cup and Handle" },
  { value: "bullish_flag", label: "Bullish Flag" },
  { value: "rounding_bottom", label: "Rounding Bottom" },
];

const Screener = () => {
  const [selectedAsset, setSelectedAsset] = useState<ScreenerResult | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("screener");
  
  const [filters, setFilters] = useState<ScreenerFilters>({
    search: "",
    minPrice: undefined,
    maxPrice: undefined,
    minVolume: undefined,
    minChange: undefined,
    maxChange: undefined,
    patternType: "all",
    timeframe: "1D"
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['screenerData', filters],
    queryFn: () => fetchScreenerData(filters),
  });

  const handleFilterChange = (key: keyof ScreenerFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      minPrice: undefined,
      maxPrice: undefined,
      minVolume: undefined,
      minChange: undefined,
      maxChange: undefined,
      patternType: "all",
      timeframe: "1D"
    });
    toast({
      title: "Filters cleared",
      description: "All screener filters have been reset",
    });
  };

  const saveScreener = () => {
    toast({
      title: "Screener saved",
      description: "Your custom screener configuration has been saved",
    });
  };

  const exportResults = () => {
    toast({
      title: "Results exported",
      description: "Screener results have been exported to CSV",
    });
  };

  const renderPatternBadge = (pattern: string) => {
    const patternInfo = patternTypes.find(p => p.value === pattern);
    return (
      <Badge variant="outline" className="font-normal">
        {patternInfo?.label || pattern}
      </Badge>
    );
  };

  const renderSignalBadge = (signal: "buy" | "sell" | "neutral") => {
    return (
      <Badge 
        className={cn(
          "font-normal",
          signal === "buy" ? "bg-algo-green-DEFAULT text-white" : 
          signal === "sell" ? "bg-algo-red-DEFAULT text-white" : 
          "bg-gray-200 text-gray-700"
        )}
      >
        {signal.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-24 md:px-6">
        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">NSE Market Screener</h1>
              <p className="text-muted-foreground mt-1">Find trading opportunities in NSE India with our technical analysis screener</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className="h-10"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {isFilterPanelOpen ? "Hide Filters" : "Show Filters"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveScreener}
                className="h-10"
              >
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                size="sm" 
                onClick={() => refetch()}
                className="h-10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
              <TabsTrigger value="screener">Screener</TabsTrigger>
              <TabsTrigger value="saved">Saved Screeners</TabsTrigger>
            </TabsList>
            
            <TabsContent value="screener" className="pt-4">
              <div className="grid grid-cols-1 gap-6">
                {isFilterPanelOpen && (
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold">Screener Filters</CardTitle>
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                          <X className="h-3.5 w-3.5 mr-1.5" />
                          Clear All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Price Range</label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Min</label>
                                <Input
                                  type="number"
                                  placeholder="Min Price"
                                  value={filters.minPrice || ""}
                                  onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Max</label>
                                <Input
                                  type="number"
                                  placeholder="Max Price"
                                  value={filters.maxPrice || ""}
                                  onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                                  className="h-9"
                                />
                              </div>
                            </div>
                          </div>
                        
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Minimum Volume</label>
                            <Input
                              type="number"
                              placeholder="Min Volume in USD"
                              value={filters.minVolume || ""}
                              onChange={(e) => handleFilterChange("minVolume", e.target.value ? Number(e.target.value) : undefined)}
                              className="h-9"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Price Change %</label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Min</label>
                                <Input
                                  type="number"
                                  placeholder="Min Change %"
                                  value={filters.minChange || ""}
                                  onChange={(e) => handleFilterChange("minChange", e.target.value ? Number(e.target.value) : undefined)}
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Max</label>
                                <Input
                                  type="number"
                                  placeholder="Max Change %"
                                  value={filters.maxChange || ""}
                                  onChange={(e) => handleFilterChange("maxChange", e.target.value ? Number(e.target.value) : undefined)}
                                  className="h-9"
                                />
                              </div>
                            </div>
                          </div>
                        
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Chart Pattern</label>
                            <Select 
                              value={filters.patternType} 
                              onValueChange={(val) => handleFilterChange("patternType", val)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select pattern" />
                              </SelectTrigger>
                              <SelectContent>
                                {patternTypes.map((pattern) => (
                                  <SelectItem key={pattern.value} value={pattern.value}>
                                    {pattern.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Timeframe</label>
                            <Select 
                              value={filters.timeframe} 
                              onValueChange={(val) => handleFilterChange("timeframe", val)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select timeframe" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1H">1 Hour</SelectItem>
                                <SelectItem value="4H">4 Hours</SelectItem>
                                <SelectItem value="1D">1 Day</SelectItem>
                                <SelectItem value="1W">1 Week</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="pt-4 flex justify-end">
                            <Button 
                              onClick={() => refetch()}
                              className="w-full md:w-auto"
                            >
                              <Filter className="h-4 w-4 mr-2" />
                              Apply Filters
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className={cn(
                    "lg:col-span-3",
                    selectedAsset ? "lg:col-span-2" : "lg:col-span-3"
                  )}>
                    <Card className="shadow-sm">
                      <CardHeader className="pb-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                          <CardTitle className="text-lg font-semibold">NSE Screening Results</CardTitle>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-grow">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input 
                                placeholder="Search assets..." 
                                className="pl-9 w-full sm:w-[200px]"
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                              />
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={exportResults}
                              className="hidden sm:flex h-10"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto mt-4">
                          {isLoading ? (
                            <div className="py-12 flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Symbol</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>24h Change</TableHead>
                                  <TableHead className="hidden md:table-cell">Pattern</TableHead>
                                  <TableHead>Signal</TableHead>
                                  <TableHead className="hidden md:table-cell">Strength</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {data && data.length > 0 ? data.map((item) => (
                                  <TableRow 
                                    key={item.id}
                                    className={cn(
                                      "cursor-pointer",
                                      selectedAsset?.id === item.id ? "bg-primary/5" : ""
                                    )}
                                    onClick={() => setSelectedAsset(item)}
                                  >
                                    <TableCell>
                                      <div className="flex items-center">
                                        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                          {item.symbol.slice(0, 2)}
                                        </div>
                                        <div>
                                          <div className="font-medium">{item.name}</div>
                                          <div className="text-xs text-gray-500">{item.symbol}</div>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      ₹{item.price < 0.01 
                                        ? item.price.toFixed(6) 
                                        : item.price < 1 
                                          ? item.price.toFixed(4) 
                                          : item.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })
                                      }
                                    </TableCell>
                                    <TableCell className={cn(
                                      "font-medium",
                                      item.change >= 0 ? "text-algo-green-DEFAULT" : "text-algo-red-DEFAULT"
                                    )}>
                                      <div className="flex items-center">
                                        {item.change >= 0 ? (
                                          <TrendingUp className="h-4 w-4 mr-1" />
                                        ) : (
                                          <TrendingDown className="h-4 w-4 mr-1" />
                                        )}
                                        {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                                      </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {renderPatternBadge(item.pattern)}
                                    </TableCell>
                                    <TableCell>
                                      {renderSignalBadge(item.signal)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      <div className="flex items-center">
                                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                          <div 
                                            className={cn(
                                              "h-2 rounded-full",
                                              item.signal === "buy" ? "bg-algo-green-DEFAULT" : 
                                              item.signal === "sell" ? "bg-algo-red-DEFAULT" : 
                                              "bg-gray-400"
                                            )}
                                            style={{ width: `${(item.strength / 10) * 100}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-xs text-gray-500">{item.strength}/10</span>
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
                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                      No assets match your search criteria
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {selectedAsset && (
                    <div className="lg:col-span-1">
                      <div className="space-y-6">
                        <Card className="shadow-sm">
                          <CardHeader className="pb-0">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                                  {selectedAsset.symbol.slice(0, 2)}
                                </div>
                                <CardTitle className="text-lg font-semibold">{selectedAsset.name}</CardTitle>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8">
                                <Bookmark className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-0">
                            <TradingChart 
                              title={`${selectedAsset.symbol}`}
                              symbol={selectedAsset.symbol}
                              height={250}
                            />
                          </CardContent>
                        </Card>
                        
                        <Card className="shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold">Pattern Analysis</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Pattern</span>
                                <span>{renderPatternBadge(selectedAsset.pattern)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Signal</span>
                                <span>{renderSignalBadge(selectedAsset.signal)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Strength</span>
                                <div className="flex items-center">
                                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                    <div 
                                      className={cn(
                                        "h-2 rounded-full",
                                        selectedAsset.signal === "buy" ? "bg-algo-green-DEFAULT" : 
                                        selectedAsset.signal === "sell" ? "bg-algo-red-DEFAULT" : 
                                        "bg-gray-400"
                                      )}
                                      style={{ width: `${(selectedAsset.strength / 10) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs">{selectedAsset.strength}/10</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Timeframe</span>
                                <span>{selectedAsset.timeframe}</span>
                              </div>
                              
                              <div className="pt-2">
                                <h4 className="text-sm font-medium mb-2">Pattern Description</h4>
                                <p className="text-sm text-gray-600">
                                  {getPatternDescription(selectedAsset.pattern)}
                                </p>
                              </div>
                              
                              <div className="pt-2">
                                <Button className="w-full" size="sm">
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Run Backtest on this Pattern
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
            </TabsContent>
            
            <TabsContent value="saved" className="pt-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Saved NSE Screeners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      { id: 1, name: "Nifty 50 Breakouts", description: "Nifty 50 stocks showing bullish breakout patterns", timeframe: "1D", count: 8 },
                      { id: 2, name: "Bank Nifty Oversold", description: "Bank Nifty stocks that are oversold and ready for a bounce", timeframe: "4H", count: 5 },
                      { id: 3, name: "IT Sector Leaders", description: "IT sector stocks continuing uptrends", timeframe: "1D", count: 6 },
                    ].map((screener) => (
                      <Card key={screener.id} className="bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <h3 className="font-medium">{screener.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{screener.description}</p>
                          <div className="flex justify-between items-center mt-4">
                            <Badge variant="outline">{screener.timeframe}</Badge>
                            <span className="text-xs text-gray-500">{screener.count} stocks</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

function getPatternDescription(pattern: string): string {
  const descriptions: Record<string, string> = {
    double_bottom: "A double bottom is a bullish reversal pattern that shows a price drop, rebound, another drop to the same level, and then another rebound, forming a 'W' shape.",
    double_top: "A double top is a bearish reversal pattern that shows a price rise, decline, another rise to the same level, and then another decline, forming an 'M' shape.",
    head_shoulders: "A head and shoulders pattern is a bearish reversal pattern with three peaks, the middle one (head) being the highest and the two others (shoulders) being lower and roughly equal.",
    ascending_triangle: "An ascending triangle is a bullish continuation pattern with a horizontal upper trendline and an upward-sloping lower trendline, indicating buying pressure.",
    descending_triangle: "A descending triangle is a bearish continuation pattern with a horizontal lower trendline and a downward-sloping upper trendline, indicating selling pressure.",
    breakout: "A breakout occurs when the price moves above a resistance level or below a support level with increased volume, indicating a potential trend continuation.",
    falling_wedge: "A falling wedge is a bullish reversal pattern that forms when the price makes lower lows and lower highs with converging trendlines, suggesting a potential upside breakout.",
    cup_handle: "A cup and handle is a bullish continuation pattern resembling a cup with a handle, where the cup is a U-shape and the handle is a slight downward drift.",
    bullish_flag: "A bullish flag is a continuation pattern that shows a strong uptrend (the pole) followed by a consolidation period (the flag) before continuing the uptrend.",
    rounding_bottom: "A rounding bottom is a bullish reversal pattern that forms during a downtrend and resembles a 'U' shape, indicating a gradual shift from selling to buying pressure."
  };
  
  return descriptions[pattern] || "Pattern description not available.";
}

export default Screener;
