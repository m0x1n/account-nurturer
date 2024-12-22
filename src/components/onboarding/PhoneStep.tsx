import { useEffect } from "react";
import PhoneForm from "./PhoneForm";
import { usePhoneVerification } from "@/hooks/usePhoneVerification";

interface PhoneStepProps {
  formData: { phone: string; email: string };
  updateFormData: (data: { phone: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

const PhoneStep = ({ formData, updateFormData, onNext, onBack }: PhoneStepProps) => {
  const {
    phone,
    setPhone,
    otp,
    setOtp,
    showOtp,
    setShowOtp,
    isVerified,
    isProcessing,
    cooldownSeconds,
    handleSendOtp,
    handleVerifyOtp,
  } = usePhoneVerification({
    onSuccess: () => {
      updateFormData({ phone });
      onNext();
    },
  });

  useEffect(() => {
    if (formData.phone) {
      setPhone(formData.phone);
    }
  }, [formData.phone]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Verify Your Phone</h2>
        <p className="text-gray-500">We'll send you a verification code</p>
      </div>
      
      <PhoneForm
        phone={phone}
        otp={otp}
        showOtp={showOtp}
        isProcessing={isProcessing}
        cooldownSeconds={cooldownSeconds}
        isVerified={isVerified}
        onPhoneChange={setPhone}
        onOtpChange={setOtp}
        onBack={onBack}
        onNext={onNext}
        onShowOtpBack={() => setShowOtp(false)}
        onSendOtp={handleSendOtp}
        onVerifyOtp={handleVerifyOtp}
      />
    </div>
  );
};

export default PhoneStep;