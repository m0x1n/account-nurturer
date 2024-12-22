import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function BookingLink() {
  const { toast } = useToast();

  const { data: bookingLink } = useQuery({
    queryKey: ["booking-link"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: businesses } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (!businesses) return null;

      const { data: links } = await supabase
        .from("booking_links")
        .select("*")
        .eq("business_id", businesses.id)
        .maybeSingle();

      return links;
    },
  });

  const handleCopy = () => {
    if (bookingLink?.slug) {
      navigator.clipboard.writeText(`${window.location.origin}/book/${bookingLink.slug}`);
      toast({
        title: "Booking link copied to clipboard",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Link</h1>
      <div className="max-w-xl">
        <p className="text-muted-foreground mb-4">
          Share this link with your clients to let them book appointments online
        </p>
        <div className="flex gap-2">
          <Input
            value={bookingLink?.slug ? `${window.location.origin}/book/${bookingLink.slug}` : "Loading..."}
            readOnly
          />
          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}