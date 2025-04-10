
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  LineChart, 
  TimerReset, 
  BarChart3,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemsProps {
  orientation?: "horizontal" | "vertical";
}

export const NavItems = ({ orientation = "horizontal" }: NavItemsProps) => {
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { path: "/strategies", label: "Strategies", icon: <LineChart className="h-4 w-4 mr-2" /> },
    { path: "/backtest", label: "Backtesting", icon: <TimerReset className="h-4 w-4 mr-2" /> },
    { path: "/market", label: "Market Data", icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { path: "/screener", label: "Screener", icon: <Search className="h-4 w-4 mr-2" /> },
  ];

  return (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            orientation === "horizontal" 
              ? "px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-300"
              : "px-4 py-3 rounded-xl text-base font-medium flex items-center",
            {
              "text-primary bg-primary/5": isActive,
              "text-gray-600 hover:text-primary hover:bg-gray-50": !isActive && orientation === "horizontal",
              "text-gray-600": !isActive && orientation === "vertical",
            }
          )}
        >
          {item.icon}
          <span className={orientation === "vertical" ? "ml-2" : ""}>{item.label}</span>
        </NavLink>
      ))}
    </>
  );
};
