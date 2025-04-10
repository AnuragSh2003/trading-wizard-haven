
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  LineChart, 
  TimerReset, 
  BarChart3,
  ChevronRight,
  Search,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ZerodhaLogo } from "./ZerodhaLogo";
import { NavItems } from "./NavItems";
import { toast } from "@/hooks/use-toast";

const NavbarDesktop = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, linkZerodha } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    });
    navigate('/');
  };

  const handleLinkZerodha = () => {
    linkZerodha();
    toast({
      title: "Redirecting to Zerodha",
      description: "You'll be redirected to link your Zerodha account.",
    });
  };
  
  return (
    <div className="hidden md:flex items-center space-x-1">
      <NavItems />
      
      <div className="ml-4 pl-4 border-l border-gray-200">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 hover:bg-gray-50"
              >
                <User className="h-4 w-4 mr-2" />
                {user?.name?.split(' ')[0] || 'Account'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLinkZerodha}>
                <ZerodhaLogo />
                Link Zerodha
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm"
            onClick={() => navigate('/sign-in')}
          >
            Sign In
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavbarDesktop;
