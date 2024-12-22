import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentTable } from "./AppointmentTable";

interface AppointmentSectionProps {
  title: string;
  appointments: any[];
  isLoading: boolean;
  children?: React.ReactNode;
}

export function AppointmentSection({ 
  title, 
  appointments, 
  isLoading,
  children 
}: AppointmentSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : appointments?.length ? (
          <>
            <AppointmentTable appointments={appointments} />
            {children}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No {title.toLowerCase()}</p>
        )}
      </CardContent>
    </Card>
  );
}