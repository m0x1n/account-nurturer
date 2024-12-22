import { TableCell, TableRow } from "@/components/ui/table";

interface CampaignTableRowProps {
  campaign: {
    id: string;
    name: string;
    campaign_type: string;
    created_at: string;
    campaign_metrics?: Array<{
      users_targeted: number;
      percent_opened: number;
      percent_clicked: number;
      percent_unsubscribed: number;
    }>;
  };
}

export function CampaignTableRow({ campaign }: CampaignTableRowProps) {
  return (
    <TableRow key={campaign.id}>
      <TableCell className="font-medium">{campaign.name}</TableCell>
      <TableCell>{campaign.campaign_type}</TableCell>
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
    </TableRow>
  );
}