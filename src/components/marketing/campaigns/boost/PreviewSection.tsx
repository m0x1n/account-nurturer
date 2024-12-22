import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PreviewSectionProps {
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  campaignName: string;
  discountValue: string;
  discountType: string;
  testEmail: string;
  setTestEmail: (email: string) => void;
  onTestEmail: () => void;
  readOnly?: boolean;
}

export function PreviewSection({
  showPreview,
  setShowPreview,
  campaignName,
  discountValue,
  discountType,
  testEmail,
  setTestEmail,
  onTestEmail,
  readOnly,
}: PreviewSectionProps) {
  return (
    <div className="space-y-4">
      {showPreview && (
        <div className="p-4 border rounded-lg bg-muted">
          <h4 className="font-medium mb-2">Campaign Name: {campaignName}</h4>
          <p>
            Your offer: {discountValue}
            {discountType === "percent" ? "% off" : "$ off"} today & tomorrow!
          </p>
        </div>
      )}

      <div className={`flex gap-4 ${readOnly ? 'pointer-events-none' : ''}`}>
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          disabled={readOnly}
        >
          {showPreview ? "Hide Preview" : "View Sample Email"}
        </Button>
        <div className="flex-1 flex items-center gap-2">
          <Input
            type="email"
            placeholder="Enter email for test"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            disabled={readOnly}
          />
          <Button onClick={onTestEmail} disabled={readOnly}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}