
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import {
  Play,
  Settings,
  BarChart as BarChartIcon,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertCircle,
  ChevronDown,
  BarChart2,
  Download,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

// Generate backtesting results data
const generateBacktestData = () => {
  const data = [];
  let equity = 10000;
  
  for (let i = 0; i < 100; i++) {
    const date = new Date(2023, 0, i + 1);
    const change = (Math.random() - 0.45) * 200;
    equity += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      equity: Math.max(8000, Math.round(equity)),
      benchmark: Math.round(10000 + (i * 15) + (Math.random() - 0.5) * 1000),
    });
  }
  
  return data;
};

const tradeData = [
  { id: 1, asset: "BTC/USDT", type: "Long", entry: 27540, exit: 28690, profit: 4.18, date: "2023-01-05" },
  { id: 2, asset: "ETH/USDT", type: "Long", entry: 1620, exit: 1750, profit: 8.02, date: "2023-01-12" },
  { id: 3, asset: "BTC/USDT", type: "Short", entry: 29120, exit: 28350, profit: 2.64, date: "2023-01-18" },
  { id: 4, asset: "SOL/USDT", type: "Long", entry: 84.5, exit: 92.3, profit: 9.23, date: "2023-01-25" },
  { id: 5, asset: "BTC/USDT", type: "Long", entry: 27950, exit: 27210, profit: -2.65, date: "2023-02-01" },
  { id: 6, asset: "ETH/USDT", type: "Short", entry: 1780, exit: 1650, profit: 7.30, date: "2023-02-08" },
  { id: 7, asset: "BTC/USDT", type: "Long", entry: 28100, exit: 29400, profit: 4.63, date: "2023-02-15" },
  { id: 8, asset: "LTC/USDT", type: "Short", entry: 96.2, exit: 92.8, profit: 3.53, date: "2023-02-22" },
];

const monthlyReturns = [
  { name: "Jan", strategy: 6.2, benchmark: 2.3 },
  { name: "Feb", strategy: 4.8, benchmark: 1.8 },
  { name: "Mar", strategy: -2.1, benchmark: -1.2 },
  { name: "Apr", strategy: 3.7, benchmark: 2.9 },
  { name: "May", strategy: 5.2, benchmark: 1.5 },
  { name: "Jun", strategy: -1.3, benchmark: -0.8 },
  { name: "Jul", strategy: 7.1, benchmark: 3.2 },
  { name: "Aug", strategy: 2.5, benchmark: 1.9 },
  { name: "Sep", strategy: -0.9, benchmark: -1.1 },
  { name: "Oct", strategy: 4.3, benchmark: 2.7 },
  { name: "Nov", strategy: 5.9, benchmark: 2.1 },
  { name: "Dec", strategy: 3.8, benchmark: 1.4 },
];

const Backtest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backTestData, setBackTestData] = useState(generateBacktestData());
  const [selectedStrategy, setSelectedStrategy] = useState("golden_cross");
  const [initialCapital, setInitialCapital] = useState(10000);
  const [timeframe, setTimeframe] = useState("1d");
  const [leverage, setLeverage] = useState(1);
  const [slippage, setSlippage] = useState(0.05);
  const [useFees, setUseFees] = useState(true);
  const [feeRate, setFeeRate] = useState(0.1);
  const [showResult, setShowResult] = useState(false);
  
  const handleRunBacktest = () => {
    setIsRunning(true);
    setProgress(0);
    setShowResult(false);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setShowResult(true);
          // Generate new backtest data when complete
          setBackTestData(generateBacktestData());
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-24 md:px-6">
        <div className="grid grid-cols-1 gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Backtesting</h1>
              <p className="text-muted-foreground mt-1">Test your strategies against historical market data</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Backtest Configuration */}
            <div className="animate-fade-in animate-delay-1">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">Strategy Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="strategy">Select Strategy</Label>
                    <Select 
                      value={selectedStrategy} 
                      onValueChange={setSelectedStrategy}
                      disabled={isRunning}
                    >
                      <SelectTrigger id="strategy">
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="golden_cross">Golden Cross</SelectItem>
                        <SelectItem value="rsi_reversal">RSI Reversal</SelectItem>
                        <SelectItem value="macd_momentum">MACD Momentum</SelectItem>
                        <SelectItem value="bollinger_breakout">Bollinger Breakout</SelectItem>
                        <SelectItem value="support_resistance">Support/Resistance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="market">Market</Label>
                    <Select defaultValue="btc_usdt" disabled={isRunning}>
                      <SelectTrigger id="market">
                        <SelectValue placeholder="Select market" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btc_usdt">BTC/USDT</SelectItem>
                        <SelectItem value="eth_usdt">ETH/USDT</SelectItem>
                        <SelectItem value="sol_usdt">SOL/USDT</SelectItem>
                        <SelectItem value="bnb_usdt">BNB/USDT</SelectItem>
                        <SelectItem value="xrp_usdt">XRP/USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="timeframe">Timeframe</Label>
                      <Select 
                        value={timeframe} 
                        onValueChange={setTimeframe}
                        disabled={isRunning}
                      >
                        <SelectTrigger id="timeframe">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5m">5 Minutes</SelectItem>
                          <SelectItem value="15m">15 Minutes</SelectItem>
                          <SelectItem value="1h">1 Hour</SelectItem>
                          <SelectItem value="4h">4 Hours</SelectItem>
                          <SelectItem value="1d">1 Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="period">Test Period</Label>
                      <Select defaultValue="1y" disabled={isRunning}>
                        <SelectTrigger id="period">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1m">1 Month</SelectItem>
                          <SelectItem value="3m">3 Months</SelectItem>
                          <SelectItem value="6m">6 Months</SelectItem>
                          <SelectItem value="1y">1 Year</SelectItem>
                          <SelectItem value="3y">3 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="initial-capital">Initial Capital</Label>
                    <div className="flex space-x-3 items-center">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <Input
                        type="number"
                        id="initial-capital"
                        value={initialCapital}
                        onChange={(e) => setInitialCapital(Number(e.target.value))}
                        className="flex-1"
                        disabled={isRunning}
                      />
                      <Select defaultValue="usdt" disabled={isRunning}>
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="USDT" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usdt">USDT</SelectItem>
                          <SelectItem value="usdc">USDC</SelectItem>
                          <SelectItem value="usd">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium mb-4">Advanced Settings</h3>
                    
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label htmlFor="leverage">Leverage (x{leverage})</Label>
                          <span className="text-xs text-gray-500">1x - 10x</span>
                        </div>
                        <Slider
                          id="leverage"
                          defaultValue={[leverage]}
                          max={10}
                          min={1}
                          step={1}
                          onValueChange={(value) => setLeverage(value[0])}
                          disabled={isRunning}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <Label htmlFor="slippage">Slippage ({slippage}%)</Label>
                          <span className="text-xs text-gray-500">0% - 1%</span>
                        </div>
                        <Slider
                          id="slippage"
                          defaultValue={[slippage]}
                          max={1}
                          min={0}
                          step={0.01}
                          onValueChange={(value) => setSlippage(value[0])}
                          disabled={isRunning}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <Label htmlFor="fees" className="mb-1.5">Include Fees</Label>
                          <span className="text-xs text-gray-500">
                            {useFees ? `${feeRate}% per trade` : "No fees applied"}
                          </span>
                        </div>
                        <Switch
                          id="fees"
                          checked={useFees}
                          onCheckedChange={setUseFees}
                          disabled={isRunning}
                        />
                      </div>
                      
                      {useFees && (
                        <div className="space-y-3">
                          <Label htmlFor="fee-rate">Fee Rate ({feeRate}%)</Label>
                          <Slider
                            id="fee-rate"
                            defaultValue={[feeRate]}
                            max={1}
                            min={0}
                            step={0.01}
                            onValueChange={(value) => setFeeRate(value[0])}
                            disabled={isRunning}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleRunBacktest}
                    disabled={isRunning}
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Running Backtest...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Backtest
                      </>
                    )}
                  </Button>
                  
                  {isRunning && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Processing...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6 animate-fade-in animate-delay-2">
              {!showResult && !isRunning ? (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center text-center h-[400px]">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <BarChart2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Run a Backtest</h3>
                  <p className="text-gray-500 max-w-md">
                    Configure your strategy parameters and run a backtest to see performance metrics and results.
                  </p>
                  <Button
                    className="mt-6 bg-primary hover:bg-primary/90"
                    onClick={handleRunBacktest}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Backtest
                  </Button>
                </div>
              ) : (
                <>
                  {isRunning ? (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 flex flex-col items-center justify-center text-center h-[400px]">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <RefreshCw className="h-10 w-10 text-primary animate-spin" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Running Backtest...</h3>
                      <p className="text-gray-500 mb-6">
                        Processing historical data and simulating strategy execution.
                      </p>
                      <Progress value={progress} className="w-full max-w-md h-2" />
                      <p className="text-sm text-gray-500 mt-3">{progress}% Complete</p>
                    </div>
                  ) : (
                    <Tabs defaultValue="performance" className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <TabsList>
                          <TabsTrigger value="performance">Performance</TabsTrigger>
                          <TabsTrigger value="trades">Trades</TabsTrigger>
                          <TabsTrigger value="metrics">Metrics</TabsTrigger>
                          <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1.5" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleRunBacktest}>
                            <RefreshCw className="h-4 w-4 mr-1.5" />
                            Rerun
                          </Button>
                        </div>
                      </div>
                      
                      <TabsContent value="performance" className="space-y-6">
                        <Card className="shadow-sm">
                          <CardHeader className="pb-0">
                            <CardTitle className="text-lg font-semibold">Equity Curve</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4 h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={backTestData}
                                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                              >
                                <defs>
                                  <linearGradient id="colorStrategy" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                                  </linearGradient>
                                  <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                  dataKey="date" 
                                  tick={{ fontSize: 10 }}
                                  tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return `${date.getMonth() + 1}/${date.getDate()}`;
                                  }}
                                />
                                <YAxis 
                                  tick={{ fontSize: 10 }}
                                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                                />
                                <Tooltip 
                                  formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                                  labelFormatter={(label) => {
                                    const date = new Date(label);
                                    return date.toLocaleDateString();
                                  }}
                                />
                                <Legend />
                                <Area 
                                  type="monotone" 
                                  dataKey="equity" 
                                  name="Strategy" 
                                  stroke="#0EA5E9" 
                                  strokeWidth={2}
                                  fillOpacity={1} 
                                  fill="url(#colorStrategy)" 
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="benchmark" 
                                  name="Benchmark" 
                                  stroke="#9CA3AF" 
                                  strokeWidth={1.5}
                                  fillOpacity={1} 
                                  fill="url(#colorBenchmark)" 
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="shadow-sm">
                            <CardHeader className="pb-0">
                              <CardTitle className="text-sm font-medium">Total Return</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                              <div className="flex items-end">
                                <p className="text-2xl font-bold text-green-600">+36.42%</p>
                                <p className="text-sm text-gray-500 ml-2 mb-1">(+$3,642)</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                <span>+12.8% vs Benchmark</span>
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card className="shadow-sm">
                            <CardHeader className="pb-0">
                              <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                              <div className="flex items-end">
                                <p className="text-2xl font-bold text-red-600">-12.57%</p>
                                <p className="text-sm text-gray-500 ml-2 mb-1">(-$1,257)</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                                <span>Jan 15 - Jan 28, 2023</span>
                              </p>
                            </CardContent>
                          </Card>
                          
                          <Card className="shadow-sm">
                            <CardHeader className="pb-0">
                              <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                              <div className="flex items-end">
                                <p className="text-2xl font-bold">1.87</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                <span>Good risk-adjusted return</span>
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <Card className="shadow-sm">
                          <CardHeader className="pb-0">
                            <CardTitle className="text-lg font-semibold">Monthly Returns (%)</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4 h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={monthlyReturns}
                                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis 
                                  tick={{ fontSize: 10 }}
                                  tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip 
                                  formatter={(value) => [`${value}%`, ""]}
                                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                                />
                                <Legend />
                                <Bar dataKey="strategy" name="Strategy" fill="#0EA5E9" barSize={12} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="benchmark" name="Benchmark" fill="#9CA3AF" barSize={12} radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="trades" className="space-y-6">
                        <Card className="shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold">Trade Details</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left font-medium text-gray-500 py-3 px-4">#</th>
                                    <th className="text-left font-medium text-gray-500 py-3 px-4">Date</th>
                                    <th className="text-left font-medium text-gray-500 py-3 px-4">Asset</th>
                                    <th className="text-left font-medium text-gray-500 py-3 px-4">Type</th>
                                    <th className="text-left font-medium text-gray-500 py-3 px-4">Entry</th>
                                    <th className="text-left font-medium text-gray-500 py-3 px-4">Exit</th>
                                    <th className="text-right font-medium text-gray-500 py-3 px-4">Profit/Loss</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {tradeData.map((trade) => (
                                    <tr key={trade.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                      <td className="py-3 px-4">{trade.id}</td>
                                      <td className="py-3 px-4">{trade.date}</td>
                                      <td className="py-3 px-4">{trade.asset}</td>
                                      <td className="py-3 px-4">
                                        <span className={cn(
                                          "px-2 py-1 rounded-full text-xs font-medium",
                                          trade.type === "Long" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        )}>
                                          {trade.type}
                                        </span>
                                      </td>
                                      <td className="py-3 px-4">${trade.entry.toLocaleString()}</td>
                                      <td className="py-3 px-4">${trade.exit.toLocaleString()}</td>
                                      <td className={cn(
                                        "py-3 px-4 text-right font-medium",
                                        trade.profit >= 0 ? "text-green-600" : "text-red-600"
                                      )}>
                                        {trade.profit >= 0 ? "+" : ""}{trade.profit}%
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card className="shadow-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg font-semibold">Trade Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <dl className="grid grid-cols-1 gap-4">
                                {[
                                  { label: "Total Trades", value: "32" },
                                  { label: "Win Rate", value: "68.75%" },
                                  { label: "Profit Factor", value: "2.14" },
                                  { label: "Average Win", value: "+4.83%" },
                                  { label: "Average Loss", value: "-2.15%" },
                                  { label: "Largest Win", value: "+9.23%" },
                                  { label: "Largest Loss", value: "-4.31%" },
                                  { label: "Average Hold Time", value: "4.3 days" },
                                ].map((item, i) => (
                                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                    <dt className="text-gray-600">{item.label}</dt>
                                    <dd className="font-medium">{item.value}</dd>
                                  </div>
                                ))}
                              </dl>
                            </CardContent>
                          </Card>
                          
                          <Card className="shadow-sm">
                            <CardHeader className="pb-0">
                              <CardTitle className="text-lg font-semibold">Win/Loss Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 h-[260px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={[
                                    { range: "<-4%", count: 1 },
                                    { range: "-4% to -2%", count: 3 },
                                    { range: "-2% to 0%", count: 6 },
                                    { range: "0% to 2%", count: 7 },
                                    { range: "2% to 4%", count: 8 },
                                    { range: "4% to 6%", count: 4 },
                                    { range: "6% to 8%", count: 2 },
                                    { range: ">8%", count: 1 },
                                  ]}
                                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                  <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                                  <YAxis tick={{ fontSize: 10 }} />
                                  <Tooltip />
                                  <Bar dataKey="count" name="Trades" fill="#0EA5E9" barSize={24} radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="metrics" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {[
                            { 
                              title: "Performance Metrics", 
                              items: [
                                { label: "Total Return", value: "+36.42%" },
                                { label: "Annualized Return", value: "+36.42%" },
                                { label: "Benchmark Comparison", value: "+12.8%" },
                                { label: "Alpha", value: "15.6%" },
                                { label: "Beta", value: "0.84" },
                                { label: "Sharpe Ratio", value: "1.87" },
                                { label: "Sortino Ratio", value: "2.14" },
                                { label: "Max Drawdown", value: "-12.57%" },
                                { label: "Recovery Factor", value: "2.9" },
                              ] 
                            },
                            { 
                              title: "Trade Metrics", 
                              items: [
                                { label: "Win Rate", value: "68.75%" },
                                { label: "Profit Factor", value: "2.14" },
                                { label: "Expectancy", value: "1.47%" },
                                { label: "Average Win", value: "+4.83%" },
                                { label: "Average Loss", value: "-2.15%" },
                                { label: "Win/Loss Ratio", value: "2.24" },
                                { label: "Total Trades", value: "32" },
                                { label: "Winning Trades", value: "22" },
                                { label: "Losing Trades", value: "10" },
                              ] 
                            },
                            { 
                              title: "Risk Metrics", 
                              items: [
                                { label: "Value at Risk (VaR)", value: "-3.12%" },
                                { label: "Conditional VaR", value: "-4.38%" },
                                { label: "Standard Deviation", value: "5.84%" },
                                { label: "Downside Deviation", value: "2.74%" },
                                { label: "Maximum Drawdown", value: "-12.57%" },
                                { label: "Drawdown Duration", value: "14 days" },
                                { label: "Ulcer Index", value: "4.12" },
                                { label: "Calmar Ratio", value: "2.89" },
                              ] 
                            },
                          ].map((card, i) => (
                            <Card key={i} className="shadow-sm">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <dl className="grid grid-cols-1 gap-3">
                                  {card.items.map((item, j) => (
                                    <div key={j} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0 text-sm">
                                      <dt className="text-gray-600">{item.label}</dt>
                                      <dd className="font-medium">{item.value}</dd>
                                    </div>
                                  ))}
                                </dl>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="settings" className="space-y-6">
                        <Card className="shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold">Backtest Settings</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <dl className="grid grid-cols-1 gap-3">
                                <div className="text-sm font-medium text-primary mb-1">Strategy Settings</div>
                                {[
                                  { label: "Strategy", value: "Golden Cross" },
                                  { label: "Market", value: "BTC/USDT" },
                                  { label: "Timeframe", value: "1 Day" },
                                  { label: "Test Period", value: "1 Year" },
                                  { label: "Initial Capital", value: "$10,000" },
                                  { label: "Date Range", value: "Jan 1, 2023 - Dec 31, 2023" },
                                ].map((item, i) => (
                                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0 text-sm">
                                    <dt className="text-gray-600">{item.label}</dt>
                                    <dd className="font-medium">{item.value}</dd>
                                  </div>
                                ))}
                              </dl>
                              
                              <dl className="grid grid-cols-1 gap-3">
                                <div className="text-sm font-medium text-primary mb-1">Execution Settings</div>
                                {[
                                  { label: "Leverage", value: `${leverage}x` },
                                  { label: "Slippage", value: `${slippage}%` },
                                  { label: "Trading Fees", value: useFees ? `${feeRate}% per trade` : "None" },
                                  { label: "Position Sizing", value: "100% of Capital" },
                                  { label: "Max Open Positions", value: "1" },
                                  { label: "Entry Delay", value: "Next Candle" },
                                ].map((item, i) => (
                                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0 text-sm">
                                    <dt className="text-gray-600">{item.label}</dt>
                                    <dd className="font-medium">{item.value}</dd>
                                  </div>
                                ))}
                              </dl>
                            </div>
                            
                            <div className="mt-8 flex gap-3 justify-end">
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-1.5" />
                                Edit Settings
                              </Button>
                              <Button size="sm" className="bg-primary hover:bg-primary/90">
                                <Play className="h-4 w-4 mr-1.5" />
                                Rerun with Current Settings
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="shadow-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold">Strategy Parameters</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="text-sm font-medium mb-3">Entry Conditions</h3>
                                <ul className="text-sm space-y-2">
                                  <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>EMA(50) crosses above EMA(200)</span>
                                  </li>
                                  <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>RSI(14) above 50</span>
                                  </li>
                                  <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>Volume above 20-day average</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-medium mb-3">Exit Conditions</h3>
                                <ul className="text-sm space-y-2">
                                  <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>EMA(50) crosses below EMA(200)</span>
                                  </li>
                                  <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>RSI(14) below 30</span>
                                  </li>
                                  <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>Take Profit: 20% gained</span>
                                  </li>
                                  <li className="flex gap-2">
                                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                    <span>Stop Loss: 8% lost</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Backtest;
