import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DayViewProps {
  date: Date;
  appointments: any[];
  staffMembers: any[];
  selectedStaffIds: string[];
}

export function DayView({ date, appointments, staffMembers, selectedStaffIds }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const filteredStaff = selectedStaffIds.length > 0
    ? staffMembers.filter(staff => selectedStaffIds.includes(staff.id))
    : staffMembers;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-[100px_repeat(auto-fill,minmax(200px,1fr))] gap-4">
        <div className="font-semibold">Time</div>
        {filteredStaff.map(staff => (
          <div key={staff.id} className="font-semibold text-center flex flex-col items-center gap-2">
            <Avatar className="h-12 w-12">
              <AvatarImage src={staff.profile_image_url} />
              <AvatarFallback>{staff.first_name[0]}{staff.last_name[0]}</AvatarFallback>
            </Avatar>
            <span>{staff.first_name} {staff.last_name}</span>
          </div>
        ))}
        
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div className="text-sm text-muted-foreground">
              {format(new Date().setHours(hour, 0), 'h:mm a')}
            </div>
            {filteredStaff.map(staff => {
              const hourAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.start_time);
                return aptDate.getHours() === hour &&
                  format(aptDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
              });

              return (
                <div key={`${hour}-${staff.id}`} className="min-h-[40px] border-t">
                  {hourAppointments.map(apt => (
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
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}