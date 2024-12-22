import { Home, ShoppingBag, Calendar, Users, Users2, ShoppingCart, BarChart2, Mail, Settings, Plus, Link, LogOut, LayoutDashboard, CheckSquare, CreditCard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const mainMenuItems = [
  { 
    title: "Home", 
    icon: Home, 
    url: "/dashboard",
    submenu: [
      { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
      { title: "Setup Checklist", icon: CheckSquare, url: "/dashboard/setup-checklist" }
    ]
  },
  { title: "Services and Products", icon: ShoppingBag, url: "/dashboard/services" },
  { title: "Appointments", icon: Calendar, url: "/dashboard/appointments" },
  { title: "Clients", icon: Users, url: "/dashboard/clients" },
  { title: "Staff", icon: Users2, url: "/dashboard/staff" },
  { title: "Point of Sale", icon: ShoppingCart, url: "/dashboard/pos" },
  { title: "Insights", icon: BarChart2, url: "/dashboard/insights" },
  { title: "Marketing", icon: Mail, url: "/dashboard/marketing" },
  { 
    title: "Settings", 
    icon: Settings, 
    url: "/dashboard/settings",
    submenu: [
      { title: "Payment Settings", icon: CreditCard, url: "/dashboard/payment-settings" }
    ]
  },
];

const additionalItems = [
  { title: "Add-on Services", icon: Plus, url: "/dashboard/add-ons" },
  { title: "Quick Links", icon: Link, url: "/dashboard/quick-links" },
];

interface DashboardSidebarProps {
  onLogout: () => void;
}

export function DashboardSidebar({ onLogout }: DashboardSidebarProps) {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <Collapsible open={openMenus[item.title]} onOpenChange={() => toggleMenu(item.title)}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full justify-between">
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown className={`h-4 w-4 transition-transform ${openMenus[item.title] ? 'transform rotate-180' : ''}`} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="pl-8 mt-2 space-y-1">
                          {item.submenu.map((subItem) => (
                            <SidebarMenuButton key={subItem.title} asChild>
                              <a href={subItem.url} className="flex items-center gap-3 text-sm">
                                <subItem.icon className="h-4 w-4" />
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
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