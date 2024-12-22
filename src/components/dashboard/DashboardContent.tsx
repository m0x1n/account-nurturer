import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { NotificationsPanel } from "./NotificationsPanel";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const chartData = [
  { name: "Mon", clients: 4 },
  { name: "Tue", clients: 7 },
  { name: "Wed", clients: 5 },
  { name: "Thu", clients: 6 },
  { name: "Fri", clients: 8 },
  { name: "Sat", clients: 3 },
  { name: "Sun", clients: 2 },
];

const chartConfig = {
  clients: {
    color: "#0ea5e9",
  },
};

export function DashboardContent() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Insights snapshot</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
            </Button>
            <SidebarTrigger />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                SALES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$133,201</div>
              <p className="text-xs text-green-500">+3% since last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                CLIENTS SERVED
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">293</div>
              <p className="text-xs text-green-500">+3% since last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                CAPACITY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24%</div>
              <p className="text-xs text-green-500">+1% since last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Schedule coming soon...</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Clients at Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Client risk analysis coming soon...</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Clients Served Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={chartData}>
                  <ChartTooltip />
                  <BarChart.Bar
                    dataKey="clients"
                    fill="var(--color-clients)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </main>
  );
}