import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface SalesBreakdownProps {
  salesData: Array<{
    name: string;
    sales: number;
  }>;
  chartConfig: Record<string, any>;
}

export function SalesBreakdown({ salesData, chartConfig }: SalesBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <Bar 
            data={salesData}
            dataKey="sales"
            fill="var(--color-sales)"
            radius={[4, 4, 0, 0]}
          >
            <ChartTooltip />
          </Bar>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}