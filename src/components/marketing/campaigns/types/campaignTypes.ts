export interface CampaignMetrics {
  users_targeted: number;
  percent_opened: number;
  percent_clicked: number;
  percent_unsubscribed: number;
}

export interface ScheduleDay {
  date: string;
  enabled: boolean;
  formatted: string;
}

export interface CampaignSettings {
  schedule?: {
    date: string;
    enabled: boolean;
  }[];
  targeting?: {
    type: string;
    daysThreshold: number;
  };
  discount?: {
    type: string;
    value: number;
  };
  services?: string[] | "all";
}

export type CampaignSubtype = 'boost' | 'last-minute' | 'slow-days' | 'limited-time' | 'reminder' | 'rescue' | 'manual';

export interface Campaign {
  id: string;
  name: string;
  campaign_type: string;
  campaign_subtype: CampaignSubtype;
  status: string;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
  settings: CampaignSettings;
  campaign_metrics?: CampaignMetrics[];
  is_active?: boolean;
  archived_at?: string | null;
  business_id: string;
  updated_at: string;
}