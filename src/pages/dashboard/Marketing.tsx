import { Mail, MessageSquare, Star, Gift, Smartphone, HeadphonesIcon, MousePointerClick, Share2, Globe, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Marketing() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Marketing</h1>
      </div>

      <Tabs defaultValue="communication" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto gap-4">
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="digital">Digital Presence</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="communication" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email & SMS Marketing
                </CardTitle>
                <CardDescription>
                  Automated messaging campaigns and templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Appointment reminders</li>
                  <li>Promotional campaigns</li>
                  <li>Loyalty updates</li>
                  <li>Drip campaigns</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  In-App Chat & Support
                </CardTitle>
                <CardDescription>
                  Direct communication channels with clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Client-to-business chat</li>
                  <li>Automated FAQs</li>
                  <li>Chatbot support</li>
                  <li>Quick responses</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Promotions & Discounts
                </CardTitle>
                <CardDescription>
                  Create and manage special offers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Seasonal offers</li>
                  <li>Referral discounts</li>
                  <li>Success tracking</li>
                  <li>Custom campaigns</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Membership & Loyalty
                </CardTitle>
                <CardDescription>
                  Reward your regular customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Subscription memberships</li>
                  <li>Points system</li>
                  <li>Redemption options</li>
                  <li>Member perks</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Client Reviews
                </CardTitle>
                <CardDescription>
                  Manage and boost your online reputation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Automated review requests</li>
                  <li>Google integration</li>
                  <li>Yelp integration</li>
                  <li>Social media presence</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Branded App
                </CardTitle>
                <CardDescription>
                  Custom mobile experience for your clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>White-label solution</li>
                  <li>Integrated booking</li>
                  <li>Push notifications</li>
                  <li>Loyalty integration</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="digital" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointerClick className="h-5 w-5" />
                  Ad Campaigns
                </CardTitle>
                <CardDescription>
                  Reach new customers effectively
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Local targeting</li>
                  <li>Performance tracking</li>
                  <li>ROI analytics</li>
                  <li>Campaign optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Social Media
                </CardTitle>
                <CardDescription>
                  Manage your social presence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Post scheduling</li>
                  <li>Content suggestions</li>
                  <li>Engagement tracking</li>
                  <li>Trend analysis</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Website & SEO
                </CardTitle>
                <CardDescription>
                  Optimize your online presence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>SEO optimization</li>
                  <li>Website builder</li>
                  <li>Traffic analytics</li>
                  <li>Conversion tracking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Marketing Analytics
                </CardTitle>
                <CardDescription>
                  Track and optimize your marketing efforts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2">
                  <li>Client retention rates</li>
                  <li>Marketing ROI</li>
                  <li>Campaign performance</li>
                  <li>Demographic insights</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}