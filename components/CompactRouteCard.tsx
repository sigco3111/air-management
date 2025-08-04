import React from 'react';
import type { Route, Airport, Player, AircraftModel, Alliance } from '../types';
import RouteIcon from './icons/RouteIcon';
import HomeIcon from './icons/HomeIcon';
import LinkIcon from './icons/LinkIcon';
import UsersGroupIcon from './icons/UsersGroupIcon';
import ExclamationIcon from './icons/ExclamationIcon';
import PlaneIcon from './icons/PlaneIcon';

interface CompactRouteCardProps {
  route: Route;
  airports: Airport[];
  player: Player;
  aircraftModels: AircraftModel[];
  closedAirports: Set<string>;
  alliances: Alliance[];
  onClick: (routeId: string) => void;
}

const getAirportById = (id: string, airports: Airport[]) => airports.find(a => a.id === id);

const CompactRouteCard: React.FC<CompactRouteCardProps> = ({
  route,
  airports,
  player,
  aircraftModels,
  closedAirports,
  alliances,
  onClick
}) => {
  const origin = getAirportById(route.origin, airports);
  const destination = getAirportById(route.destination, airports);
  
  if (!origin || !destination) {
    return null;
  }

  const assignedAircraft = route.aircraftId ? player.fleet.find(a => a.id === route.aircraftId) : null;
  const isRouteClosed = closedAirports.has(route.origin) || closedAirports.has(route.destination);
  const isHubRoute = player.hubAirportId && (route.origin === player.hubAirportId || route.destination === player.hubAirportId);

  // Check for alliance benefits
  const benefitsFromAlliance = React.useMemo(() => {
    if (!player.allianceId) return false;
    const alliance = alliances.find(a => a.id === player.allianceId);
    if (!alliance) return false;
    
    const partners = alliance.members.filter(m => m !== 'player');
    return partners.length > 0;
  }, [player.allianceId, alliances]);

  // Check for competition (simplified for compact view)
  // Note: In the full implementation, this would check actual competitor data
  // For the compact view, we show competition indicator based on route characteristics
  const hasCompetition = React.useMemo(() => {
    // Major routes (longer distances) are more likely to have competition
    // Hub routes typically have less competition due to network effects
    return route.distance > 1000 && !isHubRoute && !isRouteClosed;
  }, [route.distance, isHubRoute, isRouteClosed]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(route.id);
  };

  return (
    <div
      className="bg-slate-800 rounded-lg p-2 sm:p-3 w-full flex-shrink-0 cursor-pointer hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-600 scroll-snap-align-start"
      onClick={handleClick}
    >
      {/* Route Header */}
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
          <span className="font-semibold text-white text-xs sm:text-sm truncate">
            {origin.city} ({origin.id})
          </span>
          <RouteIcon className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
          <span className="font-semibold text-white text-xs sm:text-sm truncate">
            {destination.city} ({destination.id})
          </span>
        </div>
      </div>

      {/* Distance and Assignment Status */}
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <span className="text-slate-400 text-xs">
          {route.distance.toLocaleString()} km
        </span>
        <div className="flex items-center space-x-1">
          <PlaneIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${assignedAircraft ? 'text-green-400' : 'text-slate-500'}`} />
          <span className={`text-xs ${assignedAircraft ? 'text-green-400' : 'text-slate-500'}`}>
            {assignedAircraft ? '배정됨' : '미배정'}
          </span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center space-x-1 flex-wrap gap-0.5 sm:gap-1">
        {isRouteClosed && (
          <div className="flex items-center space-x-0.5 sm:space-x-1 text-xs font-semibold text-red-400 bg-red-900/50 px-1.5 sm:px-2 py-0.5 rounded-full" title="공항 폐쇄로 운항 중단">
            <ExclamationIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">중단</span>
          </div>
        )}
        {hasCompetition && !isRouteClosed && (
          <div className="flex items-center space-x-0.5 sm:space-x-1 text-xs font-semibold text-yellow-400 bg-yellow-900/50 px-1.5 sm:px-2 py-0.5 rounded-full" title="경쟁 노선">
            <UsersGroupIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">경쟁</span>
          </div>
        )}
        {benefitsFromAlliance && (
          <div className="flex items-center space-x-0.5 sm:space-x-1 text-xs font-semibold text-blue-400 bg-blue-900/50 px-1.5 sm:px-2 py-0.5 rounded-full" title="동맹 네트워크 보너스">
            <LinkIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">동맹</span>
          </div>
        )}
        {isHubRoute && (
          <div className="flex items-center space-x-0.5 sm:space-x-1 text-xs font-semibold text-cyan-300 bg-cyan-900/50 px-1.5 sm:px-2 py-0.5 rounded-full" title="허브 노선">
            <HomeIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">허브</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactRouteCard;