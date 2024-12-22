import { ReactNode } from "react";

interface MarketingSectionProps {
  children: ReactNode;
}

export function MarketingSection({ children }: MarketingSectionProps) {
  return (
    <div className="space-y-4 animate-fade-in-up">
      {children}
    </div>
  );
}