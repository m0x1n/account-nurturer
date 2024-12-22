import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import EmailStep from "@/components/onboarding/EmailStep";
import PhoneStep from "@/components/onboarding/PhoneStep";
import PersonalDetailsStep from "@/components/onboarding/PersonalDetailsStep";
import BusinessStep from "@/components/onboarding/BusinessStep";
import CompletionStep from "@/components/onboarding/CompletionStep";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    businessName: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const totalSteps = 5;

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      // Handle completion
      toast({
        title: "Onboarding Complete!",
        description: "Welcome to the platform. Let's get started!",
      });
      navigate("/dashboard");
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <EmailStep formData={formData} updateFormData={updateFormData} onNext={nextStep} />;
      case 2:
        return <PhoneStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <PersonalDetailsStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <BusinessStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <CompletionStep formData={formData} onNext={nextStep} onBack={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <Progress value={(step / totalSteps) * 100} className="h-2" />
            <p className="text-sm text-gray-500 mt-2">
              Step {step} of {totalSteps}
            </p>
          </div>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;