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
      // Check if the email is different from the current one
      if (user.email === email) {
        updateFormData({ email });
        onNext();
        return;
      }

      try {
        const { error } = await supabase.auth.updateUser({ email });
        if (error) {
          // Check both error.code and error message for email_exists
          if (error.message.includes("email_exists") || 
              (typeof error === 'object' && 
               'code' in error && 
               error.code === 'email_exists')) {
            toast({
              title: "Error",
              description: "This email is already registered. Please use a different email or contact support if you think this is a mistake.",
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
          description: "Please check your inbox to verify your email address. You can continue with the setup while waiting.",
        });
      } catch (error: any) {
        // Parse error message if it's a JSON string
        let errorMessage = error.message;
        try {
          if (typeof error.body === 'string') {
            const parsedError = JSON.parse(error.body);
            if (parsedError.code === 'email_exists') {
              toast({
                title: "Error",
                description: "This email is already registered. Please use a different email or contact support if you think this is a mistake.",
                variant: "destructive",
              });
              return;
            }
            errorMessage = parsedError.message || error.message;
          }
        } catch (e) {
          // If parsing fails, use the original error message
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
    }

    updateFormData({ email });
    onNext();
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