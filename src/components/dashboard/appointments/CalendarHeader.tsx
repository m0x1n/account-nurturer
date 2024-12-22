import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Check, ChevronsUpDown } from "lucide-react";
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
  selectedStaffIds = [],
  onDateChange,
  onViewChange,
  onStaffChange,
  staffMembers = [],
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
    if (!staffMembers || staffMembers.length === 0) return;

    if (view === 'week') {
      // In week view, only allow single selection
      onStaffChange([staffId]);
    } else {
      // In day view, handle multi-select
      if (staffId === 'all') {
        onStaffChange(selectedStaffIds.length === staffMembers.length ? [] : staffMembers.map(staff => staff.id));
      } else {
        const newSelection = selectedStaffIds.includes(staffId)
          ? selectedStaffIds.filter(id => id !== staffId)
          : [...selectedStaffIds, staffId];
        onStaffChange(newSelection);
      }
    }
  };

  // Ensure we have valid arrays to work with
  const validStaffMembers = Array.isArray(staffMembers) ? staffMembers : [];
  const validSelectedStaffIds = Array.isArray(selectedStaffIds) ? selectedStaffIds : [];
  const allSelected = validStaffMembers.length > 0 && validSelectedStaffIds.length === validStaffMembers.length;

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
        {validStaffMembers.length > 0 && (
          view === 'week' ? (
            <Select
              value={validSelectedStaffIds[0] || ''}
              onValueChange={(value) => onStaffChange([value])}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {validStaffMembers.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.first_name} {staff.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                  <span>
                    {validSelectedStaffIds.length === 0
                      ? "Select staff members"
                      : `${validSelectedStaffIds.length} selected`}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandEmpty>No staff found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => handleStaffSelect('all')}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          allSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                        )}>
                          {allSelected && <Check className="h-3 w-3" />}
                        </div>
                        <span>Select All</span>
                      </div>
                    </CommandItem>
                    {validStaffMembers.map((staff) => (
                      <CommandItem
                        key={staff.id}
                        onSelect={() => handleStaffSelect(staff.id)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            validSelectedStaffIds.includes(staff.id) ? "bg-primary text-primary-foreground" : "opacity-50"
                          )}>
                            {validSelectedStaffIds.includes(staff.id) && <Check className="h-3 w-3" />}
                          </div>
                          <span>{staff.first_name} {staff.last_name}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )
        )}
      </div>
    </div>
  );
}