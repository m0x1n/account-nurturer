import { Archive } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CampaignTableRowProps {
  campaign: {
    id: string;
    name: string;
    campaign_type: string;
    status: string;
    created_at: string;
    campaign_metrics?: Array<{
      users_targeted: number;
      percent_opened: number;
      percent_clicked: number;
      percent_unsubscribed: number;
    }>;
  };
  onArchive: () => void;
}

export function CampaignTableRow({ campaign, onArchive }: CampaignTableRowProps) {
  const { toast } = useToast();

  const handleArchive = async () => {
    const { error } = await supabase
      .from('marketing_campaigns')
      .update({ archived_at: new Date().toISOString(), status: 'archived' })
      .eq('id', campaign.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not archive campaign"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Campaign archived successfully"
    });
    onArchive();
  };

  const getCampaignType = (type: string) => {
    const smartTypes = ['boost', 'last-minute', 'slow-days', 'limited-time', 'reminder', 'rescue'];
    return smartTypes.includes(type.toLowerCase()) ? 'Smart' : 'Manual';
  };

  return (
    <TableRow key={campaign.id}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {campaign.name}
          {campaign.status === 'active' && (
            <Badge variant="default" className="bg-primary">
              ACTIVE
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>{getCampaignType(campaign.campaign_type)}</TableCell>
      <TableCell>{new Date(campaign.created_at).toLocaleDateString()}</TableCell>
      <TableCell className="text-right">
        {campaign.campaign_metrics?.[0]?.users_targeted || 0}
      </TableCell>
      <TableCell className="text-right">
        {campaign.campaign_metrics?.[0]?.percent_opened?.toFixed(1) || '-'}%
      </TableCell>
      <TableCell className="text-right">
        {campaign.campaign_metrics?.[0]?.percent_clicked?.toFixed(1) || '-'}%
      </TableCell>
      <TableCell className="text-right">
        {campaign.campaign_metrics?.[0]?.percent_unsubscribed?.toFixed(1) || '-'}%
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleArchive}
          title="Archive Campaign"
        >
          <Archive className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}