import { Home, ShoppingBag, Calendar, Users, Users2, ShoppingCart, BarChart2, Mail, Settings, Plus, Link, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainMenuItems = [
  { title: "Home", icon: Home, url: "/dashboard" },
  { title: "Services and Products", icon: ShoppingBag, url: "/dashboard/services" },
  { title: "Bookings", icon: Calendar, url: "/dashboard/bookings" },
  { title: "Clients", icon: Users, url: "/dashboard/clients" },
  { title: "Staff", icon: Users2, url: "/dashboard/staff" },
  { title: "Point of Sale", icon: ShoppingCart, url: "/dashboard/pos" },
  { title: "Insights", icon: BarChart2, url: "/dashboard/insights" },
  { title: "Marketing", icon: Mail, url: "/dashboard/marketing" },
  { title: "Settings", icon: Settings, url: "/dashboard/settings" },
];

const additionalItems = [
  { title: "Add-on Services", icon: Plus, url: "/dashboard/add-ons" },
  { title: "Quick Links", icon: Link, url: "/dashboard/quick-links" },
];

interface DashboardSidebarProps {
  onLogout: () => void;
}

export function DashboardSidebar({ onLogout }: DashboardSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Additional Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {additionalItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="w-full justify-start gap-3"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}