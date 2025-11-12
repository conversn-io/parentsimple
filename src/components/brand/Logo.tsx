import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "wordmark" | "shield" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
}

export function Logo({ variant = "wordmark", size = "md", className, href = "/" }: LogoProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
  };

  const shieldSizes = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const ShieldIcon = ({ size }: { size: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path
        d="M32 4C20 4 8 13 8 24c0 16.3 24 36 24 36s24-19.7 24-36C56 13 44 4 32 4z"
        fill="#1A2B49"
      />
      <text
        x="22"
        y="42"
        fontFamily="Playfair Display"
        fontSize="20"
        fill="#F9F6EF"
        fontWeight="700"
      >
        P
      </text>
    </svg>
  );

  if (variant === "shield") {
    return (
      <Link href={href} className={cn("inline-flex items-center", className)}>
        <ShieldIcon size={shieldSizes[size]} />
      </Link>
    );
  }

  if (variant === "wordmark") {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex items-center font-serif font-bold text-[#1A2B49] hover:text-[#152238] transition-colors",
          sizeClasses[size],
          className
        )}
      >
        ParentSimple
      </Link>
    );
  }

  // Full logo (shield + wordmark)
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-3 font-serif font-bold text-[#1A2B49] hover:text-[#152238] transition-colors",
        sizeClasses[size],
        className
      )}
    >
      <ShieldIcon size={shieldSizes[size]} />
      <span>ParentSimple</span>
    </Link>
  );
}

