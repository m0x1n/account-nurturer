import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface EmailStepProps {
  formData: { email: string };
  updateFormData: (data: { email: string }) => void;
  onNext: () => void;
  setStep: (step: number) => void;
  setCompletedSteps: (steps: { email: boolean; phone: boolean; personalDetails: boolean; business: boolean }) => void;
}

const EmailStep = ({ formData, updateFormData, onNext, setStep, setCompletedSteps }: EmailStepProps) => {
  const [email, setEmail] = useState(formData.email);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkUserProgress = async (email: string) => {
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (existingUser) {
      const completedSteps = {
        email: true,
        phone: existingUser.phone_verified || false,
        personalDetails: !!(existingUser.first_name && existingUser.last_name),
        business: false
      };

      // Check if user has a business
      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', existingUser.id)
        .single();

      completedSteps.business = !!business;

      // Set completed steps
      setCompletedSteps(completedSteps);

      // Determine which step to resume from
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
    if (!email.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      // First check if the email exists in auth system
      const { data: emailExists, error: checkError } = await supabase
        .rpc('check_email_exists', { email_to_check: email });

      if (checkError) {
        toast({
          title: "Error",
          description: "Failed to check email status",
          variant: "destructive",
        });
        return;
      }

      if (emailExists) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('completed_onboarding')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .maybeSingle();

        if (profile?.completed_onboarding) {
          // User exists and has previously logged in
          toast({
            title: "Account Exists",
            description: "This email is already associated with an account. Please sign in.",
          });
          navigate("/login");
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // If the email hasn't changed, check progress and proceed
        if (user.email === email) {
          await checkUserProgress(email);
          return;
        }

        try {
          const { error } = await supabase.auth.updateUser({ email });
          if (error) {
            // Check if it's an email_exists error from the error object
            const isEmailExists = error.message?.includes('email_exists') || 
                              (error as any)?.code === 'email_exists';

            if (isEmailExists) {
              toast({
                title: "Email Already Registered",
                description: "This email is already in use. Please use a different email address or contact support if you think this is a mistake.",
                variant: "destructive",
              });
              return;
            }

            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Verification Email Sent",
            description: "Please check your inbox to verify your new email address. You can continue with the setup while waiting.",
          });
          updateFormData({ email });
          onNext();
        } catch (error: any) {
          // Handle JSON error response
          try {
            const errorBody = typeof error.body === 'string' ? JSON.parse(error.body) : error;
            const isEmailExists = errorBody.code === 'email_exists';

            if (isEmailExists) {
              await checkUserProgress(email);
              return;
            }

            toast({
              title: "Error",
              description: errorBody.message || error.message,
              variant: "destructive",
            });
          } catch {
            // If JSON parsing fails, show the original error
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An error occurred while checking email status",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
        <p className="text-gray-500">Let's start with your email address</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
};

export default EmailStep;