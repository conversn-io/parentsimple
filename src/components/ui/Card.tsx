import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden",
        hover && "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[#9DB89D]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function CardImage({ src, alt, className, priority = false }: CardImageProps) {
  return (
    <div className="relative w-full aspect-video overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("p-6 flex-1 flex flex-col", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
}

export function CardTitle({ children, className, as: Component = "h3" }: CardTitleProps) {
  return (
    <Component
      className={cn(
        "font-serif font-bold text-[#1A2B49] mb-2 text-xl md:text-2xl break-words",
        className
      )}
    >
      {children}
    </Component>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn("text-gray-600 text-sm md:text-base leading-relaxed break-words", className)}>
      {children}
    </p>
  );
}

interface CardMetaProps {
  children: ReactNode;
  className?: string;
}

export function CardMeta({ children, className }: CardMetaProps) {
  return (
    <div className={cn("text-xs text-gray-500 mt-4", className)}>
      {children}
    </div>
  );
}

