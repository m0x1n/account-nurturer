import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const clearAllSessions = async () => {
      localStorage.clear();
      sessionStorage.clear();
      await supabase.auth.signOut({ scope: 'global' });
    };

    clearAllSessions();
  }, []);

  const checkEmailAndProceed = async (email: string) => {
    try {
      // First check if the email exists in auth system
      const { data: emailExists, error: checkError } = await supabase
        .rpc('check_email_exists', { email_to_check: email });

      if (checkError) {
        toast({
          title: "Error",
          description: "Failed to check email status",
          variant: "destructive",
        });
        return;
      }

      if (emailExists) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('completed_onboarding')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .maybeSingle();

        if (profile?.completed_onboarding) {
          // User exists and has previously logged in
          toast({
            title: "Account Exists",
            description: "This email is already associated with an account. Please sign in.",
          });
          navigate("/login");
        } else {
          // User exists but hasn't completed onboarding
          navigate("/onboarding");
        }
      } else {
        // New user, proceed to onboarding
        navigate("/onboarding");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while checking email status",
        variant: "destructive",
      });
    }
  };

  const handleGetStarted = () => {
    setShowEmailDialog(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    await checkEmailAndProceed(email);
    setShowEmailDialog(false);
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

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your email to get started</DialogTitle>
            <DialogDescription>
              We'll check if you already have an account with us.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Continue</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;