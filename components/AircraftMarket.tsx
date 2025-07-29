

import React, { useState } from 'react';
import type { Player, AircraftModel } from '../types';
import { AIRCRAFT_MODELS } from '../data/aircrafts';
import Pagination from './Pagination';

interface AircraftMarketProps {
  player: Player | null;
  onPurchase: (aircraft: AircraftModel) => void;
}

const ITEMS_PER_PAGE = 4;

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="font-medium text-slate-200">{value}</span>
  </div>
);

const AircraftCard = ({
  model,
  playerCash,
  onPurchase,
}: {
  model: AircraftModel;
  playerCash: number;
  onPurchase: (aircraft: AircraftModel) => void;
}) => {
  const canAfford = playerCash >= model.price;

  return (
    <li className="bg-slate-800 rounded-lg p-4 flex flex-col space-y-3">
        {model.imageUrl && (
            <div className="h-24 bg-slate-900/50 rounded-md flex items-center justify-center p-2">
                <img src={model.imageUrl} alt={model.name} className="h-full w-auto object-contain" />
            </div>
        )}
      <div className="flex items-center space-x-4">
        <h3 className="font-bold text-lg text-white">{model.manufacturer} {model.name}</h3>
      </div>
      <div className="space-y-2">
        <InfoItem label="가격" value={`$${model.price.toLocaleString()}`} />
        <InfoItem label="좌석" value={`${model.seats.toLocaleString()}석`} />
        <InfoItem label="항속거리" value={`${model.range.toLocaleString()} km`} />
        <InfoItem label="월 유지비" value={`$${model.monthlyMaintenance.toLocaleString()}`} />
        <InfoItem label="연료 효율" value={`${model.fuelEfficiency} L/km`} />
      </div>
      <button
        onClick={() => onPurchase(model)}
        disabled={!canAfford}
        className="mt-auto w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
      >
        {canAfford ? '구매하기' : '자금 부족'}
      </button>
    </li>
  );
};


const AircraftMarket: React.FC<AircraftMarketProps> = ({ player, onPurchase }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!player) {
    return (
      <div className="p-4 text-center text-slate-400">플레이어 정보를 불러오는 중입니다...</div>
    );
  }

  const totalPages = Math.ceil(AIRCRAFT_MODELS.length / ITEMS_PER_PAGE);
  const paginatedModels = AIRCRAFT_MODELS.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );


  return (
    <div className="p-4">
      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {paginatedModels.map(model => (
          <AircraftCard 
            key={model.id}
            model={model}
            playerCash={player.cash}
            onPurchase={onPurchase}
          />
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AircraftMarket;