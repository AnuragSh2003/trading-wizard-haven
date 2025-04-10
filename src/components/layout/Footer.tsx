
import React from "react";
import { NavLink } from "react-router-dom";
import { Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 text-primary mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-primary rounded-md opacity-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary rounded-sm"></div>
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight font-manrope">TradeSquare</span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              Advanced algorithmic trading platform specialized for NSE India, designed to help traders create, 
              test, and deploy automated trading strategies with precision and ease.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <NavLink to="/dashboard" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/strategies" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Strategies
                </NavLink>
              </li>
              <li>
                <NavLink to="/backtest" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Backtesting
                </NavLink>
              </li>
              <li>
                <NavLink to="/market" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Market Data
                </NavLink>
              </li>
              <li>
                <NavLink to="/screener" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Screener
                </NavLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://www.nseindia.com/" target="_blank" rel="noopener" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  NSE India
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Market Insights
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  Trading Academy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary text-sm transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} TradeSquare. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
