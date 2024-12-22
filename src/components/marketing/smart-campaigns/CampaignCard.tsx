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
  const handleClick = () => {
    if (!isComingSoon) {
      onExpand(id);
    }
  };

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