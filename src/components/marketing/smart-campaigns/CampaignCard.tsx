import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CampaignCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isComingSoon?: boolean;
  expandedId: string | null;
  onExpand: (id: string) => void;
}

export function CampaignCard({
  id,
  name,
  description,
  icon,
  isActive,
  isComingSoon,
  expandedId,
  onExpand,
}: CampaignCardProps) {
  return (
    <div className="p-4 bg-card rounded-lg border shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-1 text-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isComingSoon && (
            <button
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
              onClick={() => onExpand(id)}
            >
              Configure
              {expandedId === id ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
          {isComingSoon ? (
            <span className="text-sm text-muted-foreground">Coming Soon</span>
          ) : (
            isActive && (
              <Badge variant="default" className="bg-primary">
                ACTIVE
              </Badge>
            )
          )}
        </div>
      </div>
    </div>
  );
}