import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, ChevronLeft, ChevronRight, 
  Clock, MapPin, CheckCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { cn } from '@/lib/utils';

interface ScheduledShift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'upcoming' | 'completed' | 'today';
}

const mockShifts: ScheduledShift[] = [
  { id: '1', date: '2024-01-07', startTime: '08:00', endTime: '16:00', location: 'Tech Park - Building A', status: 'today' },
  { id: '2', date: '2024-01-08', startTime: '16:00', endTime: '00:00', location: 'City Mall - Main Entrance', status: 'upcoming' },
  { id: '3', date: '2024-01-09', startTime: '08:00', endTime: '16:00', location: 'Tech Park - Building A', status: 'upcoming' },
  { id: '4', date: '2024-01-10', startTime: '00:00', endTime: '08:00', location: 'Industrial Zone - Gate 3', status: 'upcoming' },
  { id: '5', date: '2024-01-06', startTime: '08:00', endTime: '16:00', location: 'Tech Park - Building A', status: 'completed' },
  { id: '6', date: '2024-01-05', startTime: '16:00', endTime: '00:00', location: 'City Mall - Main Entrance', status: 'completed' },
];

export default function Schedule() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getWeekDates = () => {
    const dates = [];
    const current = new Date(selectedDate);
    const first = current.getDate() - current.getDay();

    for (let i = 0; i < 7; i++) {
      const date = new Date(current);
      date.setDate(first + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const shiftsForDate = mockShifts.filter(
    shift => shift.date === formatDate(selectedDate)
  );

  const upcomingShifts = mockShifts
    .filter(shift => shift.status === 'upcoming')
    .slice(0, 3);

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
          <h1 className="text-2xl font-bold text-foreground">My Schedule</h1>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Week View */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <p className="font-semibold text-foreground">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const isSelected = formatDate(date) === formatDate(selectedDate);
              const hasShift = mockShifts.some(s => s.date === formatDate(date));

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "flex flex-col items-center py-3 rounded-lg transition-all",
                    isSelected 
                      ? "gradient-primary text-primary-foreground" 
                      : "hover:bg-white/10",
                    isToday(date) && !isSelected && "ring-1 ring-primary"
                  )}
                >
                  <span className="text-xs text-muted-foreground mb-1">
                    {weekDays[index]}
                  </span>
                  <span className={cn(
                    "text-lg font-semibold",
                    isSelected ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {date.getDate()}
                  </span>
                  {hasShift && !isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Shifts */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h2>

          {shiftsForDate.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <p className="text-muted-foreground">No shifts scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shiftsForDate.map((shift) => (
                <div key={shift.id} className="glass-card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-mono font-semibold text-foreground">
                        {shift.startTime} - {shift.endTime}
                      </span>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      shift.status === 'today' && "bg-primary/20 text-primary",
                      shift.status === 'upcoming' && "bg-warning/20 text-warning",
                      shift.status === 'completed' && "bg-accent/20 text-accent"
                    )}>
                      {shift.status === 'today' ? 'Today' : 
                       shift.status === 'completed' ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{shift.location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Shifts */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Upcoming Shifts</h2>
          <div className="space-y-3">
            {upcomingShifts.map((shift) => (
              <div key={shift.id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">
                    {new Date(shift.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {shift.startTime} - {shift.endTime} • {shift.location}
                  </p>
                </div>
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
