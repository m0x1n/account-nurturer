import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChecklistItem } from "./types";

interface ChecklistItemCardProps {
  item: ChecklistItem;
}

export const ChecklistItemCard = ({ item }: ChecklistItemCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-4 flex items-start justify-between hover:bg-accent/50 transition-colors">
      <div className="flex items-start gap-4">
        {item.completed ? (
          <CheckCircle2 className="h-6 w-6 text-primary mt-1" />
        ) : (
          <Circle className="h-6 w-6 text-muted-foreground mt-1" />
        )}
        <div>
          <h3 className="font-medium">{item.title}</h3>
          <p className="text-sm text-muted-foreground">
            {item.description}
          </p>
        </div>
      </div>
      <Button
        variant={item.completed ? "outline" : "default"}
        size="sm"
        onClick={() => navigate(item.route)}
        className="flex items-center gap-2"
      >
        {item.completed ? (
          <>
            <Clock className="h-4 w-4" />
            Review
          </>
        ) : (
          <>
            <ExternalLink className="h-4 w-4" />
            Complete
          </>
        )}
      </Button>
    </div>
  );
};