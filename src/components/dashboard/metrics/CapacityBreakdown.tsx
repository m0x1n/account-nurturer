import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface CapacityBreakdownProps {
  capacityData: Array<{
    name: string;
    value: number;
  }>;
}

export function CapacityBreakdown({ capacityData }: CapacityBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Capacity Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px]">
          <PieChart>
            <Pie
              data={capacityData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
            >
              {capacityData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.name === 'Used' ? 'var(--color-used)' : 'var(--color-available)'} 
                />
              ))}
            </Pie>
            <ChartTooltip />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}