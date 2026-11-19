import React from "react";
import { cn } from "./cn";

export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  interactive?: boolean;
  as?: "div" | "section" | "article";
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  divided?: boolean;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h2" | "h3" | "h4";
}

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({
  padding = "md",
  interactive = false,
  as: Component = "div",
  className,
  children,
  ...props
}: CardProps) {
  const hasBgOverride = /(?:^|\s)bg-\S+/.test(className ?? "");
  const hasBorderColorOverride =
    /(?:^|\s)border-(?!0\b|2\b|4\b|8\b|x\b|y\b|t\b|b\b|l\b|r\b|collapse|separate|spacing|solid|dashed|dotted|none|hidden)\S+/.test(
      className ?? ""
    );
  const hasPaddingOverride = /(?:^|\s)p-\S+/.test(className ?? "");

  return (
    <Component
      className={cn(
        "rounded-[20px] border",
        !hasBgOverride && "bg-surface",
        !hasBorderColorOverride && "border-line",
        !hasPaddingOverride && paddingClasses[padding],
        interactive &&
          "hover:border-brand/40 transition-colors duration-150 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  divided = false,
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
        divided ? "border-b border-line pb-4 mb-5" : "mb-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  as: Component = "h3",
  className,
  children,
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={cn(
        "text-base sm:text-lg font-semibold text-fg tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}
