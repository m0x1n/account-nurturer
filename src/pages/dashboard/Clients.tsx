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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: businesses, error: businessError } = await supabase
        .from("businesses")
        .select("*")
        .limit(1);
      
      if (businessError) throw businessError;

      if (!businesses || businesses.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq('business_id', businesses[0].id);
      
      if (error) throw error;
      return data;
    },
  });

  if (error) {
    toast({
      title: "Error loading clients",
      description: error.message,
      variant: "destructive",
    });
  }

  return (
    <div className="p-6 bg-[#FAFAFA] min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <Users2 className="h-6 w-6 text-[#0095F6]" />
        <h1 className="text-2xl font-bold text-[#262626]">Clients</h1>
      </div>

      {isLoading ? (
        <div className="text-[#8E8E8E]">Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error loading clients</div>
      ) : clients?.length === 0 ? (
        <div className="text-[#8E8E8E]">No clients found. Please make sure you have created a business first.</div>
      ) : (
        <div className="bg-white rounded-lg border border-[#DBDBDB] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FAFAFA] border-b border-[#DBDBDB]">
                <TableHead className="text-[#8E8E8E] font-semibold">Name</TableHead>
                <TableHead className="text-[#8E8E8E] font-semibold">Email</TableHead>
                <TableHead className="text-[#8E8E8E] font-semibold">Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients?.map((client) => (
                <TableRow 
                  key={client.id}
                  className="hover:bg-[#FAFAFA] transition-colors border-b border-[#DBDBDB]"
                >
                  <TableCell className="text-[#262626]">
                    {client.first_name} {client.last_name}
                  </TableCell>
                  <TableCell className="text-[#262626]">{client.email}</TableCell>
                  <TableCell className="text-[#262626]">{client.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}