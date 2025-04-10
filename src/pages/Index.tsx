
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart2, Zap, Shield, LineChart, Bot } from "lucide-react";
import AnimatedGradient from "@/components/ui/AnimatedGradient";
import TradingChart from "@/components/ui/TradingChart";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 md:px-12 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 rounded-full text-xs font-medium text-blue-600 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                Trading algorithms made simple
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900">
                Algorithmic Trading <br />
                <span className="text-primary">Simplified</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-md">
                Design, backtest, and deploy professional grade trading 
                algorithms without writing a single line of code.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
              
              <div className="relative animate-float z-10">
                <div className="glass-card rounded-2xl overflow-hidden shadow-xl backdrop-blur-lg animate-fade-in">
                  <TradingChart height={320} variant="glass" />
                </div>
                <div className="absolute -bottom-5 -right-5 glass-card rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm animate-fade-in animate-delay-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium">Algorithm Running</span>
                  </div>
                </div>
                <div className="absolute -top-5 -left-5 glass-card rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm animate-fade-in animate-delay-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Smart Trading</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Advanced Features, Simple Interface
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to create professional-grade algorithmic trading strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart2 className="h-6 w-6 text-primary" />,
                title: "Real-Time Analytics",
                description: "Track your algorithm's performance with powerful real-time analytics and visualizations."
              },
              {
                icon: <LineChart className="h-6 w-6 text-primary" />,
                title: "Backtesting Engine",
                description: "Test your trading strategies against historical data to validate performance."
              },
              {
                icon: <Zap className="h-6 w-6 text-primary" />,
                title: "One-Click Deployment",
                description: "Deploy your trading algorithms to live markets with just a single click."
              },
              {
                icon: <Shield className="h-6 w-6 text-primary" />,
                title: "Risk Management",
                description: "Built-in risk management tools to protect your capital and limit downside."
              },
              {
                icon: <Bot className="h-6 w-6 text-primary" />,
                title: "AI-Powered Insights",
                description: "Get intelligent suggestions to improve your trading strategies."
              },
              {
                icon: <ArrowRight className="h-6 w-6 text-primary" />,
                title: "Multi-Market Support",
                description: "Trade across different markets and asset classes from a single platform."
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-all border-gray-100 overflow-hidden">
                <CardContent className="p-6 flex flex-col items-start">
                  <div className="rounded-lg bg-primary/10 p-3 mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <AnimatedGradient className="rounded-2xl overflow-hidden">
            <div className="bg-gradient-glass backdrop-blur-sm px-8 py-16 md:p-16 lg:p-20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-white/30 backdrop-blur-[2px]"></div>
              <div className="relative z-10">
                <div className="max-w-lg">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Ready to transform your trading strategy?
                  </h2>
                  <p className="text-white/90 text-lg mb-8">
                    Join thousands of traders who are already using our platform to build and deploy algorithmic trading strategies.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg" 
                      className="bg-white text-primary hover:bg-white/90 shadow-md"
                    >
                      Start Trading Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Link to="/dashboard">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-white text-white hover:bg-white/10"
                      >
                        View Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedGradient>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
