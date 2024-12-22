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
  const [isProcessing, setIsProcessing] = useState(false);
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
    if (isProcessing) return;

    if (!phone) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // First check if we already have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session, check if the email exists
        const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
          filters: {
            email: formData.email
          }
        });

        if (getUserError) {
          console.error('Error checking user:', getUserError);
          throw new Error('Failed to check user status');
        }

        // If user doesn't exist, create them
        if (!users || users.length === 0) {
          const { error: signUpError } = await supabase.auth.signInWithOtp({
            email: formData.email,
          });

          if (signUpError) {
            if (signUpError.message.includes('rate_limit')) {
              toast({
                title: "Please wait",
                description: "For security purposes, please wait a moment before trying again",
                variant: "destructive",
              });
              return;
            }
            throw signUpError;
          }

          toast({
            title: "Verification email sent",
            description: "Please check your email to verify your account",
          });
        }
      }

      // Now update the phone number
      const { error: updateError } = await supabase.auth.updateUser({ phone });
      if (updateError) {
        throw updateError;
      }

      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
      setShowOtp(true);
    } catch (error: any) {
      console.error('Error in phone verification:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (!otp) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ phone, phone_verified: true })
          .eq('id', user.id);

        if (error) throw error;

        updateFormData({ phone });
        onNext();
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to verify phone number",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
              disabled={isProcessing}
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
                disabled={isProcessing}
              >
                {isProcessing ? "Sending..." : "Send Code"}
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