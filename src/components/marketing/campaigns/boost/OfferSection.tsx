import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
    <div className={cn("space-y-4", readOnly && "opacity-75")}>
      <Label className="text-sm font-medium">Offer</Label>
      <div className="flex gap-2">
        {["percent", "amount"].map((type) => (
          <button
            key={type}
            onClick={() => !readOnly && onDiscountTypeChange(type)}
            className={cn(
              "px-3 py-1.5 rounded text-sm capitalize",
              discountType === type
                ? "bg-primary text-white"
                : "bg-secondary",
              readOnly && "cursor-default opacity-75"
            )}
            disabled={readOnly}
          >
            {type === "percent" ? "Percent Off" : "Money Off"}
          </button>
        ))}
      </div>
      {(discountType === "percent" || discountType === "amount") && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={discountValue}
            onChange={(e) => onDiscountValueChange(e.target.value)}
            className="w-20"
            min="0"
            readOnly={readOnly}
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