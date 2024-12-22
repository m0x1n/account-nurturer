import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

export function CampaignsTable() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns-with-metrics'],
    queryFn: async () => {
      const { data: campaigns, error } = await supabase
        .from('marketing_campaigns')
        .select(`
          *,
          campaign_metrics (
            users_targeted,
            users_engaged,
            revenue_lift
          )
        `);

      if (error) throw error;
      return campaigns;
    },
  });

  if (isLoading) {
    return <div>Loading campaigns...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Users Targeted</TableHead>
            <TableHead className="text-right">Users Engaged</TableHead>
            <TableHead className="text-right">Revenue Lift</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns?.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell>{campaign.campaign_type}</TableCell>
              <TableCell className="text-right">
                {campaign.campaign_metrics?.[0]?.users_targeted || 0}
              </TableCell>
              <TableCell className="text-right">
                {campaign.campaign_metrics?.[0]?.users_engaged || 0}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(campaign.campaign_metrics?.[0]?.revenue_lift || 0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}