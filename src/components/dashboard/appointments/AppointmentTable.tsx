import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AppointmentTableProps {
  appointments: any[];
}

export function AppointmentTable({ appointments }: AppointmentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Staff</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>
              {format(new Date(appointment.start_time), 'MMM d, h:mm a')}
            </TableCell>
            <TableCell>
              {appointment.client?.first_name} {appointment.client?.last_name}
            </TableCell>
            <TableCell>
              {appointment.staff?.first_name} {appointment.staff?.last_name}
            </TableCell>
            <TableCell>{appointment.service?.name}</TableCell>
            <TableCell className="capitalize">{appointment.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}