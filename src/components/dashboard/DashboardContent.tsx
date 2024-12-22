import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsPanel } from "./NotificationsPanel";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SalesBreakdown } from "./metrics/SalesBreakdown";
import { ClientsBreakdown } from "./metrics/ClientsBreakdown";
import { CapacityBreakdown } from "./metrics/CapacityBreakdown";

const salesData = [
  { name: "Mon", sales: 15000 },
  { name: "Tue", sales: 25000 },
  { name: "Wed", sales: 18000 },
  { name: "Thu", sales: 22000 },
  { name: "Fri", sales: 28000 },
  { name: "Sat", sales: 12000 },
  { name: "Sun", sales: 13201 },
];

const clientsData = [
  { name: "New", value: 16, percentage: "18%" },
  { name: "Existing", value: 77, percentage: "82%" },
];

const averageClientSpend = {
  amount: "$21.60",
  label: "Average client spend"
};

const capacityData = [
  { name: "Used", value: 24 },
  { name: "Available", value: 76 },
];

const chartConfig = {
  sales: {
    color: "#0ea5e9",
  },
  clients: {
    color: "#10b981",
  },
  capacity: {
    color: "#6366f1",
  },
  new: {
    color: "#f97316",
  },
  existing: {
    color: "#10b981",
  },
  used: {
    color: "#6366f1",
  },
  available: {
    color: "#e2e8f0",
  },
};

export function DashboardContent() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'sales' | 'clients' | 'capacity'>('sales');

  const renderBreakdown = () => {
    switch (selectedMetric) {
      case 'sales':
        return <SalesBreakdown salesData={salesData} chartConfig={chartConfig} />;
      case 'clients':
        return <ClientsBreakdown clientsData={clientsData} averageClientSpend={averageClientSpend} />;
      case 'capacity':
        return <CapacityBreakdown capacityData={capacityData} />;
    }
  };

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
          <Card 
            className={`cursor-pointer transition-all ${selectedMetric === 'sales' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedMetric('sales')}
          >
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
          <Card 
            className={`cursor-pointer transition-all ${selectedMetric === 'clients' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedMetric('clients')}
          >
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
          <Card 
            className={`cursor-pointer transition-all ${selectedMetric === 'capacity' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedMetric('capacity')}
          >
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

        <div className="mt-8">
          {renderBreakdown()}
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
      </div>

      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </main>
  );
}