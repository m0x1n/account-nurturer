import { Zap, Construction } from "lucide-react";

export default function SmartCampaigns() {
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
          Smart Campaigns
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <Construction className="h-16 w-16 text-muted-foreground animate-pulse" />
        <h2 className="text-2xl font-semibold text-muted-foreground">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md">
          We're working on bringing AI-powered campaign optimization to help you reach your audience more effectively.
        </p>
      </div>
    </div>
  );
}