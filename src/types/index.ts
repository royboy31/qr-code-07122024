export interface VCardData {
  firstName: string;
  lastName: string;
  mobile: string;
  phone: string;
  workPhone: string;
  fax: string;
  email: string;
  company: string;
  jobTitle: string;
  street: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  website: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface SMSData {
  phone: string;
  message: string;
}

export interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export type QRCodeType = 'url' | 'vcard' | 'email' | 'sms' | 'text' | 'wifi';

export interface PricingTier {
  id: 'free' | 'pro';
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface AnalyticsData {
  totalScans: number;
  uniqueScans: number;
  scansOverTime: {
    date: string;
    total: number;
    unique: number;
  }[];
  operatingSystems: {
    name: string;
    scans: number;
    percentage: number;
  }[];
  topCountries: {
    country: string;
    scans: number;
    percentage: number;
  }[];
  topCities: {
    city: string;
    scans: number;
    percentage: number;
  }[];
}