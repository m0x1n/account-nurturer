import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Our Platform</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Start your journey with us and set up your business in minutes.
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/onboarding")}
          className="px-8 py-6 text-lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;