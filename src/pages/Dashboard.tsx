
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, ArrowUpRight, ArrowDownRight, DollarSign, BarChart, Timer, Zap, Link as LinkIcon } from "lucide-react";
import AlgorithmCard from "@/components/ui/AlgorithmCard";
import StatCard from "@/components/ui/StatCard";
import TradingChart from "@/components/ui/TradingChart";
import { useAuth } from "@/contexts/AuthContext";
import { useZerodhaData } from "@/hooks/use-zerodha-data";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, linkZerodha } = useAuth();
  const { data: zerodhaData, isLoading: isZerodhaLoading, error: zerodhaError } = useZerodhaData();

  const handleLinkZerodha = async () => {
    try {
      await linkZerodha();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to connect to Zerodha",
        variant: "destructive",
      });
    }
  };
  // Sample data for algorithms
  const algorithms = [
    {
      name: "Momentum Scanner",
      description: "Identifies momentum breakouts using volume and price action analysis",
      status: "active" as const,
      performance: 12.85,
      timeRunning: "3d 14h",
      trades: 28
    },
    {
      name: "Volatility Arbitrage",
      description: "Exploits price differentials during high volatility periods",
      status: "paused" as const,
      performance: -2.32,
      timeRunning: "2d 8h",
      trades: 17
    },
    {
      name: "Mean Reversion Strategy",
      description: "Capitalizes on price reversions to statistical means",
      status: "active" as const,
      performance: 8.14,
      timeRunning: "5d 6h",
      trades: 42
    },
    {
      name: "Trend Following Bot",
      description: "Rides established market trends using EMAs and volume confirmation",
      status: "error" as const,
      performance: 0.58,
      timeRunning: "1d 3h",
      trades: 9
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-24 md:px-6">
        <div className="grid grid-cols-1 gap-8">
          {/* Header and Stats */}
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Monitor and manage your trading algorithms</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="shadow-sm"
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  New Algorithm
                </Button>
              </div>
            </div>
          
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in animate-delay-1">
              {!user?.isZerodhaLinked ? (
                <div className="md:col-span-3 p-6 bg-white rounded-lg border shadow-sm text-center">
                  <LinkIcon className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Connect Your Zerodha Account</h3>
                  <p className="text-muted-foreground mb-4">
                    Link your Zerodha account to view your portfolio and trading data
                  </p>
                  <Button onClick={handleLinkZerodha} className="bg-primary hover:bg-primary/90 text-white">
                    Connect Zerodha
                  </Button>
                </div>
              ) : (
                <>
                  <StatCard 
                    title="Total Portfolio Value"
                    value={isZerodhaLoading ? "Loading..." : 
                           zerodhaError ? "Error" :
                           `₹${(zerodhaData?.portfolioValue || 0).toLocaleString()}`}
                    description="Across all holdings"
                    icon={DollarSign}
                    trend={zerodhaData?.portfolioValue > 0 ? "up" : "down"}
                    trendValue={zerodhaError ? zerodhaError : "Updated just now"}
                  />
                  <StatCard 
                    title="Today's P&L"
                    value={isZerodhaLoading ? "Loading..." :
                           zerodhaError ? "Error" :
                           `₹${(zerodhaData?.todaysPnL || 0).toLocaleString()}`}
                    icon={zerodhaData?.todaysPnL >= 0 ? ArrowUpRight : ArrowDownRight}
                    trend={zerodhaData?.todaysPnL >= 0 ? "up" : "down"}
                    trendValue={zerodhaError ? zerodhaError : 
                              `${((zerodhaData?.todaysPnL || 0) / (zerodhaData?.portfolioValue || 1) * 100).toFixed(2)}% today`}
                  />
                  <StatCard 
                    title="Active Positions"
                    value={isZerodhaLoading ? "Loading..." :
                           zerodhaError ? "Error" :
                           String(zerodhaData?.positions.length || 0)}
                    description={`${zerodhaData?.holdings.length || 0} holdings total`}
                    icon={Timer}
                    trend="neutral"
                    trendValue={zerodhaError ? zerodhaError : "Real-time data"}
                  />
                </>
              )}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trading Charts */}
            <div className="lg:col-span-2 space-y-6 animate-fade-in animate-delay-2">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="daily" className="px-6">
                    <TabsList className="mb-2">
                      <TabsTrigger value="daily">Daily</TabsTrigger>
                      <TabsTrigger value="weekly">Weekly</TabsTrigger>
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                    <TabsContent value="daily" className="pt-2">
                      <TradingChart
                        title="Portfolio Performance"
                        symbol="Combined"
                        height={300}
                      />
                    </TabsContent>
                    <TabsContent value="weekly">
                      <TradingChart
                        title="Portfolio Performance"
                        symbol="Combined"
                        height={300}
                      />
                    </TabsContent>
                    <TabsContent value="monthly">
                      <TradingChart
                        title="Portfolio Performance"
                        symbol="Combined"
                        height={300}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Recent Trades</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {[
                        { symbol: "BTC/USDT", side: "BUY", amount: "0.12", price: "$28,493.21", time: "2 min ago" },
                        { symbol: "ETH/USDT", side: "SELL", amount: "1.5", price: "$1,724.38", time: "15 min ago" },
                        { symbol: "SOL/USDT", side: "BUY", amount: "12", price: "$94.23", time: "42 min ago" },
                        { symbol: "BTC/USDT", side: "SELL", amount: "0.08", price: "$28,532.17", time: "1 hour ago" },
                      ].map((trade, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                          <div>
                            <div className="flex items-center">
                              <div className="font-medium">{trade.symbol}</div>
                              <div 
                                className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                                  trade.side === "BUY" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {trade.side}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">{trade.time}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{trade.price}</div>
                            <div className="text-xs text-gray-500">{trade.amount} units</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">Position Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {[
                        { symbol: "BTC/USDT", amount: "0.45", value: "$12,894.21", pnl: "+5.8%" },
                        { symbol: "ETH/USDT", amount: "8.2", value: "$14,293.38", pnl: "+2.3%" },
                        { symbol: "SOL/USDT", amount: "124", value: "$11,684.52", pnl: "-1.2%" },
                        { symbol: "LINK/USDT", amount: "320", value: "$4,128.00", pnl: "+3.6%" },
                      ].map((position, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                          <div>
                            <div className="font-medium">{position.symbol}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{position.amount} units</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{position.value}</div>
                            <div className={`text-xs ${
                              position.pnl.startsWith("+") ? "text-green-600" : "text-red-600"
                            }`}>
                              {position.pnl}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Algorithms */}
            <div className="space-y-6 animate-fade-in animate-delay-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Algorithms</h2>
                <Button variant="ghost" size="sm" className="text-primary -mr-2">
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {algorithms.map((algo, index) => (
                  <AlgorithmCard 
                    key={index}
                    name={algo.name}
                    description={algo.description}
                    status={algo.status}
                    performance={algo.performance}
                    timeRunning={algo.timeRunning}
                    trades={algo.trades}
                  />
                ))}
              </div>
              
              <Card className="shadow-sm border-dashed border-gray-300 bg-transparent hover:bg-gray-50 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6 h-[200px]">
                  <Button variant="ghost" className="text-primary h-14 w-14 rounded-full mb-4">
                    <Zap className="h-6 w-6" />
                  </Button>
                  <h3 className="font-medium mb-1">Create New Algorithm</h3>
                  <p className="text-sm text-gray-500 text-center mb-4">
                    Start building your next trading strategy
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-primary/50 text-primary hover:bg-primary/5"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
