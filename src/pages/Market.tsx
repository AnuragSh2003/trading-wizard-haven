import React, { useState } from "react";
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

const marketData = [
  { symbol: "BTC", name: "Bitcoin", price: 28350.42, change: 1.24, volume: "$24.8B", marketCap: "$550.2B" },
  { symbol: "ETH", name: "Ethereum", price: 1750.18, change: 2.87, volume: "$15.3B", marketCap: "$210.5B" },
  { symbol: "SOL", name: "Solana", price: 93.75, change: 5.62, volume: "$3.2B", marketCap: "$38.9B" },
  { symbol: "BNB", name: "Binance Coin", price: 241.38, change: -0.82, volume: "$1.5B", marketCap: "$38.2B" },
  { symbol: "XRP", name: "Ripple", price: 0.62, change: 1.14, volume: "$1.8B", marketCap: "$32.8B" },
  { symbol: "ADA", name: "Cardano", price: 0.38, change: -1.56, volume: "$420.5M", marketCap: "$13.4B" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.078, change: 2.38, volume: "$980.6M", marketCap: "$10.9B" },
  { symbol: "LINK", name: "Chainlink", price: 13.84, change: 3.75, volume: "$725.3M", marketCap: "$7.4B" },
  { symbol: "AVAX", name: "Avalanche", price: 32.56, change: -0.67, volume: "$510.2M", marketCap: "$7.2B" },
  { symbol: "DOT", name: "Polkadot", price: 5.93, change: 0.42, volume: "$322.8M", marketCap: "$6.7B" },
];

const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [sortBy, setSortBy] = useState("market_cap");
  
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
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Market Data</h1>
              <p className="text-muted-foreground mt-1">Real-time market insights and price charts</p>
            </div>
          </div>
          
          {/* Market Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in animate-delay-1">
            <div className="lg:col-span-2">
              <Card className="shadow-sm overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">Bitcoin (BTC)</CardTitle>
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
                    title="BTC/USDT" 
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
                        <p className="text-xs text-gray-500 mb-1">BTC Dominance</p>
                        <p className="font-semibold">42.8%</p>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +0.8% (24h)
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Market Cap</p>
                        <p className="font-semibold">$1.28T</p>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +2.4% (24h)
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">24h Volume</p>
                        <p className="font-semibold">$82.5B</p>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +12.6% (24h)
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Fear & Greed</p>
                        <p className="font-semibold">72</p>
                        <p className="text-xs text-green-600 flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Greed
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Top Gainers (24h)</h3>
                      <div className="space-y-2">
                        {[
                          { symbol: "SOL", name: "Solana", change: "+5.62%" },
                          { symbol: "LINK", name: "Chainlink", change: "+3.75%" },
                          { symbol: "ETH", name: "Ethereum", change: "+2.87%" },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
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
                      <h3 className="text-sm font-medium mb-3">Top Losers (24h)</h3>
                      <div className="space-y-2">
                        {[
                          { symbol: "ADA", name: "Cardano", change: "-1.56%" },
                          { symbol: "BNB", name: "Binance Coin", change: "-0.82%" },
                          { symbol: "AVAX", name: "Avalanche", change: "-0.67%" },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50">
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
                        <p className="text-xs text-gray-500">Price (USDT)</p>
                        <p className="text-xs text-gray-500">Amount (BTC)</p>
                        <p className="text-xs text-gray-500">Total</p>
                      </div>
                      <div className="space-y-1">
                        {[
                          { price: 28450.42, amount: 1.2, total: 34140.50 },
                          { price: 28420.18, amount: 0.8, total: 22736.14 },
                          { price: 28410.50, amount: 2.1, total: 59662.05 },
                          { price: 28400.75, amount: 1.5, total: 42601.13 },
                          { price: 28385.29, amount: 0.6, total: 17031.17 },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div className="relative w-full h-5">
                              <div 
                                className="absolute top-0 right-0 bottom-0 bg-red-50" 
                                style={{ width: `${Math.min(100, item.amount * 20)}%` }}
                              ></div>
                              <div className="flex justify-between items-center relative z-10 h-full px-1">
                                <span className="text-xs text-red-600 font-medium">${item.price.toFixed(2)}</span>
                                <span className="text-xs">{item.amount.toFixed(2)}</span>
                                <span className="text-xs text-gray-500">${item.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-y border-gray-100">
                      <span className="text-base font-semibold">$28,350.42</span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Last updated: 12:45:08
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="space-y-1">
                        {[
                          { price: 28350.42, amount: 0.5, total: 14175.21 },
                          { price: 28325.18, amount: 1.8, total: 50985.32 },
                          { price: 28310.50, amount: 1.2, total: 33972.60 },
                          { price: 28300.75, amount: 0.9, total: 25470.68 },
                          { price: 28285.29, amount: 2.2, total: 62227.64 },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div className="relative w-full h-5">
                              <div 
                                className="absolute top-0 left-0 bottom-0 bg-green-50" 
                                style={{ width: `${Math.min(100, item.amount * 20)}%` }}
                              ></div>
                              <div className="flex justify-between items-center relative z-10 h-full px-1">
                                <span className="text-xs text-green-600 font-medium">${item.price.toFixed(2)}</span>
                                <span className="text-xs">{item.amount.toFixed(2)}</span>
                                <span className="text-xs text-gray-500">${item.total.toFixed(2)}</span>
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
                  <CardTitle className="text-lg font-semibold">Cryptocurrency Markets</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search markets..." 
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
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
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
                            ${market.price < 0.01 
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
                    { symbol: "SOL/USDT", name: "Solana", price: 93.75, change: 5.62, volume: "$3.2B" },
                    { symbol: "LINK/USDT", name: "Chainlink", price: 13.84, change: 3.75, volume: "$725.3M" },
                    { symbol: "ETH/USDT", name: "Ethereum", price: 1750.18, change: 2.87, volume: "$15.3B" },
                    { symbol: "DOGE/USDT", name: "Dogecoin", price: 0.078, change: 2.38, volume: "$980.6M" },
                    { symbol: "BTC/USDT", name: "Bitcoin", price: 28350.42, change: 1.24, volume: "$24.8B" },
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
                      title: "Bitcoin ETF Approval Expected Soon - What This Means for the Market",
                      time: "2 hours ago",
                      source: "CryptoNews",
                      category: "Bitcoin"
                    },
                    {
                      title: "Ethereum's Upcoming Hard Fork: Key Changes and Expected Impact",
                      time: "5 hours ago",
                      source: "BlockchainDaily",
                      category: "Ethereum"
                    },
                    {
                      title: "Solana Sets New Transaction Record as DeFi Activity Surges",
                      time: "8 hours ago",
                      source: "DeFiPulse",
                      category: "Solana"
                    },
                    {
                      title: "Regulatory Developments: New Framework for Crypto Trading Platforms",
                      time: "12 hours ago",
                      source: "CoinDesk",
                      category: "Regulation"
                    },
                    {
                      title: "Market Analysis: Why Altcoins Are Outperforming Bitcoin This Week",
                      time: "1 day ago",
                      source: "CryptoAnalysis",
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
                    <h3 className="text-lg font-medium">New to Cryptocurrency Trading?</h3>
                    <p className="text-gray-600 mt-1">
                      Learn the fundamentals of market analysis, chart patterns, and trading strategies 
                      with our comprehensive guides and tutorials.
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
