import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EmailStep from "@/components/onboarding/EmailStep";
import PhoneStep from "@/components/onboarding/PhoneStep";
import PersonalDetailsStep from "@/components/onboarding/PersonalDetailsStep";
import BusinessStep from "@/components/onboarding/BusinessStep";
import CompletionStep from "@/components/onboarding/CompletionStep";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const totalSteps = 5;
  const [completedSteps, setCompletedSteps] = useState({
    email: false,
    phone: false,
    personalDetails: false,
    business: false
  });

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    businessName: "",
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Only set the email if there's a session
        if (session?.user?.email) {
          setFormData(prev => ({
            ...prev,
            email: session.user.email,
          }));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Session check error:", error);
        toast({
          title: "Error",
          description: "Failed to check authentication status",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email) {
        setFormData(prev => ({
          ...prev,
          email: session.user.email || "",
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
      setCompletedSteps(prev => {
        switch(step) {
          case 1:
            return { ...prev, email: true };
          case 2:
            return { ...prev, phone: true };
          case 3:
            return { ...prev, personalDetails: true };
          case 4:
            return { ...prev, business: true };
          default:
            return prev;
        }
      });
    } else {
      toast({
        title: "Welcome!",
        description: "Your account has been set up. Let's get started!",
      });
      navigate("/dashboard");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <EmailStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            setStep={setStep}
            setCompletedSteps={setCompletedSteps}
          />
        );
      case 2:
        return (
          <PhoneStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <PersonalDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <BusinessStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <CompletionStep
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <OnboardingProgress
          currentStep={step}
          totalSteps={totalSteps}
          completedSteps={completedSteps}
        />
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;