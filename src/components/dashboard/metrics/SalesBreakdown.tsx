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
  memberships: "#9b87f5",    // Primary Purple
  packages: "#7E69AB",       // Secondary Purple
  products: "#6E59A5",       // Tertiary Purple
  appointments: "#D6BCFA",   // Light Purple
  giftcards: "#E5DEFF",     // Soft Purple
  other: "#8B5CF6",         // Vivid Purple
};

export function SalesBreakdown({ salesData }: SalesBreakdownProps) {
  // Transform weekly sales data into category breakdown with values adding up to 100%
  const pieData = [
    { name: "Memberships", value: 35 },
    { name: "Packages", value: 25 },
    { name: "Products", value: 20 },
    { name: "Appointments", value: 10 },
    { name: "Gift Cards", value: 7 },
    { name: "Other", value: 3 },
  ];

  const CustomLegend = () => {
    const midPoint = Math.ceil(pieData.length / 2);
    const firstColumn = pieData.slice(0, midPoint);
    const secondColumn = pieData.slice(midPoint);

    const LegendColumn = ({ items }: { items: typeof pieData }) => (
      <div className="space-y-2">
        {items.map((item) => (
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
      </div>
    );

    return (
      <div className="flex gap-8">
        <LegendColumn items={firstColumn} />
        <LegendColumn items={secondColumn} />
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