import { format } from "date-fns";

interface StaffColumnProps {
  staff: any;
  appointments: any[];
  currentDate: Date;
  currentTimeTop: number;
  dayStart: Date;
}

export function StaffColumn({ staff, appointments, currentDate }: StaffColumnProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex-1 min-w-[200px] border-r relative">
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
    </div>
  );
}