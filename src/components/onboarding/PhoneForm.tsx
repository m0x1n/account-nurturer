import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneFormProps {
  phone: string;
  otp: string;
  showOtp: boolean;
  isProcessing: boolean;
  cooldownSeconds: number;
  isVerified: boolean;
  onPhoneChange: (phone: string) => void;
  onOtpChange: (otp: string) => void;
  onBack: () => void;
  onNext: () => void;
  onShowOtpBack: () => void;
  onSendOtp: (e: React.FormEvent) => void;
  onVerifyOtp: (e: React.FormEvent) => void;
}

const PhoneForm = ({
  phone,
  otp,
  showOtp,
  isProcessing,
  cooldownSeconds,
  isVerified,
  onPhoneChange,
  onOtpChange,
  onBack,
  onNext,
  onShowOtpBack,
  onSendOtp,
  onVerifyOtp,
}: PhoneFormProps) => {
  if (!showOtp) {
    return (
      <form onSubmit={onSendOtp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
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
    );
  }

  return (
    <form onSubmit={onVerifyOtp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Verification code</Label>
        <Input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => onOtpChange(e.target.value)}
          placeholder="Enter verification code"
          className="w-full"
          disabled={isProcessing}
        />
      </div>
      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onShowOtpBack} 
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
  );
};

export default PhoneForm;