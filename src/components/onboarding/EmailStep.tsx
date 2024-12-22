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
}

const EmailStep = ({ formData, updateFormData, onNext }: EmailStepProps) => {
  const [email, setEmail] = useState(formData.email);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      // Check if the email exists in auth.users
      const { data: userExists, error: checkError } = await supabase.rpc('check_email_exists', {
        email_to_check: email
      });
      
      if (checkError) {
        toast({
          title: "Error",
          description: "Failed to check email status",
          variant: "destructive",
        });
        return;
      }

      if (userExists) {
        // Check if the user has completed onboarding by checking profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (profileError) {
          // If there's an error or no profile found, let them continue with onboarding
          updateFormData({ email });
          onNext();
          return;
        }

        if (profile?.first_name && profile?.last_name) {
          // User has completed onboarding, redirect to login
          toast({
            title: "Account Exists",
            description: "This email is already registered. Please sign in.",
          });
          navigate('/login');
          return;
        }
      }

      // Either new email or existing user without completed onboarding
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (user) {
        // User is logged in, update their email if it's different
        if (user.email !== email) {
          const { error: updateError } = await supabase.auth.updateUser({ email });
          if (updateError) {
            toast({
              title: "Error",
              description: updateError.message,
              variant: "destructive",
            });
            return;
          }
          toast({
            title: "Verification Email Sent",
            description: "Please check your inbox to verify your new email address. You can continue with the setup while waiting.",
          });
        }
      }

      updateFormData({ email });
      onNext();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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