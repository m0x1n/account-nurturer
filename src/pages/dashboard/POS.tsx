import { ShoppingCart } from "lucide-react";

export default function POS() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Point of Sale</h1>
      </div>
      <div className="max-w-4xl mx-auto text-center mt-12">
        <p className="text-muted-foreground">
          Point of Sale functionality coming soon...
        </p>
      </div>
    </div>
  );
}