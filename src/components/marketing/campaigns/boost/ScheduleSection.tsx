import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
  if (!days || days.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">When do you need a boost?</Label>
      <div className="space-y-2 border rounded-lg p-4">
        {days.map((day, index) => (
          <div key={day.date}>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">{day.formatted}</span>
              <Switch
                checked={day.enabled}
                onCheckedChange={() => onDayToggle(index)}
              />
            </div>
            {index < days.length - 1 && (
              <Separator className="my-2" />
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Boost will end automatically on the last day above.
      </p>
    </div>
  );
}