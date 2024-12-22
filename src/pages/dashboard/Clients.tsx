import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

export default function Clients() {
  const { toast } = useToast();
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      console.log("Fetching clients...");
      const { data, error } = await supabase
        .from("clients")
        .select("*");
      
      if (error) {
        console.error("Error fetching clients:", error);
        throw error;
      }
      console.log("Clients data:", data);
      return data;
    },
  });

  if (error) {
    console.error("Query error:", error);
    toast({
      title: "Error loading clients",
      description: error.message,
      variant: "destructive",
    });
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users2 className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Clients</h1>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error loading clients</div>
      ) : clients?.length === 0 ? (
        <div>No clients found</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients?.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.first_name} {client.last_name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}