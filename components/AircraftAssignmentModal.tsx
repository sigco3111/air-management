


import React, { useState, useMemo } from 'react';
import type { Player, AircraftModel, Route, AircraftInstance } from '../types';
import PlaneIcon from './icons/PlaneIcon';

interface AircraftAssignmentModalProps {
  route: Route;
  player: Player;
  aircraftModels: AircraftModel[];
  onAssign: (routeId: string, aircraftId: number) => void;
  onCancel: () => void;
}

const getModelDetails = (modelId: string, models: AircraftModel[]) => {
  return models.find(m => m.id === modelId);
};

const AircraftAssignmentModal: React.FC<AircraftAssignmentModalProps> = ({
  route,
  player,
  aircraftModels,
  onAssign,
  onCancel,
}) => {
  const [selectedAircraftId, setSelectedAircraftId] = useState<number | null>(null);

  const availableAircraft = useMemo(() => {
    return player.fleet.filter(instance => {
      const model = getModelDetails(instance.modelId, aircraftModels);
      return (
        instance.status === 'idle' &&
        model &&
        model.range >= route.distance
      );
    });
  }, [player.fleet, aircraftModels, route.distance]);

  const handleAssign = () => {
    if (selectedAircraftId) {
      onAssign(route.id, selectedAircraftId);
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] modal-content-animation ring-1 ring-white/10">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">항공기 배정</h2>
          <p className="text-sm text-slate-400 mt-1">
            노선 (거리: {route.distance.toLocaleString()} km)에 배정할 유휴 항공기를 선택하세요.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            해당 노선의 운항 거리를 감당할 수 있는 항공기만 표시됩니다.
          </p>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {availableAircraft.length > 0 ? (
            <ul className="space-y-3">
              {availableAircraft.map(instance => {
                const model = getModelDetails(instance.modelId, aircraftModels);
                if (!model) return null;
                const isSelected = instance.id === selectedAircraftId;
                
                return (
                  <li
                    key={instance.id}
                    onClick={() => setSelectedAircraftId(instance.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-700 border-cyan-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {model.imageUrl && (
                        <div className="w-12 h-12 flex-shrink-0">
                          <img src={model.imageUrl} alt={model.name} className="w-full h-full object-contain" />
                        </div>
                      )}
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white">{model.manufacturer} {model.name}</h3>
                            <span className="text-sm text-slate-300">HL-{String(instance.id).slice(-4).toUpperCase()}</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-400 grid grid-cols-2 gap-x-4 gap-y-1">
                            <span>좌석: {model.seats.toLocaleString()}석</span>
                            <span>항속거리: {model.range.toLocaleString()} km</span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-10">
              <PlaneIcon className="w-12 h-12 mx-auto text-slate-500" />
              <h3 className="mt-4 text-lg font-medium text-slate-200">배정 가능한 항공기 없음</h3>
              <p className="mt-1 text-sm text-slate-400">
                현재 유휴 상태이면서 이 노선을 운항할 수 있는 항공기가 없습니다.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedAircraftId}
            className="px-6 py-2 text-sm font-bold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            배정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AircraftAssignmentModal;