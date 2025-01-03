import { format } from "date-fns";
import { STAFF_COLUMN_WIDTH } from "./constants";
import { Check, X, Clock, Calendar, AlertCircle } from "lucide-react";

interface StaffColumnProps {
  staff: any;
  appointments: any[];
  currentDate: Date;
  currentTimeTop: number;
  dayStart: Date;
}

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return <Check className="h-4 w-4 text-success-DEFAULT" />;
    case 'cancelled':
      return <X className="h-4 w-4 text-error-DEFAULT" />;
    case 'scheduled':
      return <Calendar className="h-4 w-4 text-primary-DEFAULT" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-warning-DEFAULT" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

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
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(apt.status)}
                  <span className="font-medium">
                    {apt.client?.first_name} {apt.client?.last_name}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {apt.service?.name}
                </span>
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