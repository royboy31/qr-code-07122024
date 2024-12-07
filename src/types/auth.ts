export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  subscription_tier?: 'free' | 'pro';
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  user: UserProfile | null;
  error: AuthError | null;
}

export interface ProfileUpdateData {
  display_name?: string;
  avatar_url?: string;
  subscription_tier?: 'free' | 'pro';
}