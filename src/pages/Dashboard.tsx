import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Clock, LogIn, LogOut, Shield, ChevronRight, 
  AlertTriangle, CheckCircle, TrendingUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/BottomNav';

export default function Dashboard() {
  const navigate = useNavigate();
  const { guard } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const stats = [
    { label: 'Hours This Week', value: '32.5', trend: '+2.5' },
    { label: 'On-Time Rate', value: '98%', trend: '+3%' },
    { label: 'Incidents', value: '0', trend: '0' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-6 pt-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-muted-foreground text-sm">{currentDate}</p>
            <h1 className="text-2xl font-bold text-foreground mt-1">
              Hello, {guard?.name.split(' ')[0]}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`status-indicator ${isCheckedIn ? 'status-active' : 'status-offline'}`} />
            <span className="text-sm font-medium text-foreground">
              {isCheckedIn ? 'On Duty' : 'Off Duty'}
            </span>
          </div>
        </div>

        {/* Current Shift Card */}
        <div className="glass-card p-5 mb-6">
          <div className="flex items-center gap-2 text-primary mb-3">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wide">Current Shift</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {guard?.currentShift?.location || 'No shift scheduled'}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {guard?.currentShift?.startTime} - {guard?.currentShift?.endTime}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground font-mono">{currentTime}</p>
            </div>
          </div>

          <div className="flex gap-3">
            {!isCheckedIn ? (
              <Button 
                variant="gradient" 
                className="flex-1"
                onClick={() => navigate('/check-in')}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Check In
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => setIsCheckedIn(false)}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Check Out
              </Button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-accent" />
                <span className="text-xs text-accent">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/schedule')}
            className="w-full glass-card p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">View Schedule</p>
                <p className="text-sm text-muted-foreground">Check upcoming shifts</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button 
            className="w-full glass-card p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Report Incident</p>
                <p className="text-sm text-muted-foreground">Log security events</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button 
            className="w-full glass-card p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">Location Check</p>
                <p className="text-sm text-muted-foreground">Verify patrol points</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
