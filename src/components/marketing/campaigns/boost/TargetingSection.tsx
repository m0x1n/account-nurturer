import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
    <div className="space-y-4">
      <Label className="text-sm font-medium">Who can be targeted?</Label>
      <div className={`flex gap-2 ${readOnly ? 'pointer-events-none' : ''}`}>
        <button
          onClick={() => onTargetingChange("inactive")}
          className={`px-3 py-1.5 rounded text-sm ${
            targetingOption === "inactive"
              ? "bg-primary text-white"
              : "bg-secondary"
          }`}
        >
          No recent visit
        </button>
        <button
          onClick={() => onTargetingChange("all")}
          className={`px-3 py-1.5 rounded text-sm ${
            targetingOption === "all"
              ? "bg-primary text-white"
              : "bg-secondary"
          }`}
        >
          All Contacts
        </button>
      </div>
      {targetingOption === "inactive" && (
        <div className={`flex items-center gap-2 ${readOnly ? 'pointer-events-none' : ''}`}>
          <Input
            type="number"
            value={daysThreshold}
            onChange={(e) => onDaysChange(e.target.value)}
            className="w-20"
            min="1"
            disabled={readOnly}
          />
          <span className="text-sm text-muted-foreground">Days since last visit</span>
        </div>
      )}
    </div>
  );
}