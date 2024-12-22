import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CreditCard, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="container px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="cursor-pointer" onClick={() => navigate("/dashboard/settings/business-hours")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set your business operating hours for each day of the week
            </p>
            <Button variant="link" className="mt-2 p-0">
              Configure Hours →
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer" onClick={() => navigate("/dashboard/settings/payment-settings")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure your payment and banking details
            </p>
            <Button variant="link" className="mt-2 p-0">
              Configure Payments →
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer" onClick={() => navigate("/dashboard/settings/booking-link")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Booking Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get your booking link to share with clients
            </p>
            <Button variant="link" className="mt-2 p-0">
              View Link →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;