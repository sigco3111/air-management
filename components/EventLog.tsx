import React from 'react';
import type { ActiveGameEvent } from '../types';
import BellIcon from './icons/BellIcon';

interface EventLogProps {
  activeEvents: ActiveGameEvent[];
  eventHistory: ActiveGameEvent[];
  gameDate: Date;
}

const EventCard = ({ event, isActive, gameDate }: { event: ActiveGameEvent; isActive: boolean; gameDate: Date; }) => {
  const typeClasses = {
    positive: 'border-l-green-400',
    negative: 'border-l-red-400',
    neutral: 'border-l-slate-400',
  };
  
  const remainingDays = Math.ceil((event.expiryDate.getTime() - gameDate.getTime()) / (1000 * 3600 * 24));

  return (
    <div className={`bg-slate-800 p-4 rounded-md border-l-4 ${typeClasses[event.type]}`}>
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-white">{event.title}</h4>
        {isActive && event.durationDays > 0 && (
            <span className="text-xs font-mono bg-slate-700 text-cyan-300 px-2 py-1 rounded-full">
                {remainingDays}일 남음
            </span>
        )}
        {!isActive && (
             <span className="text-xs text-slate-400">
                {event.startDate.toLocaleDateString('ko-KR')}
            </span>
        )}
      </div>
      <p className="text-sm text-slate-300 mt-1">{event.description}</p>
    </div>
  );
};

const EventLog: React.FC<EventLogProps> = ({ activeEvents, eventHistory, gameDate }) => {
  if (eventHistory.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <BellIcon className="h-12 w-12 text-slate-500 mb-4" />
        <h3 className="text-lg font-medium text-slate-200">발생한 이벤트가 없습니다</h3>
        <p className="mt-1 text-sm text-slate-400">게임이 진행됨에 따라 다양한 이벤트가 이곳에 기록됩니다.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {activeEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white px-2 mb-3">진행 중인 이벤트</h3>
          <div className="space-y-3">
            {activeEvents.map(event => (
              <EventCard key={event.id + event.startDate.getTime()} event={event} isActive={true} gameDate={gameDate} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-white px-2 mb-3">이벤트 기록</h3>
        <div className="space-y-3">
          {eventHistory.map(event => (
            <EventCard key={event.id + event.startDate.getTime()} event={event} isActive={activeEvents.some(e => e.id === event.id && e.startDate === event.startDate)} gameDate={gameDate} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventLog;
