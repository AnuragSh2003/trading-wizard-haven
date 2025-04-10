
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "subtle" | "accent";
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  className,
  children,
  variant = "default",
}) => {
  const gradients = {
    default: "from-blue-500 via-indigo-500 to-blue-500",
    subtle: "from-blue-100 via-indigo-100 to-blue-100",
    accent: "from-blue-400 via-indigo-600 to-blue-500",
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r animate-gradient-x bg-[length:200%_100%]",
          gradients[variant]
        )}
        style={{ backgroundSize: "200% 100%" }}
      />
      {children}
    </div>
  );
};

export default AnimatedGradient;
