import React, { useState, useEffect } from 'react';
import { Video, Clock, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

/**
 * VideoMeetingButton Component
 * Shows a "Join Meeting" button that becomes active 10 minutes before the appointment.
 * 
 * Props:
 * - appointment: { date, time, videoLink, status }
 * - size: 'sm' | 'default' | 'lg'
 * - showCountdown: boolean
 */
const VideoMeetingButton = ({ 
  appointment, 
  size = 'default',
  showCountdown = true,
  className = ''
}) => {
  const [canJoin, setCanJoin] = useState(false);
  const [timeUntil, setTimeUntil] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!appointment?.date || !appointment?.time) return;

    const checkTime = () => {
      const now = new Date();
      
      // Parse appointment date and time
      const [year, month, day] = appointment.date.split('-').map(Number);
      const [hours, minutes] = appointment.time.split(':').map(Number);
      
      const appointmentTime = new Date(year, month - 1, day, hours, minutes);
      const tenMinutesBefore = new Date(appointmentTime.getTime() - 10 * 60 * 1000);
      const thirtyMinutesAfter = new Date(appointmentTime.getTime() + 30 * 60 * 1000);
      
      const diffMs = appointmentTime.getTime() - now.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      // Can join 10 minutes before until 30 minutes after
      if (now >= tenMinutesBefore && now <= thirtyMinutesAfter) {
        setCanJoin(true);
        setIsLive(now >= appointmentTime);
        
        if (diffMins > 0 && diffMins <= 10) {
          setTimeUntil(`Starts in ${diffMins} min`);
        } else if (diffMins <= 0 && diffMins > -30) {
          setTimeUntil('In progress');
        } else {
          setTimeUntil(null);
        }
      } else {
        setCanJoin(false);
        setIsLive(false);
        
        if (diffMins > 10) {
          if (diffMins < 60) {
            setTimeUntil(`In ${diffMins} min`);
          } else if (diffMins < 1440) {
            const hrs = Math.floor(diffMins / 60);
            setTimeUntil(`In ${hrs}h ${diffMins % 60}m`);
          } else {
            setTimeUntil(null);
          }
        } else if (diffMins < -30) {
          setTimeUntil('Ended');
        }
      }
    };

    // Check immediately
    checkTime();
    
    // Update every 30 seconds
    const interval = setInterval(checkTime, 30000);
    
    return () => clearInterval(interval);
  }, [appointment?.date, appointment?.time]);

  const handleJoin = () => {
    if (appointment?.videoLink) {
      window.open(appointment.videoLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Don't show for cancelled appointments
  if (appointment?.status === 'cancelled') {
    return null;
  }

  // Only show for confirmed/pending appointments
  if (!['confirmed', 'pending', 'pending_payment'].includes(appointment?.status)) {
    return null;
  }

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';

  if (canJoin) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          onClick={handleJoin}
          size={buttonSize}
          className={`${isLive ? 'bg-green-600 hover:bg-green-700 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}`}
          data-testid="join-meeting-btn"
        >
          <Video className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
          {isLive ? 'Join Now' : 'Join Meeting'}
          <ExternalLink className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} ml-2`} />
        </Button>
        {showCountdown && timeUntil && (
          <Badge 
            className={`${isLive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}
          >
            {timeUntil}
          </Badge>
        )}
      </div>
    );
  }

  // Show countdown if within 24 hours
  if (showCountdown && timeUntil && timeUntil !== 'Ended') {
    return (
      <div className={`flex items-center gap-2 text-gray-500 dark:text-gray-400 ${className}`}>
        <Clock className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
        <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'}`}>{timeUntil}</span>
      </div>
    );
  }

  return null;
};

export default VideoMeetingButton;
