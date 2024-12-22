import { Link } from "lucide-react";

export default function QuickLinks() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Quick Links</h1>
      </div>
      <div className="max-w-4xl mx-auto text-center mt-12">
        <p className="text-muted-foreground">
          Quick access links coming soon...
        </p>
      </div>
    </div>
  );
}