import { isAfter } from "date-fns";
import { Campaign, CampaignSubtype } from "../types/campaignTypes";

export const getCampaignType = () => {
  return "Smart";
};

export const getCampaignSubtype = (type: CampaignSubtype | string): string => {
  const subtypeMap: Record<CampaignSubtype, string> = {
    'boost': 'Boost',
    'last-minute': 'Fill Last Minute Openings',
    'slow-days': 'Fill Slow Days',
    'limited-time': 'Limited Time Specials',
    'reminder': 'Reminder to Book Again',
    'rescue': 'Rescue Lost Customers',
    'manual': 'Manual Campaign'
  };
  return subtypeMap[type as CampaignSubtype] || type;
};

export const isBoostCampaignActive = (campaign: Campaign): boolean => {
  // First check if the campaign is marked as active in the database
  if (!campaign.is_active) {
    return false;
  }

  // Then check if it's a boost campaign with valid schedule
  if (campaign.campaign_subtype !== 'boost' || !campaign.settings?.schedule) {
    return false;
  }

  const lastDay = campaign.settings.schedule
    .filter(day => day.enabled)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return lastDay ? isAfter(new Date(lastDay.date), new Date()) : false;
};

export const isCampaignActive = (campaign: Campaign): boolean => {
  // Return false if campaign is explicitly not active or has an end date in the past
  if (!campaign.is_active || (campaign.end_date && !isAfter(new Date(campaign.end_date), new Date()))) {
    return false;
  }

  // For boost campaigns, check schedule
  if (campaign.campaign_subtype === 'boost') {
    return isBoostCampaignActive(campaign);
  }

  // For last-minute campaigns, check if it's marked as active and doesn't have an end date
  if (campaign.campaign_subtype === 'last-minute') {
    return campaign.is_active && (!campaign.end_date || isAfter(new Date(campaign.end_date), new Date()));
  }

  return campaign.is_active;
};