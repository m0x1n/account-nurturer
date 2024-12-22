import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CampaignNameProps {
  discountType: string;
  discountValue: string;
  onNameChange: (name: string) => void;
  readOnly?: boolean;
}

export function CampaignNameSection({
  discountType,
  discountValue,
  onNameChange,
  readOnly,
}: CampaignNameProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (readOnly) return;
    
    const date = format(new Date(), "MMM d");
    const offerText = discountType === "percent" 
      ? `${discountValue}% Off`
      : `$${discountValue} Off`;
    const suggestedName = `Boost Campaign - ${date} - ${offerText}`;
    setName(suggestedName);
    onNameChange(suggestedName);
  }, [discountType, discountValue, onNameChange, readOnly]);

  const handleNameChange = (value: string) => {
    if (readOnly) return;
    setName(value);
    onNameChange(value);
  };

  return (
    <div className={cn("space-y-4", readOnly && "opacity-75")}>
      <Label className="text-sm font-medium">Campaign Name</Label>
      <Input
        type="text"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Enter campaign name"
        className="w-full"
        readOnly={readOnly}
        disabled={readOnly}
      />
    </div>
  );
}