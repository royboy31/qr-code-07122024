import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// QR Code functions
export const createQRCode = async (type: string, content: string, userId?: string) => {
  const id = nanoid(10);
  
  const { data, error } = await supabase
    .from('qr_codes')
    .insert([
      {
        id,
        user_id: userId,
        type,
        content,
        scans: 0,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getQRCodes = async (userId: string) => {
  const { data, error } = await supabase
    .from('qr_codes')
    .select(`
      *,
      scan_data (
        timestamp,
        user_agent,
        platform,
        language,
        screen_resolution
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getQRCode = async (id: string) => {
  const { data, error } = await supabase
    .from('qr_codes')
    .select(`
      *,
      scan_data (
        timestamp,
        user_agent,
        platform,
        language,
        screen_resolution
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const recordScan = async (qrCodeId: string) => {
  const scanData = {
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
  };

  // Insert scan data
  const { error: scanError } = await supabase
    .from('scan_data')
    .insert([{ qr_code_id: qrCodeId, ...scanData }]);

  if (scanError) throw scanError;

  // Update QR code scan count
  const { error: updateError } = await supabase
    .from('qr_codes')
    .update({ 
      scans: supabase.rpc('increment_scans', { code_id: qrCodeId }),
      last_scan: new Date().toISOString()
    })
    .eq('id', qrCodeId);

  if (updateError) throw updateError;
};