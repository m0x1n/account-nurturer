import { format, differenceInMinutes, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { STAFF_COLUMN_WIDTH } from "./constants";

interface StaffColumnProps {
  staff: {
    id: string;
  };
  appointments: any[];
  currentDate: Date;
  currentTimeTop: number;
  dayStart: Date;
}

export function StaffColumn({ staff, appointments, currentDate, currentTimeTop, dayStart }: StaffColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getAppointmentStyle = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const minutesFromMidnight = differenceInMinutes(start, dayStart);
    const duration = differenceInMinutes(end, start);
    
    return {
      top: `${(minutesFromMidnight / (24 * 60)) * 100}%`,
      height: `${(duration / (24 * 60)) * 100}%`,
    };
  };

  // Filter appointments for this staff member or unassigned appointments
  const staffAppointments = appointments.filter(apt => 
    apt.staff_id === staff.id || apt.staff_id === null
  );
  
  console.log(`Appointments for staff ${staff.id}:`, staffAppointments);

  return (
    <div 
      className="flex-shrink-0 relative border-r" 
      style={{ 
        width: `${STAFF_COLUMN_WIDTH}px`, 
        minWidth: `${STAFF_COLUMN_WIDTH}px`,
        maxWidth: `${STAFF_COLUMN_WIDTH}px`
      }}
    >
      {/* Hour grid lines */}
      {hours.map((hour) => (
        <div
          key={hour}
          className="h-16 border-b border-gray-100"
        />
      ))}

      {/* Current time indicator */}
      {format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
        <div 
          className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
          style={{ top: `${currentTimeTop}%` }}
        >
          <div className="w-2 h-2 rounded-full bg-red-500 -ml-1"></div>
          <div className="flex-1 h-px bg-red-500"></div>
        </div>
      )}

      {/* Appointments */}
      {staffAppointments.map((appointment) => {
        const style = getAppointmentStyle(appointment.start_time, appointment.end_time);
        
        return (
          <div
            key={appointment.id}
            className={cn(
              "absolute left-1 right-1 rounded-md p-2",
              "bg-primary/10 hover:bg-primary/20 transition-colors",
              "cursor-pointer text-sm"
            )}
            style={style}
          >
            <div className="font-medium">
              {appointment.client?.first_name} {appointment.client?.last_name}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(appointment.start_time), 'h:mm a')} - {format(new Date(appointment.end_time), 'h:mm a')}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {appointment.service?.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}