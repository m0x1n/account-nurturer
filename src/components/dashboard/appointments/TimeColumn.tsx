import { format } from "date-fns";
import { createHourLabels, formatTimeLabel } from "@/utils/timeUtils";
import { TIME_COLUMN_WIDTH } from "./constants";

interface TimeColumnProps {
  currentDate: Date;
  currentTimeTop: number;
}

export function TimeColumn({ currentDate, currentTimeTop }: TimeColumnProps) {
  const hourLabels = createHourLabels();

  return (
    <div 
      className="flex-shrink-0 border-r bg-white z-10 relative" 
      style={{ width: TIME_COLUMN_WIDTH, minWidth: TIME_COLUMN_WIDTH }}
    >
      {hourLabels.map((timeForHour) => (
        <div
          key={timeForHour.getHours()}
          className="h-16 border-b text-sm text-muted-foreground relative"
        >
          <span className="absolute -top-3 right-4">
            {format(timeForHour, 'h a')}
          </span>
        </div>
      ))}
      
      {/* Current time indicator with bubble */}
      {format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
        <div 
          className="absolute left-0 right-0 z-20 flex items-center"
          style={{ top: `${currentTimeTop * 4}px` }}
        >
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto mr-2">
            {formatTimeLabel(new Date())}
          </div>
        </div>
      )}
    </div>
  );
}