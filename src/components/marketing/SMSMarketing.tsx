import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SMSMarketing() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">SMS Campaigns</h2>
      </div>

      <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
        <div className="text-center">
          <h3 className="font-medium">SMS Marketing Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-1">
            We're working on bringing SMS capabilities to your marketing toolkit.
          </p>
        </div>
      </div>

      <Button variant="outline" className="w-full" disabled>
        Create SMS Campaign
      </Button>
    </div>
  );
}