import { Plus } from "lucide-react";

export default function AddOns() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Add-on Services</h1>
      </div>
      <div className="max-w-4xl mx-auto text-center mt-12">
        <p className="text-muted-foreground">
          Additional services and features coming soon...
        </p>
      </div>
    </div>
  );
}