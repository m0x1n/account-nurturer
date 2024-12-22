import { useState } from "react";

export const useCampaignState = () => {
  const [campaignName, setCampaignName] = useState("");
  const [targetingOption, setTargetingOption] = useState("all");
  const [daysThreshold, setDaysThreshold] = useState("30");
  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [applyToAllServices, setApplyToAllServices] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isActive, setIsActive] = useState(false);

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
    isActive,
    setIsActive,
  };
};