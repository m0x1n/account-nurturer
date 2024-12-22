import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Papa from 'papaparse';

export default function ImportClients() {
  const [file, setFile] = useState<File | null>(null);
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

  const importMutation = useMutation({
    mutationFn: async (clients: any[]) => {
      const { error } = await supabase
        .from("clients")
        .insert(
          clients.map(client => ({
            business_id: businessData?.id,
            first_name: client["First Name"],
            last_name: client["Last Name"],
            email: client.Email,
            phone: client.Phone
          }))
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Clients imported successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error importing clients",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast({
        title: "Please select a file",
        variant: "destructive",
      });
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        importMutation.mutate(results.data);
      },
      error: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Import Clients</h1>
      <div className="max-w-xl">
        <p className="text-muted-foreground mb-4">
          Upload a CSV file with the following columns: First Name, Last Name, Email, Phone
        </p>
        <div className="space-y-4">
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
          <Button
            onClick={handleImport}
            disabled={!file || importMutation.isPending}
          >
            {importMutation.isPending ? "Importing..." : "Import Clients"}
          </Button>
        </div>
      </div>
    </div>
  );
}