import React, { useState } from 'react';
import type { Player, Airport, Route, AircraftModel, Competitor, Alliance } from '../types';
import RouteIcon from './icons/RouteIcon';
import CompactRouteCard from './CompactRouteCard';
import RouteDetailModal from './RouteDetailModal';

interface RouteManagementProps {
  player: Player | null;
  airports: Airport[];
  aircraftModels: AircraftModel[];
  onOpenAssignmentModal: (routeId: string) => void;
  onUnassignAircraft: (routeId: string) => void;
  onUpdateTicketPrice: (routeId: string, newPrice: number) => void;
  competitors: Competitor[];
  closedAirports: Set<string>;
  alliances: Alliance[];
}

const RouteManagement: React.FC<RouteManagementProps> = ({ 
  player, 
  airports, 
  aircraftModels, 
  onOpenAssignmentModal, 
  onUnassignAircraft, 
  onUpdateTicketPrice, 
  competitors, 
  closedAirports, 
  alliances 
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  if (!player) {
    return <div className="p-4 text-center text-slate-400">플레이어 정보를 불러오는 중입니다...</div>;
  }

  const selectedRoute = selectedRouteId ? player.routes.find(r => r.id === selectedRouteId) : null;

  const handleRouteClick = (routeId: string) => {
    setSelectedRouteId(routeId);
  };

  const handleModalClose = () => {
    setSelectedRouteId(null);
  };

  if (player.routes.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <RouteIcon className="h-12 w-12 text-slate-500 mb-4" />
        <h3 className="text-lg font-medium text-slate-200">개설된 노선이 없습니다</h3>
        <p className="mt-1 text-sm text-slate-400">지도에서 두 공항을 클릭하여 첫 노선을 만들어보세요.</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 h-full">
      <div className="flex flex-col overflow-y-auto space-y-2 sm:space-y-3 route-list h-full">
        {player.routes.map(route => (
          <CompactRouteCard
            key={route.id}
            route={route}
            airports={airports}
            player={player}
            aircraftModels={aircraftModels}
            closedAirports={closedAirports}
            alliances={alliances}
            onClick={handleRouteClick}
          />
        ))}
      </div>
      
      <RouteDetailModal
        route={selectedRoute}
        airports={airports}
        player={player}
        aircraftModels={aircraftModels}
        competitors={competitors}
        closedAirports={closedAirports}
        alliances={alliances}
        isOpen={selectedRouteId !== null}
        onClose={handleModalClose}
        onOpenAssignmentModal={onOpenAssignmentModal}
        onUnassignAircraft={onUnassignAircraft}
        onUpdateTicketPrice={onUpdateTicketPrice}
      />
      
      <style jsx>{`
        .route-list {
          /* Enhanced scrollbar styling for better visibility */
          scrollbar-width: thin;
          scrollbar-color: #64748b #1e293b;
          
          /* Touch device scroll support */
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          
          /* Ensure proper scroll snap for better UX */
          scroll-snap-type: y proximity;
        }
        
        /* Webkit browsers (Chrome, Safari, Edge) */
        .route-list::-webkit-scrollbar {
          width: 8px;
        }
        
        .route-list::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 6px;
          margin: 8px 0;
        }
        
        .route-list::-webkit-scrollbar-thumb {
          background: #64748b;
          border-radius: 6px;
          border: 2px solid #1e293b;
          background-clip: padding-box;
        }
        
        .route-list::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        .route-list::-webkit-scrollbar-thumb:active {
          background: #cbd5e1;
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 640px) {
          .route-list {
            /* Thinner scrollbar on mobile */
            scrollbar-width: thin;
          }
          
          .route-list::-webkit-scrollbar {
            width: 6px;
          }
          
          .route-list::-webkit-scrollbar-track {
            margin: 4px 0;
          }
        }
        
        /* Tablet responsive adjustments */
        @media (min-width: 641px) and (max-width: 1024px) {
          .route-list::-webkit-scrollbar {
            width: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default RouteManagement;