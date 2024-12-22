import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";

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

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-col gap-2 text-sm">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.value}</span>
            <span className="ml-auto font-medium">{entry.payload.value}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="w-[200px] h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  innerRadius={40}
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
          <div className="flex-1 ml-8">
            <Legend content={<CustomLegend />} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}