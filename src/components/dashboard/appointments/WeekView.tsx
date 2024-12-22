import { format, addDays } from "date-fns";

interface WeekViewProps {
  startDate: Date;
  appointments: any[];
  staffMember: any;
}

export function WeekView({ startDate, appointments, staffMember }: WeekViewProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  if (!staffMember) {
    return (
      <div className="mt-4 text-center text-muted-foreground">
        Please select a staff member to view their weekly schedule
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-4">
        <div className="font-semibold">Time</div>
        {days.map(day => (
          <div key={day.toString()} className="font-semibold text-center">
            {format(day, 'EEE MMM d')}
          </div>
        ))}
        
        {hours.map(hour => (
          <>
            <div key={hour} className="text-sm text-muted-foreground">
              {format(new Date().setHours(hour, 0), 'h:mm a')}
            </div>
            {days.map(day => {
              const dayAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.start_time);
                return aptDate.getHours() === hour &&
                  format(aptDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
              });

              return (
                <div key={`${hour}-${day}`} className="min-h-[40px] border-t">
                  {dayAppointments.map(apt => (
                    <div
                      key={apt.id}
                      className="bg-primary/10 p-2 text-sm rounded mb-1"
                    >
                      {apt.client?.first_name} {apt.client?.last_name} - {apt.service?.name}
                    </div>
                  ))}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}