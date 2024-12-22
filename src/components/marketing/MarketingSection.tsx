import { ReactNode } from "react";

interface MarketingSectionProps {
  children: ReactNode;
}

export function MarketingSection({ children }: MarketingSectionProps) {
  return (
    <div className="grid gap-4 animate-fade-in-up">
      {children}
    </div>
  );
}