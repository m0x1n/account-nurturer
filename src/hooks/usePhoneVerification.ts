import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendPhoneVerification, verifyPhoneOtp } from "@/utils/phoneVerification";

interface UsePhoneVerificationProps {
  onSuccess: () => void;
}

export const usePhoneVerification = ({ onSuccess }: UsePhoneVerificationProps) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

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
    if (isProcessing || cooldownSeconds > 0) return;

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
      await sendPhoneVerification(supabase, phone);
      toast({
        title: "Verification Code Sent",
        description: "Please check your phone for the verification code",
      });
      setShowOtp(true);
    } catch (error: any) {
      console.error('Error in phone verification:', error);
      
      let cooldown = 0;
      let errorMessage = error.message;
      
      if (error.message.includes('rate_limit')) {
        try {
          const bodyJson = JSON.parse(error.body || '{}');
          const message = bodyJson.message || error.message;
          const match = message.match(/after (\d+) seconds/);
          cooldown = match && match[1] ? parseInt(match[1]) : 60;
          errorMessage = `Please wait ${cooldown} seconds before trying again`;
          setCooldownSeconds(cooldown);
        } catch (parseError) {
          cooldown = 60;
          errorMessage = `Please wait ${cooldown} seconds before trying again`;
          setCooldownSeconds(cooldown);
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
      await verifyPhoneOtp(supabase, phone, otp);
      toast({
        title: "Success",
        description: "Phone number verified successfully",
      });
      setIsVerified(true);
      onSuccess();
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

  return {
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
  };
};