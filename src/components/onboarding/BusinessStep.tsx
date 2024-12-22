import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BusinessStepProps {
  formData: { businessName: string };
  updateFormData: (data: { businessName: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

const BusinessStep = ({ formData, updateFormData, onNext, onBack }: BusinessStepProps) => {
  const [businessName, setBusinessName] = useState(formData.businessName);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName) {
      toast({
        title: "Error",
        description: "Please enter your business name or click Skip",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('businesses')
        .insert([
          { 
            name: businessName,
            owner_id: user.id,
            status: 'pending'
          }
        ]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create business",
          variant: "destructive",
        });
        return;
      }

      updateFormData({ businessName });
      onNext();
    }
  };

  const handleSkip = () => {
    updateFormData({ businessName: "" });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Business Details</h2>
        <p className="text-gray-500">Tell us about your business (optional)</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="businessName">Business name</Label>
        <Input
          id="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Your Business Name"
          className="w-full"
        />
      </div>
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="button" variant="outline" onClick={handleSkip} className="flex-1">
          Skip
        </Button>
        <Button type="submit" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  );
};

export default BusinessStep;