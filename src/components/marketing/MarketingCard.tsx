import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MarketingCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  onClick?: () => void;
  interactive?: boolean;
}

export function MarketingCard({ 
  icon: Icon, 
  title, 
  description, 
  features,
  onClick,
  interactive 
}: MarketingCardProps) {
  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 ${
        interactive ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''
      } bg-gradient-to-br from-white to-secondary/80 dark:from-gray-900 dark:to-gray-800`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-xl">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription className="font-sans text-sm">{description}</CardDescription>
      </CardHeader>
      {features && features.length > 0 && (
        <CardContent>
          <ul className="list-disc pl-4 space-y-2 text-muted-foreground font-sans">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}