import { supabase } from "@/integrations/supabase/client";

export const sendVerificationCode = async (phone: string, email: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // If no session, sign in with OTP
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          phone: phone // Store phone number in user metadata
        }
      }
    });

    if (signInError) {
      throw signInError;
    }
  } else {
    // If session exists, update phone
    const { error: updateError } = await supabase.auth.updateUser({ phone });
    if (updateError) throw updateError;
  }
};

export const verifyPhoneNumber = async (phone: string, userId: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ phone, phone_verified: true })
    .eq('id', userId);

  if (error) throw error;
};