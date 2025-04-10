
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LogOut,
  User,
  X,
  Menu,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ZerodhaLogo } from "./ZerodhaLogo";
import { NavItems } from "./NavItems";
import { toast } from "@/hooks/use-toast";

interface NavbarMobileProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavbarMobile = ({ mobileMenuOpen, setMobileMenuOpen }: NavbarMobileProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, linkZerodha } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    });
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleLinkZerodha = () => {
    linkZerodha();
    toast({
      title: "Redirecting to Zerodha",
      description: "You'll be redirected to link your Zerodha account.",
    });
  };
  
  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 transition-all duration-300 transform pt-20",
          {
            "translate-x-0 opacity-100": mobileMenuOpen,
            "translate-x-full opacity-0 pointer-events-none": !mobileMenuOpen,
          }
        )}
      >
        <div className="flex flex-col p-6 space-y-4">
          <NavItems orientation="vertical" />
          
          <div className="pt-4 mt-4 border-t border-gray-100">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 text-sm font-medium text-gray-500">
                  Signed in as <span className="font-semibold text-gray-700">{user?.email}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left mt-2 bg-gray-50"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left mt-2 bg-gray-50"
                  onClick={handleLinkZerodha}
                >
                  <ZerodhaLogo />
                  Link Zerodha
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start text-left mt-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl shadow-sm"
                onClick={() => {
                  navigate('/sign-in');
                  setMobileMenuOpen(false);
                }}
              >
                Sign In
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarMobile;
