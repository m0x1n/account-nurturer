import { useEmailTesting } from "./email/useEmailTesting";
import { useScheduling } from "./schedule/useScheduling";
import { useCampaignState } from "./hooks/useCampaignState";
import { useCampaignLoader } from "./hooks/useCampaignLoader";
import { useCampaignSaver } from "./hooks/useCampaignSaver";

export const useBoostCampaign = (
  business: any,
  onClose: () => void,
  onSaveSuccess?: (isActive: boolean) => void
) => {
  const { handleTestEmail: handleTestEmailSend } = useEmailTesting();
  const { scheduledDays, handleDayToggle, isBoostStillValid, setScheduledDays } = useScheduling();
  
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
    isActive,
    setIsActive,
  } = useCampaignState();

  useCampaignLoader(business?.id, {
    setCampaignName,
    setTargetingOption,
    setDaysThreshold,
    setDiscountType,
    setDiscountValue,
    setApplyToAllServices,
    setSelectedServices,
    setIsActive,
    setScheduledDays,
  });

  const { handleSave: saveHandler } = useCampaignSaver(business, onClose, onSaveSuccess);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleTestEmail = () => {
    handleTestEmailSend(
      testEmail,
      targetingOption,
      daysThreshold,
      discountType,
      discountValue,
      applyToAllServices,
      selectedServices
    );
  };

  const handleSave = async () => {
    await saveHandler(
      campaignName,
      targetingOption,
      daysThreshold,
      discountType,
      discountValue,
      applyToAllServices,
      selectedServices,
      scheduledDays,
      isBoostStillValid
    );
  };

  return {
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
    isActive,
  };
};