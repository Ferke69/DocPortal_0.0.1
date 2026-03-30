import React from 'react';
import { Calendar, Clock, User, Video, MapPin } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import VideoMeetingButton from './VideoMeetingButton';

/**
 * AppointmentCard Component
 * Displays appointment details with video meeting button
 */
const AppointmentCard = ({ 
  appointment, 
  userType = 'client', // 'client' or 'provider'
  otherPartyName = '',
  otherPartyAvatar = '',
  onViewDetails,
  compact = false
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
      pending_payment: { label: 'Awaiting Payment', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      completed: { label: 'Completed', className: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={otherPartyAvatar} />
            <AvatarFallback className="text-xs">{getInitials(otherPartyName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {otherPartyName || (userType === 'client' ? 'Doctor' : 'Patient')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {appointment.time} • {appointment.type}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <VideoMeetingButton 
            appointment={appointment} 
            size="sm" 
            showCountdown={false}
          />
          {getStatusBadge(appointment.status)}
        </div>
      </div>
    );
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left side - Appointment info */}
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={otherPartyAvatar} />
              <AvatarFallback>{getInitials(otherPartyName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {otherPartyName || (userType === 'client' ? 'Your Doctor' : 'Patient')}
                </h4>
                {getStatusBadge(appointment.status)}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                {appointment.type}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(appointment.date)}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {appointment.time}
                </span>
                {appointment.videoLink && (
                  <span className="flex items-center text-green-600 dark:text-green-400">
                    <Video className="h-4 w-4 mr-1" />
                    Video Call
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col items-end gap-2">
            <VideoMeetingButton 
              appointment={appointment}
              showCountdown={true}
            />
            {appointment.notes && (
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] text-right truncate">
                {appointment.notes}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
