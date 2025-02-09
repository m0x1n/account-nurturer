import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { checkEmailStatus, updateUserEmail, validateEmail } from "@/utils/emailUtils";
import { supabase } from "@/integrations/supabase/client";

interface UseEmailStepProps {
  formData: { email: string };
  updateFormData: (data: { email: string }) => void;
  onNext: () => void;
  setStep: (step: number) => void;
  setCompletedSteps: (steps: { email: boolean; phone: boolean; personalDetails: boolean; business: boolean }) => void;
}

export const useEmailStep = ({ 
  formData, 
  updateFormData, 
  onNext, 
  setStep, 
  setCompletedSteps 
}: UseEmailStepProps) => {
  const [email, setEmail] = useState(formData.email);
  const [showSignIn, setShowSignIn] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkUserProgress = async (email: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingUser) {
      const completedSteps = {
        email: true,
        phone: existingUser.phone_verified || false,
        personalDetails: !!(existingUser.first_name && existingUser.last_name),
        business: false
      };

      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', existingUser.id)
        .single();

      completedSteps.business = !!business;
      setCompletedSteps(completedSteps);

      let resumeStep = 1;
      if (completedSteps.business) resumeStep = 5;
      else if (completedSteps.personalDetails) resumeStep = 4;
      else if (completedSteps.phone) resumeStep = 3;
      else if (completedSteps.email) resumeStep = 2;

      setStep(resumeStep);
      updateFormData({ email });
      onNext();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const emailExists = await checkEmailStatus(email);

      if (emailExists) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('completed_onboarding')
            .eq('id', user.id)
            .maybeSingle();

          if (profile?.completed_onboarding) {
            setShowSignIn(true);
            return;
          }
        } else {
          // If no user is logged in but email exists, show sign in option
          setShowSignIn(true);
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.email === email) {
          await checkUserProgress(email);
          return;
        }

        try {
          await updateUserEmail(email);
          toast({
            title: "Verification Email Sent",
            description: "Please check your inbox to verify your new email address. You can continue with the setup while waiting.",
          });
          updateFormData({ email });
          onNext();
        } catch (error: any) {
          if (error.message === "This email is already in use") {
            await checkUserProgress(email);
            return;
          }
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // If no user is logged in, just proceed with the email
        updateFormData({ email });
        onNext();
      }
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: "An error occurred while checking email status",
        variant: "destructive",
      });
    }
  };

  return {
    email,
    setEmail,
    handleSubmit,
    showSignIn
  };
};