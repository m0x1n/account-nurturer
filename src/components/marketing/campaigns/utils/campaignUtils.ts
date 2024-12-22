import { isAfter } from "date-fns";
import { Campaign } from "../types/campaignTypes";

export const getCampaignType = () => {
  return "Smart";
};

export const getCampaignSubtype = (type: string) => {
  const subtypeMap: { [key: string]: string } = {
    'boost': 'Boost',
    'last-minute': 'Fill Last Minute Openings',
    'slow-days': 'Fill Slow Days',
    'limited-time': 'Limited Time Specials',
    'reminder': 'Reminder to Book Again',
    'rescue': 'Rescue Lost Customers',
    'manual': 'Manual Campaign'
  };
  return subtypeMap[type.toLowerCase()] || type;
};

export const isBoostCampaignActive = (campaign: Campaign): boolean => {
  // First check if the campaign is marked as active in the database
  if (!campaign.is_active) {
    return false;
  }

  // Then check if it's a boost campaign with valid schedule
  if (campaign.campaign_type !== 'boost' || !campaign.settings?.schedule) {
    return false;
  }

  const lastDay = campaign.settings.schedule
    .filter(day => day.enabled)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return lastDay ? isAfter(new Date(lastDay.date), new Date()) : false;
};