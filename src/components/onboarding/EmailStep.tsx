import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailStepProps {
  formData: { email: string };
  updateFormData: (data: { email: string }) => void;
  onNext: () => void;
}

const EmailStep = ({ formData, updateFormData, onNext }: EmailStepProps) => {
  const [email, setEmail] = useState(formData.email);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkEmailVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const { data } = await supabase
          .from('profiles')
          .select('email_verified')
          .eq('id', user.id)
          .single();
        
        if (data?.email_verified) {
          setIsVerified(true);
        }
      }
    };
    checkEmailVerification();
  }, []);

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

    // Update email in auth if different
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email !== email) {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox to verify your email address",
      });
    } else if (isVerified) {
      updateFormData({ email });
      onNext();
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
        {isVerified ? "Continue" : "Verify Email"}
      </Button>
    </form>
  );
};

export default EmailStep;