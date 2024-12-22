import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentDate: Date;
  view: "day" | "week";
  onDateChange: (date: Date) => void;
  onViewChange: (view: "day" | "week") => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onDateChange,
  onViewChange,
}: CalendarHeaderProps) {
  const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() - 7);
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(currentDate.getDate() + 1);
    } else {
      newDate.setDate(currentDate.getDate() + 7);
    }
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant={isToday ? "default" : "outline"}
          onClick={() => onDateChange(new Date())}
        >
          Today
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-lg font-semibold">
          {format(currentDate, view === 'week' ? 'MMM d - ' : 'MMM d, yyyy')}
          {view === 'week' && format(new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant={view === 'day' ? "default" : "outline"}
            onClick={() => onViewChange('day')}
          >
            Day
          </Button>
          <Button
            variant={view === 'week' ? "default" : "outline"}
            onClick={() => onViewChange('week')}
          >
            Week
          </Button>
        </div>
      </div>
    </div>
  );
}