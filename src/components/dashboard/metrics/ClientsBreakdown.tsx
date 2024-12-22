import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Using our primary blue and a lighter shade for better contrast
const COLORS = ['#377DF7', '#5691F8'];

interface ClientsBreakdownProps {
  clientsData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  averageClientSpend: {
    amount: string;
    label: string;
  };
}

export function ClientsBreakdown({ clientsData, averageClientSpend }: ClientsBreakdownProps) {
  const totalClients = clientsData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients Served Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-8">
              <ChartContainer config={{}} className="h-[120px] w-[120px]">
                <PieChart>
                  <Pie
                    data={clientsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={45}
                  >
                    {clientsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ChartContainer>
              <div className="space-y-2">
                {clientsData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                    <span className="text-sm font-medium">
                      {item.value} | {item.percentage}
                    </span>
                  </div>
                ))}
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Total Sales</span>
                    <span className="text-sm font-medium">{totalClients} | 100%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{averageClientSpend.label}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Average amount spent per client</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-lg font-bold">{averageClientSpend.amount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}