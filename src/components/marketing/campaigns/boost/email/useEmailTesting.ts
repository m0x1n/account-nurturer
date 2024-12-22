import { useToast } from "@/hooks/use-toast";

export const useEmailTesting = () => {
  const { toast } = useToast();

  const handleTestEmail = async (
    testEmail: string,
    targetingOption: string,
    daysThreshold: string,
    discountType: string,
    discountValue: string,
    applyToAllServices: boolean,
    selectedServices: string[]
  ) => {
    if (!testEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/send-test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          campaign: "boost",
          settings: {
            targeting: { type: targetingOption, daysThreshold },
            discount: { type: discountType, value: discountValue },
            services: applyToAllServices ? "all" : selectedServices,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to send test email");

      toast({
        title: "Test Email Sent",
        description: "Please check your inbox for the test email",
      });
    } catch (error) {
      console.error("Error sending test email:", error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    }
  };

  return { handleTestEmail };
};