import { Package, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServicesList } from "@/components/services/ServicesList";
import { useState } from "react";
import { AddServiceDialog } from "@/components/services/AddServiceDialog";

export default function ServicesAndProducts() {
  const [showAddService, setShowAddService] = useState(false);

  return (
    <div className="p-6 bg-[#FAFAFA] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-[#0095F6]" />
          <h1 className="text-2xl font-bold text-[#262626]">Services & Products</h1>
        </div>
        <Button 
          onClick={() => setShowAddService(true)}
          className="bg-[#0095F6] hover:bg-[#0095F6]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="bg-white border-[#DBDBDB]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#262626]">
              <Package className="h-5 w-5 text-[#0095F6]" />
              Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ServicesList />
          </CardContent>
        </Card>
      </div>

      <AddServiceDialog 
        open={showAddService} 
        onOpenChange={setShowAddService}
      />
    </div>
  );
}