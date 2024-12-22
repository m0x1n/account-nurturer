export interface CampaignMetrics {
  users_targeted: number;
  percent_opened: number;
  percent_clicked: number;
  percent_unsubscribed: number;
}

export interface ScheduleDay {
  date: string;
  enabled: boolean;
}

export interface CampaignSettings {
  schedule?: ScheduleDay[];
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

export interface Campaign {
  id: string;
  name: string;
  campaign_type: string;
  campaign_subtype: string;
  status: string;
  created_at: string;
  settings: CampaignSettings;
  campaign_metrics?: CampaignMetrics[];
  is_active?: boolean;
  archived_at?: string | null;
  business_id: string;
  updated_at: string;
}