import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { STAFF_COLUMN_WIDTH } from "./constants";

interface StaffHeaderProps {
  staff: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url?: string | null;
  };
  workingHours?: {
    open_time: string;
    close_time: string;
  } | null;
}

export function StaffHeader({ staff, workingHours }: StaffHeaderProps) {
  return (
    <div 
      className="p-4 border-r flex-shrink-0" 
      style={{ 
        width: `${STAFF_COLUMN_WIDTH}px`, 
        minWidth: `${STAFF_COLUMN_WIDTH}px`,
        maxWidth: `${STAFF_COLUMN_WIDTH}px`
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={staff.profile_image_url || undefined} alt={`${staff.first_name} ${staff.last_name}`} />
          <AvatarFallback>{staff.first_name[0]}{staff.last_name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium">
          {staff.first_name} {staff.last_name}
        </div>
      </div>
      {workingHours && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>
            {format(new Date(`2000-01-01T${workingHours.open_time}`), 'h:mm a')} - 
            {format(new Date(`2000-01-01T${workingHours.close_time}`), 'h:mm a')}
          </span>
        </div>
      )}
    </div>
  );
}