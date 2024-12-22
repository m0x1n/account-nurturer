import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardContent() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="container px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Insights snapshot</h1>
          <SidebarTrigger />
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

        {/* Placeholder for future components */}
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
    </main>
  );
}