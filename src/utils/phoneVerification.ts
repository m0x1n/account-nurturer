import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

export const sendPhoneVerification = async (
  supabase: SupabaseClient<Database>,
  phone: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
  } else {
    const { error } = await supabase.auth.updateUser({ phone });
    if (error) throw error;
  }
};

export const verifyPhoneOtp = async (
  supabase: SupabaseClient<Database>,
  phone: string,
  token: string
) => {
  const { data: { user }, error: verifyError } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms'
  });

  if (verifyError) throw verifyError;
  if (!user) throw new Error('Verification failed');

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      phone,
      phone_verified: true 
    })
    .eq('id', user.id);

  if (updateError) throw updateError;

  return user;
};