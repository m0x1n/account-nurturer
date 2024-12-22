import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PhoneStepProps {
  formData: { phone: string; email: string };
  updateFormData: (data: { phone: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

const PhoneStep = ({ formData, updateFormData, onNext, onBack }: PhoneStepProps) => {
  const [phone, setPhone] = useState(formData.phone);
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    try {
      // First, sign up the user with email if they don't have a session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: crypto.randomUUID(), // Generate a random password
        });

        if (signUpError) {
          toast({
            title: "Error",
            description: signUpError.message,
            variant: "destructive",
          });
          return;
        }
      }

      // Now update the phone number
      const { error: updateError } = await supabase.auth.updateUser({ phone });
      if (updateError) {
        toast({
          title: "Error",
          description: updateError.message,
          variant: "destructive",
        });
        return;
      }

      // Simulate sending OTP
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
      setShowOtp(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive",
      });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, verify the OTP with Supabase
      // For now, we'll simulate verification
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ phone, phone_verified: true })
          .eq('id', user.id);

        if (error) {
          toast({
            title: "Error",
            description: "Failed to verify phone number",
            variant: "destructive",
          });
          return;
        }

        updateFormData({ phone });
        onNext();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify phone number",
        variant: "destructive",
      });
    }
  };

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
            />
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            {isVerified ? (
              <Button type="button" onClick={onNext} className="flex-1">
                Continue
              </Button>
            ) : (
              <Button type="submit" className="flex-1">
                Send Code
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
            />
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => setShowOtp(false)} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Verify
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PhoneStep;