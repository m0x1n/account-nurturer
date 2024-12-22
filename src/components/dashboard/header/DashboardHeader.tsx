import { Bell, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  showInsights: boolean;
  onInsightsChange: (show: boolean) => void;
  onNotificationsClick: () => void;
}

export function DashboardHeader({
  showInsights,
  onInsightsChange,
  onNotificationsClick
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">Insights snapshot</h1>
        <div className="flex items-center space-x-3 px-3 py-2 rounded-md bg-secondary/50">
          <Switch
            id="insights-mode"
            checked={showInsights}
            onCheckedChange={onInsightsChange}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground/20 h-[24px] w-[44px]"
          />
          <Label 
            htmlFor="insights-mode" 
            className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none"
          >
            {showInsights ? (
              <>
                <Eye className="h-4 w-4 text-primary" />
                <span>Show Insights</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 text-muted-foreground" />
                <span>Hide Insights</span>
              </>
            )}
          </Label>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onNotificationsClick}
        >
          <Bell className="h-5 w-5" />
        </Button>
        <SidebarTrigger />
      </div>
    </div>
  );
}