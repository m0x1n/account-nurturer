import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

export default function Staff() {
  const { toast } = useToast();
  const { data: staffMembers, isLoading, error } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      console.log("Fetching staff members...");
      const { data, error } = await supabase
        .from("staff_members")
        .select("*");
      
      if (error) {
        console.error("Error fetching staff:", error);
        throw error;
      }
      console.log("Staff data:", data);
      return data;
    },
  });

  if (error) {
    console.error("Query error:", error);
    toast({
      title: "Error loading staff members",
      description: error.message,
      variant: "destructive",
    });
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Staff Members</h1>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error loading staff members</div>
      ) : staffMembers?.length === 0 ? (
        <div>No staff members found</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffMembers?.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.first_name} {staff.last_name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phone}</TableCell>
                <TableCell>{staff.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}