import { useBusinessData } from "@/hooks/useBusinessData";
import { useBusinessServices } from "@/hooks/useBusinessServices";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

export function ServicesList() {
  const { data: businessData } = useBusinessData();
  const { data: services, isLoading } = useBusinessServices(businessData?.id);

  if (isLoading) {
    return <div className="text-[#8E8E8E]">Loading services...</div>;
  }

  if (!services?.length) {
    return (
      <div className="text-[#8E8E8E] text-center py-8">
        No services added yet. Click the "Add Service" button to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#FAFAFA] border-b border-[#DBDBDB]">
          <TableHead className="text-[#8E8E8E] font-semibold">Service</TableHead>
          <TableHead className="text-[#8E8E8E] font-semibold">Price</TableHead>
          <TableHead className="text-[#8E8E8E] font-semibold">Deposit</TableHead>
          <TableHead className="text-[#8E8E8E] font-semibold">Cancellation Window</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow 
            key={service.id}
            className="hover:bg-[#FAFAFA] transition-colors border-b border-[#DBDBDB]"
          >
            <TableCell className="text-[#262626]">
              <div>
                <div className="font-medium">{service.name}</div>
                <div className="text-sm text-[#8E8E8E]">{service.description}</div>
              </div>
            </TableCell>
            <TableCell className="text-[#262626]">
              {formatCurrency(service.price)}
            </TableCell>
            <TableCell className="text-[#262626]">
              {service.deposit_type === 'percentage' 
                ? `${service.deposit_amount}%`
                : formatCurrency(service.deposit_amount || 0)}
            </TableCell>
            <TableCell className="text-[#262626]">
              {service.cancellation_hours 
                ? `${service.cancellation_hours} hours`
                : 'No window set'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}