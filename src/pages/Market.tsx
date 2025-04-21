
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ChevronDown, 
  BarChart2, 
  LineChart as LineChartIcon, 
  CandlestickChart,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Book,
  Clock,
  HelpCircle
} from "lucide-react";
import TradingChart from "@/components/ui/TradingChart";
import MarketTrend from "@/components/ui/MarketTrend";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { marketApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const marketData = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2850.42, change: 1.24, volume: "₹24.8B", marketCap: "₹550.2B" },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3750.18, change: 2.87, volume: "₹15.3B", marketCap: "₹210.5B" },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1593.75, change: 5.62, volume: "₹3.2B", marketCap: "₹38.9B" },
  { symbol: "INFY", name: "Infosys", price: 1441.38, change: -0.82, volume: "₹1.5B", marketCap: "₹38.2B" },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 962.62, change: 1.14, volume: "₹1.8B", marketCap: "₹32.8B" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", price: 2538.38, change: -1.56, volume: "₹420.5M", marketCap: "₹13.4B" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 7078.45, change: 2.38, volume: "₹980.6M", marketCap: "₹10.9B" },
  { symbol: "SBIN", name: "State Bank of India", price: 613.84, change: 3.75, volume: "₹725.3M", marketCap: "₹7.4B" },
  { symbol: "LT", name: "Larsen & Toubro", price: 3032.56, change: -0.67, volume: "₹510.2M", marketCap: "₹7.2B" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1195.93, change: 0.42, volume: "₹322.8M", marketCap: "₹6.7B" },
];

const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [sortBy, setSortBy] = useState("market_cap");
  const [selectedStock, setSelectedStock] = useState("NIFTY");
  const { toast } = useToast();
  
  const [marketOverview, setMarketOverview] = useState({
    nifty50: { value: 22735.70, change: 1.2 },
    sensex: { value: 74261.40, change: 1.1 },
    bankNifty: { value: 48762.30, change: 0.8 },
    fiiActivity: "₹1,234.56 Cr (Buy)",
    diiActivity: "₹876.43 Cr (Buy)",
    advanceDecline: "1223:765",
    volatilityIndex: 13.2
  });
  
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // This is a placeholder for real API call
        // const response = await marketApi.getNseMarketData();
        // setMarketOverview(response);
        
        // For now, we'll use mock data
        console.log("Fetching NSE market data...");
      } catch (error) {
        console.error("Error fetching market data:", error);
        toast({
          title: "Failed to fetch market data",
          description: "Could not retrieve the latest market information.",
          variant: "destructive",
        });
      }
    };
    
    fetchMarketData();
  }, [toast]);
  
  const filteredMarketData = marketData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedMarketData = [...filteredMarketData].sort((a, b) => {
    if (sortBy === "market_cap") {
      return parseFloat(b.marketCap.replace(/[^0-9.]/g, '')) - parseFloat(a.marketCap.replace(/[^0-9.]/g, ''));
    } else if (sortBy === "price_asc") {
      return a.price - b.price;
    } else if (sortBy === "price_desc") {
      return b.price - a.price;
    } else if (sortBy === "change") {
      return b.change - a.change;
    } else if (sortBy === "volume") {
      return parseFloat(b.volume.replace(/[^0-9.]/g, '')) - parseFloat(a.volume.replace(/[^0-9.]/g, ''));
    }
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-24 md:px-6">
        <div className="grid grid-cols-1 gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">NSE Market Data</h1>
              <p className="text-muted-foreground mt-1">Real-time market insights and price charts for NSE stocks</p>
            </div>
          </div>
          
          {/* Market Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in animate-delay-1">
            <div className="lg:col-span-2">
              <Card className="shadow-sm overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">
                      {selectedStock === "NIFTY" ? "NIFTY 50" : selectedStock}
                    </CardTitle>
                    <div className="flex gap-3">
                      <div className="flex gap-1.5">
                        <Button 
                          variant={selectedTimeframe === "1H" ? "default" : "outline"} 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => setSelectedTimeframe("1H")}
                        >
                          1H
                        </Button>
                        <Button 
                          variant={selectedTimeframe === "1D" ? "default" : "outline"} 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => setSelectedTimeframe("1D")}
                        >
                          1D
                        </Button>
                        <Button 
                          variant={selectedTimeframe === "1W" ? "default" : "outline"} 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => setSelectedTimeframe("1W")}
                        >
                          1W
                        </Button>
                        <Button 
                          variant={selectedTimeframe === "1M" ? "default" : "outline"} 
                          size="sm" 
                          className="h-8 text-xs"
                          onClick={() => setSelectedTimeframe("1M")}
                        >
                          1M
                        </Button>
                      </div>
                      <Select defaultValue="line">
                        <SelectTrigger className="w-[110px] h-8 text-xs">
                          <SelectValue placeholder="Chart Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="line">
                            <div className="flex items-center">
                              <LineChartIcon className="h-3.5 w-3.5 mr-2" />
                              Line
                            </div>
                          </SelectItem>
                          <SelectItem value="candle">
                            <div className="flex items-center">
                              <CandlestickChart className="h-3.5 w-3.5 mr-2" />
                              Candlestick
                            </div>
                          </SelectItem>
                          <SelectItem value="bar">
                            <div className="flex items-center">
                              <BarChart2 className="h-3.5 w-3.5 mr-2" />
                              Bar
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <TradingChart 
                    title={selectedStock === "NIFTY" ? "NIFTY 50" : selectedStock} 
                    symbol={selectedStock}
                    height={370}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Market Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">NIFTY 50</p>
                        <p className="font-semibold">{marketOverview.nifty50.value.toLocaleString()}</p>
                        <p className={`text-xs ${marketOverview.nifty50.change > 0 ? "text-green-600" : "text-red-600"} flex items-center mt-1`}>
                          {marketOverview.nifty50.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {marketOverview.nifty50.change > 0 ? "+" : ""}{marketOverview.nifty50.change}% (1D)
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">SENSEX</p>
                        <p className="font-semibold">{marketOverview.sensex.value.toLocaleString()}</p>
                        <p className={`text-xs ${marketOverview.sensex.change > 0 ? "text-green-600" : "text-red-600"} flex items-center mt-1`}>
                          {marketOverview.sensex.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {marketOverview.sensex.change > 0 ? "+" : ""}{marketOverview.sensex.change}% (1D)
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">BANK NIFTY</p>
                        <p className="font-semibold">{marketOverview.bankNifty.value.toLocaleString()}</p>
                        <p className={`text-xs ${marketOverview.bankNifty.change > 0 ? "text-green-600" : "text-red-600"} flex items-center mt-1`}>
                          {marketOverview.bankNifty.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {marketOverview.bankNifty.change > 0 ? "+" : ""}{marketOverview.bankNifty.change}% (1D)
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">India VIX</p>
                        <p className="font-semibold">{marketOverview.volatilityIndex}</p>
                        <p className="text-xs text-gray-600 flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {marketOverview.volatilityIndex < 15 ? "Low Volatility" : marketOverview.volatilityIndex < 20 ? "Moderate" : "High Volatility"}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Top Gainers (1D)</h3>
                      <div className="space-y-2">
                        {[
                          { symbol: "HDFCBANK", name: "HDFC Bank", change: "+5.62%" },
                          { symbol: "SBIN", name: "State Bank of India", change: "+3.75%" },
                          { symbol: "TCS", name: "Tata Consultancy Services", change: "+2.87%" },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedStock(item.symbol)}>
                            <div className="flex items-center">
                              <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                                {item.symbol.slice(0, 2)}
                              </div>
                              <span className="font-medium text-sm">{item.name}</span>
                            </div>
                            <span className="text-sm text-green-600">{item.change}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Top Losers (1D)</h3>
                      <div className="space-y-2">
                        {[
                          { symbol: "HINDUNILVR", name: "Hindustan Unilever", change: "-1.56%" },
                          { symbol: "INFY", name: "Infosys", change: "-0.82%" },
                          { symbol: "LT", name: "Larsen & Toubro", change: "-0.67%" },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedStock(item.symbol)}>
                            <div className="flex items-center">
                              <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                                {item.symbol.slice(0, 2)}
                              </div>
                              <span className="font-medium text-sm">{item.name}</span>
                            </div>
                            <span className="text-sm text-red-600">{item.change}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Order Book</CardTitle>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Book className="h-3.5 w-3.5 mr-1.5" />
                      Depth View
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">Price (₹)</p>
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="text-xs text-gray-500">Total (₹)</p>
                      </div>
                      <div className="space-y-1">
                        {[
                          { price: 2850.42, amount: 120, total: 342050.40 },
                          { price: 2849.18, amount: 80, total: 227934.40 },
                          { price: 2848.50, amount: 210, total: 598185.00 },
                          { price: 2847.75, amount: 150, total: 427162.50 },
                          { price: 2846.29, amount: 60, total: 170777.40 },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div className="relative w-full h-5">
                              <div 
                                className="absolute top-0 right-0 bottom-0 bg-red-50" 
                                style={{ width: `${Math.min(100, item.amount / 5)}%` }}
                              ></div>
                              <div className="flex justify-between items-center relative z-10 h-full px-1">
                                <span className="text-xs text-red-600 font-medium">₹{item.price.toFixed(2)}</span>
                                <span className="text-xs">{item.amount}</span>
                                <span className="text-xs text-gray-500">₹{item.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-y border-gray-100">
                      <span className="text-base font-semibold">₹2,850.42</span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Last updated: 12:45:08
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="space-y-1">
                        {[
                          { price: 2845.42, amount: 50, total: 142271.00 },
                          { price: 2844.18, amount: 180, total: 511952.40 },
                          { price: 2843.50, amount: 120, total: 341220.00 },
                          { price: 2842.75, amount: 90, total: 255847.50 },
                          { price: 2841.29, amount: 220, total: 625083.80 },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div className="relative w-full h-5">
                              <div 
                                className="absolute top-0 left-0 bottom-0 bg-green-50" 
                                style={{ width: `${Math.min(100, item.amount / 5)}%` }}
                              ></div>
                              <div className="flex justify-between items-center relative z-10 h-full px-1">
                                <span className="text-xs text-green-600 font-medium">₹{item.price.toFixed(2)}</span>
                                <span className="text-xs">{item.amount}</span>
                                <span className="text-xs text-gray-500">₹{item.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="animate-fade-in animate-delay-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <CardTitle className="text-lg font-semibold">NSE Stocks</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search stocks..." 
                        className="pl-9 w-full sm:w-[200px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select 
                      defaultValue="market_cap" 
                      onValueChange={setSortBy}
                    >
                      <SelectTrigger className="w-[140px]">
                        <ChevronDown className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Sort By</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market_cap">Market Cap</SelectItem>
                        <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                        <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                        <SelectItem value="change">24h Change</SelectItem>
                        <SelectItem value="volume">24h Volume</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 font-medium text-gray-500">#</th>
                        <th className="text-left p-4 font-medium text-gray-500">Name</th>
                        <th className="text-right p-4 font-medium text-gray-500">Price</th>
                        <th className="text-right p-4 font-medium text-gray-500">24h Change</th>
                        <th className="text-right p-4 font-medium text-gray-500">Market Cap</th>
                        <th className="text-right p-4 font-medium text-gray-500">Volume (24h)</th>
                        <th className="text-right p-4 font-medium text-gray-500"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedMarketData.map((market, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedStock(market.symbol)}>
                          <td className="p-4 text-gray-500">{i + 1}</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                {market.symbol.slice(0, 2)}
                              </div>
                              <div>
                                <div className="font-medium">{market.name}</div>
                                <div className="text-xs text-gray-500">{market.symbol}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right font-medium">
                            ₹{market.price < 0.01 
                              ? market.price.toFixed(6) 
                              : market.price < 1 
                                ? market.price.toFixed(4) 
                                : market.price.toLocaleString(undefined, { maximumFractionDigits: 2 })
                            }
                          </td>
                          <td className={cn(
                            "p-4 text-right font-medium",
                            market.change >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            <div className="flex items-center justify-end">
                              {market.change >= 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                              ) : (
                                <TrendingDown className="h-4 w-4 mr-1" />
                              )}
                              {market.change >= 0 ? "+" : ""}{market.change.toFixed(2)}%
                            </div>
                          </td>
                          <td className="p-4 text-right">{market.marketCap}</td>
                          <td className="p-4 text-right">{market.volume}</td>
                          <td className="p-4 text-right">
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in animate-delay-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Top Trending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { symbol: "HDFCBANK", name: "HDFC Bank", price: 1593.75, change: 5.62, volume: "₹3.2B" },
                    { symbol: "SBIN", name: "State Bank of India", price: 613.84, change: 3.75, volume: "₹725.3M" },
                    { symbol: "TCS", name: "Tata Consultancy Services", price: 3750.18, change: 2.87, volume: "₹15.3B" },
                    { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 7078.45, change: 2.38, volume: "₹980.6M" },
                    { symbol: "RELIANCE", name: "Reliance Industries", price: 2850.42, change: 1.24, volume: "₹24.8B" },
                  ].map((item, i) => (
                    <MarketTrend
                      key={i}
                      symbol={item.symbol}
                      name={item.name}
                      price={item.price}
                      change={item.change}
                      volume={item.volume}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Market News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Reserve Bank of India Announces New Policy Changes - Impact on Banking Sector",
                      time: "2 hours ago",
                      source: "Economic Times",
                      category: "Banking"
                    },
                    {
                      title: "Reliance Industries to Invest ₹75,000 Crore in Green Energy",
                      time: "5 hours ago",
                      source: "Business Standard",
                      category: "Energy"
                    },
                    {
                      title: "Tata Consultancy Services Secures Major Contract with European Financial Group",
                      time: "8 hours ago",
                      source: "Financial Express",
                      category: "IT"
                    },
                    {
                      title: "SEBI Introduces New Regulations for Market Participants",
                      time: "12 hours ago",
                      source: "Mint",
                      category: "Regulation"
                    },
                    {
                      title: "Market Analysis: Why Banking Stocks are Outperforming the Broader Market",
                      time: "1 day ago",
                      source: "LiveMint",
                      category: "Market"
                    },
                  ].map((item, i) => (
                    <div key={i} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <h3 className="font-medium mb-1 hover:text-primary cursor-pointer">{item.title}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{item.time}</span>
                        <span className="mx-2">•</span>
                        <span>{item.source}</span>
                        <div className="ml-auto px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                          {item.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-fade-in animate-delay-4">
            <Card className="shadow-sm bg-primary/5 border-none">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">New to NSE Stock Trading?</h3>
                    <p className="text-gray-600 mt-1">
                      Learn the fundamentals of market analysis, chart patterns, and trading strategies 
                      with our comprehensive guides and tutorials for Indian markets.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button className="bg-primary hover:bg-primary/90">
                      Trading Academy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Market;
