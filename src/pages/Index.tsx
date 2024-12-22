import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        navigate("/login");
        return;
      }

      // Check if user exists and is valid
      if (session) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("User error:", userError);
          await supabase.auth.signOut();
          navigate("/login");
          return;
        }
        navigate("/onboarding");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      navigate("/login");
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Our Platform</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Start your journey with us and set up your business in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="px-8 py-6 text-lg"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleSignIn}
            className="px-8 py-6 text-lg"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;