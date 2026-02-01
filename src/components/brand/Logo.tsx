import Link from "next/link";
import Image from "next/image";
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

  const imageSizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
  };

  const headerLogoHeights = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  // Shield mark only
  if (variant === "shield") {
    return (
      <Link href={href} className={cn("inline-flex items-center", className)}>
        <Image
          src="/images/logos/ParentSimple-logo-mark.png"
          alt="ParentSimple Shield Logo"
          width={imageSizes[size].width}
          height={imageSizes[size].height}
          className="flex-shrink-0 object-contain"
          priority={size === "lg"}
        />
      </Link>
    );
  }

  // Wordmark only (text)
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

  // Full logo (shield + wordmark from header logo image)
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center",
        className
      )}
    >
      <Image
        src="/images/logos/ParentSimple-header-logo.png"
        alt="ParentSimple Logo"
        width={200} // Base width, will scale with height
        height={headerLogoHeights[size]}
        className="h-auto w-auto object-contain"
        style={{ height: `${headerLogoHeights[size]}px`, width: 'auto' }}
        priority={size === "lg"}
      />
    </Link>
  );
}

