import { BarChart2 } from "lucide-react";

export default function Insights() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Insights</h1>
      </div>
      <div className="max-w-4xl mx-auto text-center mt-12">
        <p className="text-muted-foreground">
          Business insights and analytics coming soon...
        </p>
      </div>
    </div>
  );
}