import { Progress } from "@/components/ui/progress";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: {
    email: boolean;
    phone: boolean;
    personalDetails: boolean;
    business: boolean;
  };
}

const OnboardingProgress = ({ currentStep, totalSteps, completedSteps }: OnboardingProgressProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="space-y-2 mb-6">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-gray-500">
        <div className={completedSteps.email ? "text-green-600 font-medium" : ""}>Email</div>
        <div className={completedSteps.phone ? "text-green-600 font-medium" : ""}>Phone</div>
        <div className={completedSteps.personalDetails ? "text-green-600 font-medium" : ""}>Details</div>
        <div className={completedSteps.business ? "text-green-600 font-medium" : ""}>Business</div>
      </div>
    </div>
  );
};

export default OnboardingProgress;