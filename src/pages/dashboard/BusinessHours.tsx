import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function BusinessHours() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: businessData } = useQuery({
    queryKey: ["business"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: businesses } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      return businesses;
    },
  });

  const { data: businessHours } = useQuery({
    queryKey: ["business-hours"],
    queryFn: async () => {
      if (!businessData?.id) return [];
      const { data } = await supabase
        .from("business_hours")
        .select("*")
        .eq("business_id", businessData.id);
      return data || [];
    },
    enabled: !!businessData?.id,
  });

  const updateHoursMutation = useMutation({
    mutationFn: async ({ dayOfWeek, isOpen, openTime, closeTime }: any) => {
      const { error } = await supabase
        .from("business_hours")
        .upsert({
          business_id: businessData?.id,
          day_of_week: dayOfWeek,
          is_open: isOpen,
          open_time: openTime,
          close_time: closeTime,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-hours"] });
      toast({
        title: "Business hours updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating business hours",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getHoursForDay = (dayIndex: number) => {
    return businessHours?.find(hours => hours.day_of_week === dayIndex) || {
      is_open: true,
      open_time: "09:00",
      close_time: "17:00",
    };
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Business Hours</h1>
      <div className="space-y-6">
        {DAYS_OF_WEEK.map((day, index) => {
          const hours = getHoursForDay(index);
          return (
            <div key={day} className="flex items-center gap-6">
              <div className="w-32">
                <Label>{day}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={hours.is_open}
                  onCheckedChange={(checked) =>
                    updateHoursMutation.mutate({
                      dayOfWeek: index,
                      isOpen: checked,
                      openTime: hours.open_time,
                      closeTime: hours.close_time,
                    })
                  }
                />
                <Label>Open</Label>
              </div>
              {hours.is_open && (
                <>
                  <Input
                    type="time"
                    value={hours.open_time}
                    onChange={(e) =>
                      updateHoursMutation.mutate({
                        dayOfWeek: index,
                        isOpen: hours.is_open,
                        openTime: e.target.value,
                        closeTime: hours.close_time,
                      })
                    }
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={hours.close_time}
                    onChange={(e) =>
                      updateHoursMutation.mutate({
                        dayOfWeek: index,
                        isOpen: hours.is_open,
                        openTime: hours.open_time,
                        closeTime: e.target.value,
                      })
                    }
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}