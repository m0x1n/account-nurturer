import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  currentDate: Date;
  view: "day" | "week";
  selectedStaffIds?: string[];
  onDateChange: (date: Date) => void;
  onViewChange: (view: "day" | "week") => void;
  onStaffChange: (staffIds: string[]) => void;
  staffMembers?: Array<{ id: string; first_name: string; last_name: string; }>;
}

export function CalendarHeader({
  currentDate,
  view,
  selectedStaffIds = [], // Provide default empty array
  onDateChange,
  onViewChange,
  onStaffChange,
  staffMembers = [], // Provide default empty array
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

  const handleStaffSelect = (staffId: string) => {
    if (view === 'week') {
      onStaffChange([staffId]);
    } else {
      const newSelection = selectedStaffIds.includes(staffId)
        ? selectedStaffIds.filter(id => id !== staffId)
        : [...selectedStaffIds, staffId];
      onStaffChange(newSelection);
    }
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
        {view === 'week' ? (
          <Select
            value={selectedStaffIds[0] || ''}
            onValueChange={(value) => onStaffChange([value])}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent>
              {staffMembers.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.first_name} {staff.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start">
                {selectedStaffIds.length === 0
                  ? "Select staff members"
                  : `${selectedStaffIds.length} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandEmpty>No staff found.</CommandEmpty>
                <CommandGroup>
                  {staffMembers.map((staff) => (
                    <CommandItem
                      key={staff.id}
                      onSelect={() => handleStaffSelect(staff.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedStaffIds.includes(staff.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {staff.first_name} {staff.last_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}