import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TargetingProps {
  targetingOption: string;
  daysThreshold: string;
  onTargetingChange: (value: string) => void;
  onDaysChange: (value: string) => void;
  readOnly?: boolean;
}

export function TargetingSection({
  targetingOption,
  daysThreshold,
  onTargetingChange,
  onDaysChange,
  readOnly,
}: TargetingProps) {
  return (
    <div className={cn("space-y-4", readOnly && "opacity-75")}>
      <Label className="text-sm font-medium">Who can be targeted?</Label>
      <div className="flex gap-2">
        <button
          onClick={() => !readOnly && onTargetingChange("inactive")}
          className={cn(
            "px-3 py-1.5 rounded text-sm",
            targetingOption === "inactive"
              ? "bg-primary text-white"
              : "bg-secondary",
            readOnly && "cursor-default opacity-75"
          )}
          disabled={readOnly}
        >
          No recent visit
        </button>
        <button
          onClick={() => !readOnly && onTargetingChange("all")}
          className={cn(
            "px-3 py-1.5 rounded text-sm",
            targetingOption === "all"
              ? "bg-primary text-white"
              : "bg-secondary",
            readOnly && "cursor-default opacity-75"
          )}
          disabled={readOnly}
        >
          All Contacts
        </button>
      </div>
      {targetingOption === "inactive" && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={daysThreshold}
            onChange={(e) => onDaysChange(e.target.value)}
            className="w-20"
            min="1"
            readOnly={readOnly}
            disabled={readOnly}
          />
          <span className="text-sm text-muted-foreground">Days since last visit</span>
        </div>
      )}
    </div>
  );
}