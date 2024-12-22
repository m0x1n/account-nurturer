import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
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
    setIsVerified,
    isProcessing,
    cooldownSeconds,
    handleSendOtp,
    handleVerifyOtp,
  } = usePhoneVerification(formData.email, () => {
    updateFormData({ phone });
    onNext();
  });

  useEffect(() => {
    const checkPhoneVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.phone) {
        const { data } = await supabase
          .from('profiles')
          .select('phone_verified')
          .eq('id', user.id)
          .single();
        
        if (data?.phone_verified) {
          setIsVerified(true);
        }
      }
    };
    checkPhoneVerification();
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Verify Your Phone</h2>
        <p className="text-gray-500">We'll send you a verification code</p>
      </div>
      
      {!showOtp ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full"
              disabled={isProcessing || cooldownSeconds > 0}
            />
          </div>
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack} 
              className="flex-1"
              disabled={isProcessing}
            >
              Back
            </Button>
            {isVerified ? (
              <Button 
                type="button" 
                onClick={onNext} 
                className="flex-1"
                disabled={isProcessing}
              >
                Continue
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isProcessing || cooldownSeconds > 0}
              >
                {cooldownSeconds > 0 
                  ? `Wait ${cooldownSeconds}s` 
                  : isProcessing 
                    ? "Sending..." 
                    : "Send Code"}
              </Button>
            )}
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification code</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter verification code"
              className="w-full"
              disabled={isProcessing}
            />
          </div>
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowOtp(false)} 
              className="flex-1"
              disabled={isProcessing}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PhoneStep;