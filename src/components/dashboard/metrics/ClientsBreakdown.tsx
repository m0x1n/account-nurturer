import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const COLORS = ['#f97316', '#10b981'];

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients Served Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <ChartContainer config={{}} className="h-[200px] w-[200px]">
            <PieChart>
              <Pie
                data={clientsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
              >
                {clientsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <ChartTooltip />
            </PieChart>
          </ChartContainer>
          <div className="space-y-4">
            {clientsData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground">
                  {item.value} | {item.percentage}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Total Clients</span>
                <span className="text-sm text-muted-foreground">93 | 100%</span>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{averageClientSpend.label}</span>
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
                </div>
                <span className="text-sm font-bold">{averageClientSpend.amount}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}