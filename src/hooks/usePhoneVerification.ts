import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendVerificationCode, verifyPhoneNumber } from "@/utils/phoneVerification";
import { supabase } from "@/integrations/supabase/client";

export const usePhoneVerification = (email: string, onSuccess: () => void) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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
      await sendVerificationCode(phone, email);
      
      toast({
        title: "Verification Code Sent",
        description: "Please check your phone for the verification code",
      });
      setShowOtp(true);
    } catch (error: any) {
      console.error('Error in phone verification:', error);
      let errorMessage = error.message;
      
      if (error.message.includes('rate_limit')) {
        errorMessage = 'For security purposes, please wait a moment before trying again';
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
    handleSendOtp,
    handleVerifyOtp,
  };
};