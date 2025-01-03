import { format } from "date-fns";
import { STAFF_COLUMN_WIDTH } from "./constants";

interface StaffColumnProps {
  staff: any;
  appointments: any[];
  currentDate: Date;
  currentTimeTop: number;
  dayStart: Date;
}

export function StaffColumn({ staff, appointments, currentDate, currentTimeTop }: StaffColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div 
      className="border-r relative"
      style={{ 
        width: `${STAFF_COLUMN_WIDTH}px`, 
        minWidth: `${STAFF_COLUMN_WIDTH}px`,
        maxWidth: `${STAFF_COLUMN_WIDTH}px`
      }}
    >
      {hours.map((hour) => (
        <div key={hour} className="h-16 border-b relative">
          {appointments
            .filter(apt => new Date(apt.start_time).getHours() === hour)
            .map((apt) => (
              <div
                key={apt.id}
                className="bg-primary/10 p-2 text-sm rounded mb-1"
              >
                {apt.client?.first_name} {apt.client?.last_name} - {apt.service?.name}
              </div>
            ))}
        </div>
      ))}
      
      {/* Current time line */}
      {format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
        <div 
          className="absolute left-0 right-0 z-10"
          style={{ top: `${currentTimeTop}px`, transform: 'translateY(-50%)' }}
        >
          <div className="w-full h-px bg-red-500" />
        </div>
      )}
    </div>
  );
}