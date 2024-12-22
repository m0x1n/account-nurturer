import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CompletionStepProps {
  formData: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    businessName: string;
  };
  onNext: () => void;
  onBack: () => void;
}

const CompletionStep = ({ formData, onNext, onBack }: CompletionStepProps) => {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Aboard!</h2>
        <p className="text-gray-500">
          Thanks for joining us, {formData.firstName}! Your account has been created successfully.
        </p>
      </div>
      <Alert variant="warning" className="text-left">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please verify your email address to fully enable your account. Check your inbox for the verification link.
        </AlertDescription>
      </Alert>
      <div className="space-y-4">
        <div className="text-sm text-gray-500">
          <p>Email: {formData.email}</p>
          <p>Phone: {formData.phone}</p>
          {formData.businessName && <p>Business: {formData.businessName}</p>}
        </div>
      </div>
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;