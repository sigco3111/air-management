

import React, { useState, useMemo } from 'react';
import type { Player, Airport } from '../types';
import HomeIcon from './icons/HomeIcon';

interface HubSelectionModalProps {
  player: Player;
  airports: Airport[];
  onSetHub: (airportId: string) => void;
  onClose: () => void;
}

const HubSelectionModal: React.FC<HubSelectionModalProps> = ({
  player,
  airports,
  onSetHub,
  onClose,
}) => {
  const [selectedAirportId, setSelectedAirportId] = useState<string | null>(player.hubAirportId);

  const eligibleAirports = useMemo(() => {
    const operatingAirportIds = new Set<string>();
    player.routes.forEach(route => {
      operatingAirportIds.add(route.origin);
      operatingAirportIds.add(route.destination);
    });

    return airports.filter(airport => operatingAirportIds.has(airport.id));
  }, [player.routes, airports]);

  const handleSetHub = () => {
    if (selectedAirportId) {
      onSetHub(selectedAirportId);
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] modal-content-animation ring-1 ring-white/10">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">허브 공항 설정</h2>
          <p className="text-sm text-slate-400 mt-1">
            주요 거점으로 사용할 허브 공항을 선택하세요.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            노선이 있는 공항만 선택할 수 있습니다.
          </p>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {eligibleAirports.length > 0 ? (
            <ul className="space-y-3">
              {eligibleAirports.map(airport => {
                const isSelected = airport.id === selectedAirportId;
                
                return (
                  <li
                    key={airport.id}
                    onClick={() => setSelectedAirportId(airport.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-700 border-cyan-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">{airport.name}</h3>
                      <span className="text-sm text-slate-300">{airport.id}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                        {airport.city}, {airport.country}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-10">
              <HomeIcon className="w-12 h-12 mx-auto text-slate-500" />
              <h3 className="mt-4 text-lg font-medium text-slate-200">선택 가능한 공항 없음</h3>
              <p className="mt-1 text-sm text-slate-400">
                먼저 노선을 개설하여 운영하는 공항을 만드세요.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSetHub}
            disabled={!selectedAirportId || selectedAirportId === player.hubAirportId}
            className="px-6 py-2 text-sm font-bold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            설정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default HubSelectionModal;