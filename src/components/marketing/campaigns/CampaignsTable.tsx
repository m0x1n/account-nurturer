import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { CampaignTableHeader } from "./table/CampaignTableHeader";
import { CampaignTableRow } from "./table/CampaignTableRow";
import { useCampaignsQuery } from "./table/useCampaignsQuery";

export function CampaignsTable() {
  const { data: campaigns, isLoading, invalidate } = useCampaignsQuery();

  if (isLoading) {
    return <div>Loading campaigns...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <CampaignTableHeader />
        <TableBody>
          {campaigns?.map((campaign) => (
            <CampaignTableRow 
              key={campaign.id} 
              campaign={campaign} 
              onArchive={invalidate}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}