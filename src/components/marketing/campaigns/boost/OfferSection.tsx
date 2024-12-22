import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OfferProps {
  discountType: string;
  discountValue: string;
  onDiscountTypeChange: (type: string) => void;
  onDiscountValueChange: (value: string) => void;
  readOnly?: boolean;
}

export function OfferSection({
  discountType,
  discountValue,
  onDiscountTypeChange,
  onDiscountValueChange,
  readOnly,
}: OfferProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Offer</Label>
      <div className={`flex gap-2 ${readOnly ? 'pointer-events-none' : ''}`}>
        {["percent", "amount"].map((type) => (
          <button
            key={type}
            onClick={() => onDiscountTypeChange(type)}
            className={`px-3 py-1.5 rounded text-sm capitalize ${
              discountType === type
                ? "bg-primary text-white"
                : "bg-secondary"
            }`}
          >
            {type === "percent" ? "Percent Off" : "Money Off"}
          </button>
        ))}
      </div>
      {(discountType === "percent" || discountType === "amount") && (
        <div className={`flex items-center gap-2 ${readOnly ? 'pointer-events-none' : ''}`}>
          <Input
            type="number"
            value={discountValue}
            onChange={(e) => onDiscountValueChange(e.target.value)}
            className="w-20"
            min="0"
            disabled={readOnly}
          />
          <span className="text-sm text-muted-foreground">
            {discountType === "percent" ? "% off" : "$ off"}
          </span>
        </div>
      )}
    </div>
  );
}