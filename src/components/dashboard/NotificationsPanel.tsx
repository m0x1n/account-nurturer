import { Card } from "@/components/ui/card";
import { Bell, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: "message",
      title: "New Message",
      description: "Sarah left you a new message about her appointment",
      time: "5 minutes ago",
      icon: MessageSquare,
    },
    {
      id: 2,
      type: "alert",
      title: "Reminder",
      description: "You have 3 appointments scheduled for tomorrow",
      time: "1 hour ago",
      icon: Bell,
    },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-background border-l border-border shadow-lg transform transition-transform duration-200 ease-in-out">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-5rem)]">
        {notifications.map((notification) => (
          <Card key={notification.id} className="p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <notification.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}