export interface LastMinuteSettings {
  sendEmail: boolean;
  sendSMS: boolean;
  enableDiscounts: boolean;
  discountType: "percent" | "money";
  discountValue: number;
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
}

export type CampaignSettings = LastMinuteSettings | BoostSettings;