import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendVerificationCode, verifyPhoneNumber } from "@/utils/phoneVerification";
import { supabase } from "@/integrations/supabase/client";

export const usePhoneVerification = (email: string, onSuccess: () => void) => {
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
      await sendVerificationCode(phone, email);
      
      toast({
        title: "Verification Code Sent",
        description: "Please check your phone for the verification code",
      });
      setShowOtp(true);
    } catch (error: any) {
      console.error('Error in phone verification:', error);
      let errorMessage = error.message;
      let cooldown = 0;
      
      if (error.message.includes('rate_limit')) {
        const match = error.message.match(/after (\d+) seconds/);
        if (match && match[1]) {
          cooldown = parseInt(match[1]);
        } else {
          cooldown = 30; // Default cooldown if we can't parse the seconds
        }
        errorMessage = `Please wait ${cooldown} seconds before trying again`;
        setCooldownSeconds(cooldown);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await verifyPhoneNumber(phone, user.id);
        setIsVerified(true);
        onSuccess();
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