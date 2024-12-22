import { supabase } from "@/integrations/supabase/client";

export const checkEmailStatus = async (email: string) => {
  const { data: emailExists, error: checkError } = await supabase
    .rpc('check_email_exists', { email_to_check: email });

  if (checkError) {
    throw new Error("Failed to check email status");
  }

  return emailExists;
};

export const updateUserEmail = async (email: string) => {
  const { error } = await supabase.auth.updateUser({ email });
  if (error) {
    // Check if it's an email_exists error
    const isEmailExists = error.message?.includes('email_exists') || 
                         (error as any)?.code === 'email_exists';
    if (isEmailExists) {
      throw new Error("This email is already in use");
    }
    throw error;
  }
};

export const validateEmail = (email: string): boolean => {
  return email.includes("@");
};