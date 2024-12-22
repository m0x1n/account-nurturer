import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ScheduleDay {
  date: string;
  enabled: boolean;
  formatted: string;
}

interface ScheduleProps {
  days: ScheduleDay[];
  onDayToggle: (index: number) => void;
}

export function ScheduleSection({ days, onDayToggle }: ScheduleProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">When do you need a boost?</Label>
      <div className="space-y-2">
        {days.map((day, index) => (
          <div key={day.formatted} className="flex items-center justify-between">
            <span className="text-sm">{day.formatted}</span>
            <Switch
              checked={day.enabled}
              onCheckedChange={() => onDayToggle(index)}
            />
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Boost will end automatically on the last day above.
      </p>
    </div>
  );
}