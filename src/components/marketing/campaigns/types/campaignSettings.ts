import { Json } from "@/integrations/supabase/types";

export interface LastMinuteSettings {
  sendEmail: boolean;
  sendSMS: boolean;
  enableDiscounts: boolean;
  discountType: "percent" | "money";
  discountValue: number;
  [key: string]: string | number | boolean; // Add index signature for JSON compatibility
}

export interface BoostSettings {
  targeting: {
    type: string;
    daysThreshold: number;
  };
  discount: {
    type: string;
    value: number;
  };
  services: string[] | "all";
  schedule?: {
    date: string;
    enabled: boolean;
  }[];
  [key: string]: any; // Add index signature for JSON compatibility
}

export type CampaignSettings = LastMinuteSettings | BoostSettings;