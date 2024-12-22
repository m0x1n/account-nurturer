export interface LastMinuteFormValues {
  isEnabled: boolean;
  sendEmail: boolean;
  sendSMS: boolean;
  enableDiscounts: boolean;
  discountType: "percent" | "money";
  discountValue: number;
  customSubject: boolean;
  customMessage: boolean;
  subjectText?: string;
  messageText?: string;
}