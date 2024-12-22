import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const handleClick = () => {
    if (!isComingSoon) {
      onExpand(id);
    }
  };

  const lastMinuteInfo = `The Fill Last Minute Openings feature is used to fill unbooked appointments in the final 24-48 hours. It starts by looking at the open spots on your calendar, and then, based on your unique business history, determines how likely those spots are to be booked in the coming days. The spots that are unlikely to be booked are then offered to select clients who have expressed interest.`;

  const boostInfo = `Boosts are designed to reach a large amount of contacts in a short period of time. Perfect for sending out a special promotion or when business has been slow. We automatically targets customers who are likely ready to come back, and sends campaigns to give your business a boost.`;

  return (
    <div 
      className={`p-4 bg-card rounded-lg border shadow-sm transition-all duration-200 
        ${!isComingSoon ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-1 text-primary">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">{name}</h3>
              {isActive && (
                <Badge variant="default" className="bg-primary">
                  ACTIVE
                </Badge>
              )}
              {(id === 'last-minute' || id === 'boost') && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent 
                      className="max-w-[400px] p-4 bg-white border shadow-lg rounded-lg"
                    >
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {id === 'last-minute' ? lastMinuteInfo : boostInfo}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          </div>
        </div>
        <div>
          {isComingSoon && (
            <span className="text-sm text-muted-foreground">Coming Soon</span>
          )}
        </div>
      </div>
    </div>
  );
}