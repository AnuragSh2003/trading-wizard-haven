
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Plus, 
  Filter,
  Settings,
  Copy,
  BarChart2,
  PlayCircle,
  ArrowRight,
  AlertTriangle,
  Clock,
  PencilLine,
  Trash2,
  Star,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

type StrategyType = "Trend Following" | "Mean Reversion" | "Momentum" | "Breakout" | "Scalping";
type StrategyStatus = "Live" | "Backtesting" | "Draft" | "Paused";

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: StrategyType;
  status: StrategyStatus;
  performance: number;
  risk: "Low" | "Medium" | "High";
  created: string;
  isFavorite: boolean;
}

const strategies: Strategy[] = [
  {
    id: "strat-1",
    name: "Golden Cross EMA",
    description: "Uses 50 and 200 EMA crossovers to identify long-term trend changes",
    type: "Trend Following",
    status: "Live",
    performance: 12.7,
    risk: "Medium",
    created: "2023-10-12",
    isFavorite: true
  },
  {
    id: "strat-2",
    name: "RSI Reversal Strategy",
    description: "Identifies overbought and oversold conditions with RSI indicator",
    type: "Mean Reversion",
    status: "Backtesting",
    performance: 8.5,
    risk: "Medium",
    created: "2023-11-05",
    isFavorite: false
  },
  {
    id: "strat-3",
    name: "MACD Momentum Scanner",
    description: "Detects momentum shifts using MACD indicator and volume confirmation",
    type: "Momentum",
    status: "Live",
    performance: 15.2,
    risk: "High",
    created: "2023-09-28",
    isFavorite: true
  },
  {
    id: "strat-4",
    name: "Bollinger Breakout",
    description: "Triggers on price breakouts beyond Bollinger Bands with volume confirmation",
    type: "Breakout",
    status: "Draft",
    performance: 0,
    risk: "High",
    created: "2023-12-01",
    isFavorite: false
  },
  {
    id: "strat-5",
    name: "Support/Resistance Scalper",
    description: "Quick trades at key support and resistance levels with tight stop losses",
    type: "Scalping",
    status: "Paused",
    performance: 5.8,
    risk: "Medium",
    created: "2023-08-15",
    isFavorite: false
  },
  {
    id: "strat-6",
    name: "Volume Profile Trader",
    description: "Uses volume profile to identify value areas and trade around them",
    type: "Mean Reversion",
    status: "Live",
    performance: 9.3,
    risk: "Low",
    created: "2023-10-20",
    isFavorite: true
  }
];

const strategyTemplates = [
  {
    name: "Trend Following Strategy",
    description: "Follow established market trends using moving averages and momentum indicators",
    complexity: "Beginner",
    performance: "Medium-Term",
    icon: <ArrowRight className="h-8 w-8 text-blue-500" />
  },
  {
    name: "Mean Reversion Strategy",
    description: "Capitalize on price returning to average values after extreme movements",
    complexity: "Intermediate",
    performance: "Short-Term",
    icon: <ArrowRight className="h-8 w-8 rotate-180 text-purple-500" />
  },
  {
    name: "Breakout Strategy",
    description: "Detect and trade significant price movements beyond established ranges",
    complexity: "Intermediate",
    performance: "Variable",
    icon: <ArrowRight className="h-8 w-8 rotate-45 text-green-500" />
  },
  {
    name: "Volatility Strategy",
    description: "Trade based on market volatility measures and expected price movements",
    complexity: "Advanced",
    performance: "Short-Term",
    icon: <BarChart2 className="h-8 w-8 text-orange-500" />
  },
];

const Strategies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("performance");
  
  const filteredStrategies = strategies.filter(strategy => {
    // Apply search filter
    if (searchTerm && !strategy.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter !== "all" && strategy.status !== statusFilter) {
      return false;
    }
    
    // Apply type filter
    if (typeFilter !== "all" && strategy.type !== typeFilter) {
      return false;
    }
    
    return true;
  });
  
  // Sort strategies
  const sortedStrategies = [...filteredStrategies].sort((a, b) => {
    if (sortBy === "performance") {
      return b.performance - a.performance;
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "date") {
      return new Date(b.created).getTime() - new Date(a.created).getTime();
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
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Trading Strategies</h1>
              <p className="text-muted-foreground mt-1">Create and manage your algorithmic trading strategies</p>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Strategy
            </Button>
          </div>
          
          {/* Strategy Tabs */}
          <Tabs defaultValue="my_strategies" className="animate-fade-in animate-delay-1">
            <TabsList className="mb-6">
              <TabsTrigger value="my_strategies">My Strategies</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
            
            {/* My Strategies Tab */}
            <TabsContent value="my_strategies">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search strategies..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Status</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Live">Live</SelectItem>
                      <SelectItem value="Backtesting">Backtesting</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Type</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Trend Following">Trend</SelectItem>
                      <SelectItem value="Mean Reversion">Mean Reversion</SelectItem>
                      <SelectItem value="Momentum">Momentum</SelectItem>
                      <SelectItem value="Breakout">Breakout</SelectItem>
                      <SelectItem value="Scalping">Scalping</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[130px]">
                      <ChevronDown className="h-4 w-4 mr-2 text-gray-400" />
                      <span>Sort By</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="date">Date Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Strategies List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedStrategies.map((strategy, i) => (
                  <Card key={strategy.id} className={cn(
                    "overflow-hidden hover:shadow-md transition-all duration-300 border-gray-200",
                    strategy.status === "Live" ? "border-l-4 border-l-green-500" : "",
                    strategy.status === "Paused" ? "border-l-4 border-l-amber-500" : "",
                    strategy.status === "Draft" ? "border-l-4 border-l-gray-400" : "",
                    strategy.status === "Backtesting" ? "border-l-4 border-l-blue-500" : ""
                  )}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <CardTitle className="text-base font-semibold">{strategy.name}</CardTitle>
                            {strategy.isFavorite && (
                              <Star className="h-4 w-4 ml-2 text-amber-400 fill-amber-400" />
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              {
                                "bg-green-100 text-green-800": strategy.status === "Live",
                                "bg-amber-100 text-amber-800": strategy.status === "Paused",
                                "bg-gray-100 text-gray-800": strategy.status === "Draft",
                                "bg-blue-100 text-blue-800": strategy.status === "Backtesting",
                              }
                            )}>
                              {strategy.status}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-800">
                              {strategy.type}
                            </span>
                          </div>
                        </div>
                        
                        <button className="text-gray-400 hover:text-gray-600">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{strategy.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-gray-500">Performance</div>
                          <div className={cn(
                            "font-medium",
                            {
                              "text-green-600": strategy.performance > 0,
                              "text-red-600": strategy.performance < 0,
                              "text-gray-600": strategy.performance === 0,
                            }
                          )}>
                            {strategy.performance > 0 ? "+" : ""}{strategy.performance}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Risk Level</div>
                          <div className={cn(
                            "font-medium",
                            {
                              "text-green-600": strategy.risk === "Low",
                              "text-amber-600": strategy.risk === "Medium",
                              "text-red-600": strategy.risk === "High",
                            }
                          )}>
                            {strategy.risk}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {strategy.status !== "Live" && (
                          <Button size="sm" variant="default" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                            <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
                            Deploy
                          </Button>
                        )}
                        {strategy.status === "Live" && (
                          <Button size="sm" variant="outline" className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50">
                            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                            Pause
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="w-9 px-0">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" className="w-9 px-0">
                          <BarChart2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" className="w-9 px-0">
                          <PencilLine className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Create New Strategy Card */}
                <Card className="overflow-hidden border-dashed border-gray-200 bg-white/50 hover:bg-white hover:shadow-sm transition-all">
                  <CardContent className="flex flex-col items-center justify-center h-full p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-base font-medium mb-1">Create New Strategy</h3>
                    <p className="text-sm text-gray-500 text-center mb-4">Start building a custom trading strategy</p>
                    <Button variant="outline" size="sm">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Templates Tab */}
            <TabsContent value="templates">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {strategyTemplates.map((template, i) => (
                  <Card key={i} className="overflow-hidden hover:shadow-md transition-all">
                    <CardContent className="p-0">
                      <div className="flex h-full">
                        <div className="w-20 h-auto flex items-center justify-center bg-gray-50 border-r border-gray-200 p-4">
                          {template.icon}
                        </div>
                        <div className="flex-1 p-6">
                          <h3 className="text-lg font-medium mb-1">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          <div className="flex gap-3 mb-4">
                            <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {template.complexity}
                            </div>
                            <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {template.performance}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Use Template
                            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Community Tab */}
            <TabsContent value="community">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium">Community Strategies Coming Soon</h3>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  Share and discover trading strategies from other traders.
                  This feature is currently in development.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Strategies;
