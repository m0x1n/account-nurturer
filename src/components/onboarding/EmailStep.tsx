import { useState } from "react";
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
  const { toast } = useToast();

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

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // If the email hasn't changed, just proceed
      if (user.email === email) {
        updateFormData({ email });
        onNext();
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
            toast({
              title: "Email Already Registered",
              description: "This email is already in use. Please use a different email address or contact support if you think this is a mistake.",
              variant: "destructive",
            });
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