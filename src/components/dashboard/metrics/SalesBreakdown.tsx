import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface SalesBreakdownProps {
  salesData: Array<{
    name: string;
    sales: number;
  }>;
  chartConfig: Record<string, any>;
}

const COLORS = {
  memberships: "#4ADE80",  // Light green for Memberships
  packages: "#22C55E",     // Darker green for Packages
  products: "#16A34A",     // Darkest green for Products
  appointments: "#86EFAC", // Lightest green for Appointments
  giftCards: "#E2E8F0",   // Light gray for Gift Cards
  other: "#94A3B8",       // Darker gray for Other
};

export function SalesBreakdown({ salesData }: SalesBreakdownProps) {
  // Transform weekly sales data into category breakdown
  const pieData = [
    { name: "Memberships", value: 30 },
    { name: "Packages", value: 28 },
    { name: "Products", value: 20 },
    { name: "Appointments", value: 15 },
    { name: "Gift Cards", value: 13 },
    { name: "Other", value: 9 },
  ];

  const CustomLegend = () => {
    return (
      <div className="space-y-2">
        {pieData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[item.name.toLowerCase().replace(' ', '') as keyof typeof COLORS] }}
            />
            <span className="text-sm text-muted-foreground">{item.name}</span>
            <span className="text-sm font-medium">
              {item.value} | {item.value}%
            </span>
          </div>
        ))}
        <div className="pt-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total Sales</span>
            <span className="text-sm font-medium">
              {pieData.reduce((acc, curr) => acc + curr.value, 0)} | 100%
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-8">
            <div className="h-[120px] w-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={45}
                    innerRadius={35}
                    fill="#8884d8"
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.name.toLowerCase().replace(' ', '') as keyof typeof COLORS]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <CustomLegend />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}