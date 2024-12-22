import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CampaignTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Created Date</TableHead>
        <TableHead>Start Date</TableHead>
        <TableHead>End Date</TableHead>
        <TableHead className="text-right">Sent</TableHead>
        <TableHead className="text-right">% Opened</TableHead>
        <TableHead className="text-right">% Clicked</TableHead>
        <TableHead className="text-right">% Unsubscribed</TableHead>
        <TableHead className="w-[50px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}