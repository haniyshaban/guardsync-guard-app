import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Shift Reminder',
    message: 'Your shift at Tech Park - Building A starts in 30 minutes.',
    timestamp: '10 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'info',
    title: 'Schedule Update',
    message: 'Your shift on Jan 10 has been moved to 16:00 - 00:00.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'success',
    title: 'Check-in Confirmed',
    message: 'Successfully checked in at Tech Park - Building A.',
    timestamp: 'Yesterday',
    read: true,
  },
  {
    id: '4',
    type: 'info',
    title: 'New Assignment',
    message: 'You have been assigned to City Mall patrol duty.',
    timestamp: '2 days ago',
    read: true,
  },
];

export default function Alerts() {
  const navigate = useNavigate();

  const unreadCount = mockAlerts.filter(a => !a.read).length;

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'info': return <Info className="w-5 h-5 text-primary" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-accent" />;
    }
  };

  const getAlertBg = (type: Alert['type']) => {
    switch (type) {
      case 'warning': return 'bg-warning/20';
      case 'info': return 'bg-primary/20';
      case 'success': return 'bg-accent/20';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
            <p className="text-muted-foreground text-sm">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          <div className="relative">
            <Bell className="w-6 h-6 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "glass-card p-4 transition-all",
                !alert.read && "ring-1 ring-primary/30"
              )}
            >
              <div className="flex gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  getAlertBg(alert.type)
                )}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={cn(
                      "font-semibold text-foreground",
                      !alert.read && "text-primary"
                    )}>
                      {alert.title}
                    </h3>
                    {!alert.read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockAlerts.length === 0 && (
          <div className="glass-card p-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
