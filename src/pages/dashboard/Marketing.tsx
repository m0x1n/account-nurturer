import { Mail } from "lucide-react";

export default function Marketing() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Marketing</h1>
      </div>
      <div className="max-w-4xl mx-auto text-center mt-12">
        <p className="text-muted-foreground">
          Marketing tools and campaigns coming soon...
        </p>
      </div>
    </div>
  );
}