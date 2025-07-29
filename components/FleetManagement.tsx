


import React, { useState, useEffect } from 'react';
import type { Player, AircraftModel, AircraftInstance, Airport } from '../types';
import ClipboardListIcon from './icons/ClipboardListIcon';
import Pagination from './Pagination';

interface FleetManagementProps {
  player: Player | null;
  gameDate: Date;
  aircraftModels: AircraftModel[];
  airports: Airport[];
  onSellAircraft: (aircraftId: number) => void;
}

const ITEMS_PER_PAGE = 4;

const getModelDetails = (modelId: string, models: AircraftModel[]) => {
  return models.find(m => m.id === modelId);
};

const getAirportById = (id: string, airports: Airport[]) => airports.find(a => a.id === id);


const calculateAge = (purchaseDate: Date, currentDate: Date): string => {
  let years = currentDate.getFullYear() - purchaseDate.getFullYear();
  let months = currentDate.getMonth() - purchaseDate.getMonth();
  
  if (months < 0 || (months === 0 && currentDate.getDate() < purchaseDate.getDate())) {
    years--;
    months = (months + 12) % 12;
  }
  
  return `${years}년 ${months}개월`;
};

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="font-medium text-slate-200">{value}</span>
  </div>
);

const AircraftInfoCard = ({
  instance,
  model,
  gameDate,
  player,
  airports,
  onSell,
}: {
  instance: AircraftInstance;
  model: AircraftModel;
  gameDate: Date;
  player: Player;
  airports: Airport[];
  onSell: (aircraftId: number) => void;
}) => {
  const statusBadge = {
    idle: 'bg-slate-600 text-slate-100',
    in_service: 'bg-green-500 text-white',
  };
  const statusText = {
    idle: '대기 중',
    in_service: '운항 중',
  };

  const assignedRoute = instance.routeId ? player.routes.find(r => r.id === instance.routeId) : null;
  const routeDisplay = assignedRoute 
    ? `${getAirportById(assignedRoute.origin, airports)?.id} - ${getAirportById(assignedRoute.destination, airports)?.id}`
    : '해당 없음';

  const ageInYears = (gameDate.getTime() - instance.purchaseDate.getTime()) / (1000 * 3600 * 24 * 365.25);
  // Aircraft loses 80% of value over 25 years.
  const depreciationRate = 0.8 / 25; // Yearly depreciation rate
  const depreciationAmount = Math.min(0.8, ageInYears * depreciationRate); // Cap at 80% loss
  const salePrice = Math.round(model.price * (1 - depreciationAmount));


  return (
    <li className="bg-slate-800 rounded-lg p-4 flex flex-col space-y-3">
        <div className="flex items-start space-x-4">
             {model.imageUrl && (
                <div className="w-16 h-16 bg-slate-900/50 rounded-md flex items-center justify-center p-1 flex-shrink-0">
                    <img src={model.imageUrl} alt={model.name} className="h-full w-auto object-contain" />
                </div>
            )}
            <div className="flex-grow">
                 <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white">{model.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadge[instance.status]}`}>
                    {statusText[instance.status]}
                    </span>
                </div>
                <p className="text-sm text-slate-400">{model.manufacturer}</p>
            </div>
        </div>

      <div className="space-y-1.5 text-sm border-t border-slate-700 pt-3">
        <InfoItem label="등록번호" value={`HL-${String(instance.id).slice(-4).toUpperCase()}`} />
        <InfoItem label="구입일" value={instance.purchaseDate.toLocaleDateString('ko-KR')} />
        <InfoItem label="기령" value={calculateAge(instance.purchaseDate, gameDate)} />
        {instance.status === 'in_service' && (
             <InfoItem label="배정 노선" value={<span className="font-mono text-cyan-400">{routeDisplay}</span>} />
        )}
        <InfoItem label="월 유지비" value={`$${model.monthlyMaintenance.toLocaleString()}`} />
      </div>
       <div className="mt-auto pt-3 border-t border-slate-700/50">
          <button
            onClick={() => onSell(instance.id)}
            disabled={instance.status === 'in_service'}
            className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            {instance.status === 'in_service' 
              ? '운항 중 (판매 불가)' 
              : `판매 ($${salePrice.toLocaleString()})`}
          </button>
      </div>
    </li>
  );
};

const FleetManagement: React.FC<FleetManagementProps> = ({ player, gameDate, aircraftModels, airports, onSellAircraft }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!player) {
    return <div className="p-4 text-center text-slate-400">플레이어 정보를 불러오는 중입니다...</div>;
  }
  
  const totalPages = Math.ceil(player.fleet.length / ITEMS_PER_PAGE);
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [player.fleet.length, totalPages, currentPage]);

  const paginatedFleet = player.fleet.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  if (player.fleet.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <ClipboardListIcon className="h-12 w-12 text-slate-500 mb-4" />
        <h3 className="text-lg font-medium text-slate-200">보유한 항공기가 없습니다</h3>
        <p className="mt-1 text-sm text-slate-400">항공기 시장 탭에서 첫 항공기를 구매하여 צי를 구성해보세요.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ul className="space-y-4">
        {paginatedFleet.map(instance => {
          const model = getModelDetails(instance.modelId, aircraftModels);
          if (!model) return null;
          return (
            <AircraftInfoCard
              key={instance.id}
              instance={instance}
              model={model}
              gameDate={gameDate}
              player={player}
              airports={airports}
              onSell={onSellAircraft}
            />
          );
        })}
      </ul>
       <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default FleetManagement;