import { SupabaseClient } from "@supabase/supabase-js";
import { NavigateFunction } from "react-router-dom";

export const handleAuthStateChange = async (
  event: string,
  session: any,
  supabase: SupabaseClient,
  navigate: NavigateFunction
) => {
  if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('completed_onboarding')
      .eq('id', session.user.id)
      .single();

    if (profile?.completed_onboarding) {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  }

  if (event === 'SIGNED_OUT') {
    navigate("/");
  }
};