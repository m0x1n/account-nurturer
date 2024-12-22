import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface EmailFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  showSignIn?: boolean;
}

const EmailForm = ({ email, onEmailChange, onSubmit, showSignIn }: EmailFormProps) => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
        <p className="text-gray-500">Let's start with your email address</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@example.com"
          className="w-full"
          required
        />
      </div>
      {showSignIn ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">This email is associated with an existing account.</p>
          <Button 
            type="button" 
            onClick={() => navigate("/login")} 
            className="w-full"
          >
            Sign In Instead
          </Button>
        </div>
      ) : (
        <Button type="submit" className="w-full">
          Continue
        </Button>
      )}
    </form>
  );
};

export default EmailForm;