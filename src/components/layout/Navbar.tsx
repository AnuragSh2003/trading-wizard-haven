
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavbar } from "@/hooks/use-navbar";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

const Navbar = () => {
  const { scrolled, mobileMenuOpen, setMobileMenuOpen, isHome } = useNavbar();
  const isMobile = useIsMobile();
  
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 transition-all duration-300",
        {
          "bg-white/80 backdrop-blur-md shadow-sm": scrolled || !isHome,
          "bg-transparent": !scrolled && isHome,
        }
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <NavLink to="/" className="flex items-center space-x-2 text-primary">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-primary rounded-md opacity-10 animate-pulse-soft"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-primary rounded-sm"></div>
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight font-manrope">TradeSquare</span>
        </NavLink>
        
        {/* Desktop Navigation */}
        <NavbarDesktop />
        
        {/* Mobile Navigation */}
        {isMobile && (
          <NavbarMobile 
            mobileMenuOpen={mobileMenuOpen} 
            setMobileMenuOpen={setMobileMenuOpen} 
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
