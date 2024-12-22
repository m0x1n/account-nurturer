import { PenTool, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ManualCampaign() {
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="flex items-center gap-2 mb-6">
        <PenTool className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
          Create Manual Campaign
        </h1>
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold">Select Campaign Type</h2>
        
        <div className="grid gap-4">
          <Card className="p-6 hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <Mail className="h-8 w-8 text-primary" />
              <div className="space-y-2">
                <h3 className="font-medium">Email Campaign</h3>
                <p className="text-sm text-muted-foreground">
                  Create and send targeted email campaigns to your audience
                </p>
                <Button variant="outline" size="sm">
                  Create Email Campaign
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div className="space-y-2">
                <h3 className="font-medium">SMS Campaign</h3>
                <p className="text-sm text-muted-foreground">
                  Reach your audience directly with SMS messages
                </p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}