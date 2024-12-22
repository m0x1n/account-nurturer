import { Button } from "@/components/ui/button";
import { useBusinessServices } from "@/hooks/useBusinessServices";
import { useBusinessData } from "@/hooks/useBusinessData";
import { TargetingSection } from "./boost/TargetingSection";
import { ScheduleSection } from "./boost/ScheduleSection";
import { OfferSection } from "./boost/OfferSection";
import { ServicesSection } from "./boost/ServicesSection";
import { CampaignNameSection } from "./boost/CampaignNameSection";
import { PreviewSection } from "./boost/PreviewSection";
import { useBoostCampaign } from "./boost/useBoostCampaign";

interface BoostCampaignConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: (isActive: boolean) => void;
}

export function BoostCampaignConfig({
  isOpen,
  onClose,
  onSaveSuccess,
}: BoostCampaignConfigProps) {
  const { data: business } = useBusinessData();
  const { data: services } = useBusinessServices(business?.id);

  const {
    campaignName,
    setCampaignName,
    targetingOption,
    setTargetingOption,
    daysThreshold,
    setDaysThreshold,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    selectedServices,
    setSelectedServices,
    applyToAllServices,
    setApplyToAllServices,
    testEmail,
    setTestEmail,
    showPreview,
    setShowPreview,
    scheduledDays,
    handleDayToggle,
    handleServiceToggle,
    handleTestEmail,
    handleSave,
  } = useBoostCampaign(business, onClose, onSaveSuccess);

  if (!isOpen) return null;

  return (
    <div className="bg-background rounded-lg border p-6 space-y-8">
      <div className="space-y-8">
        <CampaignNameSection
          discountType={discountType}
          discountValue={discountValue}
          onNameChange={setCampaignName}
        />

        <TargetingSection
          targetingOption={targetingOption}
          daysThreshold={daysThreshold}
          onTargetingChange={setTargetingOption}
          onDaysChange={setDaysThreshold}
        />

        <ScheduleSection
          days={scheduledDays}
          onDayToggle={handleDayToggle}
        />

        <OfferSection
          discountType={discountType}
          discountValue={discountValue}
          onDiscountTypeChange={setDiscountType}
          onDiscountValueChange={setDiscountValue}
        />

        <ServicesSection
          services={services}
          selectedServices={selectedServices}
          applyToAllServices={applyToAllServices}
          onServiceToggle={handleServiceToggle}
          onApplyToAllChange={setApplyToAllServices}
        />

        <PreviewSection
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          campaignName={campaignName}
          discountValue={discountValue}
          discountType={discountType}
          testEmail={testEmail}
          setTestEmail={setTestEmail}
          onTestEmail={handleTestEmail}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Campaign
        </Button>
      </div>
    </div>
  );
}