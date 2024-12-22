import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addHours } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface NewAppointmentFormProps {
  onSuccess: () => void;
}

export function NewAppointmentForm({ onSuccess }: NewAppointmentFormProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);

      if (!businesses?.length) return [];

      const { data } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', businesses[0].id);
      return data || [];
    }
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);

      if (!businesses?.length) return [];

      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businesses[0].id);
      return data || [];
    }
  });

  const { data: staffMembers } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);

      if (!businesses?.length) return [];

      const { data } = await supabase
        .from('staff_members')
        .select('*')
        .eq('business_id', businesses[0].id)
        .eq('status', 'active');
      return data || [];
    }
  });

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const handleSubmit = async () => {
    if (!selectedDate || !selectedClient || !selectedService || !selectedStaff) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const startTime = new Date(selectedDate);
      const [hours] = selectedTime.split(':').map(Number);
      startTime.setHours(hours, 0, 0, 0);

      const { data: businesses } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);

      if (!businesses?.length) throw new Error("No business found");

      const { error } = await supabase
        .from('appointments')
        .insert({
          business_id: businesses[0].id,
          client_id: selectedClient,
          service_id: selectedService,
          staff_id: selectedStaff,
          start_time: startTime.toISOString(),
          end_time: addHours(startTime, 1).toISOString(),
          status: 'scheduled'
        });

      if (error) throw error;

      toast({
        title: "Appointment created successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error creating appointment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 py-4">
      <div className="grid gap-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </div>

      <div className="grid gap-2">
        <Select value={selectedTime} onValueChange={setSelectedTime}>
          <SelectTrigger>
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger>
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            {clients?.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.first_name} {client.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger>
            <SelectValue placeholder="Select service" />
          </SelectTrigger>
          <SelectContent>
            {services?.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.name} (${service.price})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Select value={selectedStaff} onValueChange={setSelectedStaff}>
          <SelectTrigger>
            <SelectValue placeholder="Select staff member" />
          </SelectTrigger>
          <SelectContent>
            {staffMembers?.map((staff) => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.first_name} {staff.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Appointment"}
      </Button>
    </div>
  );
}