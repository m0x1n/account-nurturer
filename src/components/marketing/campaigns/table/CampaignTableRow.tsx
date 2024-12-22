import { Archive } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { isAfter } from "date-fns";

interface CampaignTableRowProps {
  campaign: {
    id: string;
    name: string;
    campaign_type: string;
    status: string;
    created_at: string;
    settings?: {
      schedule?: Array<{
        date: string;
        enabled: boolean;
      }>;
    };
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

  const getCampaignType = () => {
    return "Smart";
  };

  const getCampaignSubtype = (type: string) => {
    const subtypeMap: { [key: string]: string } = {
      'boost': 'Boost',
      'last-minute': 'Fill Last Minute Openings',
      'slow-days': 'Fill Slow Days',
      'limited-time': 'Limited Time Specials',
      'reminder': 'Reminder to Book Again',
      'rescue': 'Rescue Lost Customers',
      'manual': 'Manual Campaign'
    };
    return subtypeMap[type.toLowerCase()] || type;
  };

  const isBoostCampaignActive = () => {
    if (campaign.campaign_type !== 'boost' || !campaign.settings?.schedule) {
      return false;
    }

    const lastDay = campaign.settings.schedule
      .filter(day => day.enabled)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return lastDay && isAfter(new Date(lastDay.date), new Date());
  };

  return (
    <TableRow key={campaign.id}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {campaign.name}
          {isBoostCampaignActive() && (
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
            {getCampaignSubtype(campaign.campaign_type)}
          </span>
        </div>
      </TableCell>
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