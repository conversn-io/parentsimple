import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "outline";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  children: ReactNode;
  href?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  asChild = false,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
    primary: "bg-[#9DB89D] text-[#1A2B49] hover:bg-[#8BA68B] focus:ring-[#9DB89D] active:scale-[0.98]",
    secondary: "bg-[#1A2B49] text-white hover:bg-[#152238] focus:ring-[#1A2B49] active:scale-[0.98]",
    tertiary: "bg-transparent text-[#1A2B49] hover:text-[#152238] hover:underline decoration-[#9DB89D] decoration-2 underline-offset-4",
    outline: "bg-transparent border-2 border-[#9DB89D] text-[#9DB89D] hover:bg-[#9DB89D] hover:text-[#1A2B49] focus:ring-[#9DB89D] active:scale-[0.98]",
    };
    
    const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    };
    
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );
    
  if (href) {
    // Use regular anchor tag for external URLs to preserve query parameters
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    // Use Next.js Link for internal routes
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
);
}
