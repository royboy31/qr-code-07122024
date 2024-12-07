import { supabase } from '../supabase';
import { UserProfile, ProfileUpdateData, AuthError } from '../../types/auth';

export const getUserProfile = async (userId: string): Promise<{
  profile: UserProfile | null;
  error: AuthError | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      profile: data,
      error: null
    };
  } catch (error) {
    return {
      profile: null,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch profile',
        status: 404
      }
    };
  }
};

export const updateUserProfile = async (
  userId: string, 
  updates: ProfileUpdateData
): Promise<{
  profile: UserProfile | null;
  error: AuthError | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      profile: data,
      error: null
    };
  } catch (error) {
    return {
      profile: null,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update profile',
        status: 500
      }
    };
  }
};

export const createUserProfile = async (
  userId: string,
  email: string
): Promise<{
  profile: UserProfile | null;
  error: AuthError | null;
}> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        email,
        subscription_tier: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      profile: data,
      error: null
    };
  } catch (error) {
    return {
      profile: null,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create profile',
        status: 500
      }
    };
  }
};