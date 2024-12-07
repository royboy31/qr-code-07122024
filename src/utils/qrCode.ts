import QRCode from 'qrcode';
import { createQRCode } from '../lib/supabase';
import { VCardData, EmailData, SMSData, WiFiData, QRCodeType } from '../types';
import { config } from '../config';

const validateUrl = (url: string): string => {
  if (!url) throw new Error('URL is required');
  try {
    // Ensure URL has a protocol
    const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
    new URL(urlWithProtocol); // Validate URL format
    return urlWithProtocol; // Return the URL with protocol
  } catch {
    throw new Error('Invalid URL format');
  }
};

const generateVCardString = (data: VCardData): string => {
  const formatField = (key: string, value: string) => value ? `${key}:${value}\n` : '';
  
  return `BEGIN:VCARD
VERSION:3.0
${formatField('N', `${data.lastName};${data.firstName}`)}${formatField('FN', `${data.firstName} ${data.lastName}`)}${formatField('TEL;TYPE=CELL', data.mobile)}${formatField('TEL;TYPE=HOME', data.phone)}${formatField('TEL;TYPE=WORK', data.workPhone)}${formatField('TEL;TYPE=FAX', data.fax)}${formatField('EMAIL', data.email)}${formatField('ORG', data.company)}${formatField('TITLE', data.jobTitle)}${formatField('ADR', `;;${data.street};${data.city};${data.state};${data.zip};${data.country}`)}${formatField('URL', data.website)}END:VCARD`;
};

const generateEmailString = (data: EmailData): string => {
  const subject = encodeURIComponent(data.subject);
  const body = encodeURIComponent(data.body);
  return `mailto:${data.email}?subject=${subject}&body=${body}`;
};

const generateSMSString = (data: SMSData): string => {
  return `SMSTO:${data.phone}:${data.message}`;
};

const generateWiFiString = (data: WiFiData): string => {
  const hidden = data.hidden ? 'H:true' : '';
  return `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};${hidden};`;
};

const validateText = (text: string): void => {
  if (!text) throw new Error('Text is required');
  if (text.length > 1000) throw new Error('Text is too long (max 1000 characters)');
};

interface QRCodeParams {
  url?: string;
  vcardData?: VCardData;
  emailData?: EmailData;
  smsData?: SMSData;
  text?: string;
  wifiData?: WiFiData;
}

export const generateQRCode = async (
  type: QRCodeType,
  params: QRCodeParams,
  userId?: string
): Promise<string> => {
  try {
    let content: string;

    switch (type) {
      case 'url':
        content = validateUrl(params.url!);
        break;
      case 'vcard':
        content = generateVCardString(params.vcardData!);
        break;
      case 'email':
        content = generateEmailString(params.emailData!);
        break;
      case 'sms':
        content = generateSMSString(params.smsData!);
        break;
      case 'text':
        validateText(params.text!);
        content = params.text!;
        break;
      case 'wifi':
        content = generateWiFiString(params.wifiData!);
        break;
      default:
        throw new Error('Invalid QR code type');
    }

    // Save to Supabase with user ID
    const qrCode = await createQRCode(type, content, userId);

    // Generate QR code with redirect URL using configured domain
    const redirectUrl = `${config.domain}/qr/${qrCode.id}`;
    console.log('Generated QR code redirect URL:', redirectUrl);
    
    const dataUrl = await QRCode.toDataURL(redirectUrl, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate QR code. Please try again.');
  }
};