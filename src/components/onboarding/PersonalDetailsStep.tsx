import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PersonalDetailsStepProps {
  formData: { firstName: string; lastName: string };
  updateFormData: (data: { firstName: string; lastName: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

const PersonalDetailsStep = ({ formData, updateFormData, onNext, onBack }: PersonalDetailsStepProps) => {
  const [firstName, setFirstName] = useState(formData.firstName);
  const [lastName, setLastName] = useState(formData.lastName);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "No user found",
          variant: "destructive",
        });
        return;
      }

      // Update the user's metadata in auth.users
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { first_name: firstName, last_name: lastName }
      });

      if (metadataError) {
        toast({
          title: "Error",
          description: "Failed to update user metadata",
          variant: "destructive",
        });
        return;
      }

      // Update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          first_name: firstName, 
          last_name: lastName,
        })
        .eq('id', user.id);

      if (profileError) {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return;
      }

      updateFormData({ firstName, lastName });
      onNext();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    updateFormData({ firstName: value, lastName });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    updateFormData({ firstName, lastName: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        <p className="text-gray-500">Tell us a bit about yourself</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
            placeholder="John"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={handleLastNameChange}
            placeholder="Doe"
            className="w-full"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  );
};

export default PersonalDetailsStep;