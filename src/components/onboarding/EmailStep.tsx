import EmailForm from "./EmailForm";
import { useEmailStep } from "@/hooks/useEmailStep";

interface EmailStepProps {
  formData: { email: string };
  updateFormData: (data: { email: string }) => void;
  onNext: () => void;
  setStep: (step: number) => void;
  setCompletedSteps: (steps: { email: boolean; phone: boolean; personalDetails: boolean; business: boolean }) => void;
}

const EmailStep = (props: EmailStepProps) => {
  const { email, setEmail, handleSubmit, showSignIn } = useEmailStep({
    formData: props.formData,
    updateFormData: props.updateFormData,
    onNext: props.onNext,
    setStep: props.setStep,
    setCompletedSteps: props.setCompletedSteps
  });

  return (
    <EmailForm
      email={email}
      onEmailChange={setEmail}
      onSubmit={handleSubmit}
      showSignIn={showSignIn}
    />
  );
};

export default EmailStep;