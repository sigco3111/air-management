


import React from 'react';
import type { Airport, Player, Competitor, Route } from '../types';
import BuildingIcon from './icons/BuildingIcon';
import ArrowLongRightIcon from './icons/ArrowLongRightIcon';
import UsersGroupIcon from './icons/UsersGroupIcon';
import PlaneIcon from './icons/PlaneIcon';

interface AirportDetailModalProps {
  airport: Airport;
  player: Player;
  competitors: Competitor[];
  airports: Airport[];
  onClose: () => void;
  onStartRoute: (airportId: string) => void;
}

const getOtherAirport = (route: Route, currentAirportId: string, allAirports: Airport[]) => {
    const otherAirportId = route.origin === currentAirportId ? route.destination : route.origin;
    return allAirports.find(a => a.id === otherAirportId);
};

const AirportDetailModal: React.FC<AirportDetailModalProps> = ({
  airport,
  player,
  competitors,
  airports,
  onClose,
  onStartRoute,
}) => {
  const playerRoutes = player.routes.filter(r => r.origin === airport.id || r.destination === airport.id);
  
  const competitorRoutes = competitors.flatMap(comp => 
    comp.routes
        .filter(r => r.origin === airport.id || r.destination === airport.id)
        .map(r => ({ ...r, competitorName: comp.name, competitorColor: comp.color }))
  );

  return (
    <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] modal-content-animation ring-1 ring-white/10">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <BuildingIcon className="w-8 h-8 text-cyan-400" />
            <div>
                <h2 className="text-xl font-bold text-white">{airport.name} ({airport.id})</h2>
                <p className="text-sm text-slate-400 mt-1">{airport.city}, {airport.country}</p>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <PlaneIcon className="w-5 h-5" />
                <span>내 노선 ({playerRoutes.length})</span>
            </h3>
            <div className="bg-slate-900/50 rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
              {playerRoutes.length > 0 ? (
                playerRoutes.map(route => {
                    const otherAirport = getOtherAirport(route, airport.id, airports);
                    return (
                        <div key={route.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2 font-mono">
                                <span className="text-cyan-400">{airport.id}</span>
                                <ArrowLongRightIcon className="w-5 h-5 text-slate-500" />
                                <span className="text-cyan-400">{otherAirport?.id}</span>
                                <span className="text-slate-300 hidden sm:inline-block ml-2">({otherAirport?.city})</span>
                            </div>
                            <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${route.aircraftId ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                {route.aircraftId ? '운항 중' : '항공기 없음'}
                            </span>
                        </div>
                    );
                })
              ) : (
                <p className="text-sm text-slate-400 text-center py-2">이 공항에서 출발/도착하는 내 노선이 없습니다.</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <UsersGroupIcon className="w-5 h-5" />
                <span>경쟁사 노선 ({competitorRoutes.length})</span>
            </h3>
            <div className="bg-slate-900/50 rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
              {competitorRoutes.length > 0 ? (
                competitorRoutes.map(route => {
                    const otherAirport = getOtherAirport(route, airport.id, airports);
                    return (
                        <div key={route.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2 font-mono">
                                <span className="text-slate-400">{airport.id}</span>
                                <ArrowLongRightIcon className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-400">{otherAirport?.id}</span>
                            </div>
                            <span className="font-semibold" style={{ color: route.competitorColor }}>{route.competitorName}</span>
                        </div>
                    );
                })
              ) : (
                <p className="text-sm text-slate-400 text-center py-2">이 공항을 운항하는 경쟁사 노선이 없습니다.</p>
              )}
            </div>
          </div>

        </div>

        <div className="p-4 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 flex justify-between items-center">
          <button
            onClick={() => onStartRoute(airport.id)}
            className="px-6 py-2 text-sm font-bold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
          >
            여기서 노선 개설
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AirportDetailModal;