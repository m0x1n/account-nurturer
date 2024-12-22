import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Service {
  id: string;
  name: string;
}

interface ServicesProps {
  services?: Service[];
  selectedServices: string[];
  applyToAllServices: boolean;
  onServiceToggle: (serviceId: string) => void;
  onApplyToAllChange: (value: boolean) => void;
  readOnly?: boolean;
}

export function ServicesSection({
  services,
  selectedServices,
  applyToAllServices,
  onServiceToggle,
  onApplyToAllChange,
  readOnly,
}: ServicesProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Discounted Services</Label>
      <div className={`flex gap-2 ${readOnly ? 'pointer-events-none' : ''}`}>
        <button
          onClick={() => onApplyToAllChange(true)}
          className={`px-3 py-1.5 rounded text-sm ${
            applyToAllServices ? "bg-primary text-white" : "bg-secondary"
          }`}
        >
          All Services
        </button>
        <button
          onClick={() => onApplyToAllChange(false)}
          className={`px-3 py-1.5 rounded text-sm ${
            !applyToAllServices ? "bg-primary text-white" : "bg-secondary"
          }`}
        >
          Specific Services
        </button>
      </div>
      {!applyToAllServices && services && (
        <div className={`grid grid-cols-2 gap-2 ${readOnly ? 'pointer-events-none' : ''}`}>
          {services.map((service) => (
            <div key={service.id} className="flex items-center gap-2">
              <Switch
                checked={selectedServices.includes(service.id)}
                onCheckedChange={() => onServiceToggle(service.id)}
                disabled={readOnly}
              />
              <Label>{service.name}</Label>
            </div>
          ))}
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        Your discount settings for excluded services will still apply.
      </p>
    </div>
  );
}