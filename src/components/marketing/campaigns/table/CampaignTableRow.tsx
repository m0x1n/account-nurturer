import { Archive } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Campaign } from "../types/campaignTypes";
import { getCampaignType, getCampaignSubtype, isCampaignActive } from "../utils/campaignUtils";
import { format } from "date-fns";

interface CampaignTableRowProps {
  campaign: Campaign;
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

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'MMM d, yyyy');
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {campaign.name}
          {isCampaignActive(campaign) && (
            <Badge variant="default" className="bg-primary">
              ACTIVE
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{getCampaignType()}</span>
          <span className="text-sm text-muted-foreground">
            {getCampaignSubtype(campaign.campaign_subtype)}
          </span>
        </div>
      </TableCell>
      <TableCell>{formatDate(campaign.created_at)}</TableCell>
      <TableCell>{formatDate(campaign.start_date)}</TableCell>
      <TableCell>{formatDate(campaign.end_date)}</TableCell>
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