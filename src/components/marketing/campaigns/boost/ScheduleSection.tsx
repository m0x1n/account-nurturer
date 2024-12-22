import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScheduleDay {
  date: string;
  enabled: boolean;
  formatted: string;
}

interface ScheduleProps {
  days: ScheduleDay[];
  onDayToggle: (index: number) => void;
  readOnly?: boolean;
}

export function ScheduleSection({ days, onDayToggle, readOnly }: ScheduleProps) {
  if (!days || days.length === 0) return null;

  return (
    <Card className={cn("p-6 my-8", readOnly && "opacity-75")}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-lg font-medium">When do you need a boost?</Label>
          <p className="text-sm text-muted-foreground">
            Boost will end automatically on the last day.
          </p>
        </div>
        <div className="space-y-3">
          {days.map((day, index) => (
            <div 
              key={day.date} 
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <span className="text-sm text-gray-700">{day.formatted}</span>
              <Switch
                checked={day.enabled}
                onCheckedChange={() => !readOnly && onDayToggle(index)}
                disabled={readOnly}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}