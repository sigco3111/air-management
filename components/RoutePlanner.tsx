
import React from 'react';
import type { Airport } from '../types';
import PlaneIcon from './icons/PlaneIcon';

interface RoutePlannerProps {
  origin: Airport;
  destination: Airport;
  onConfirm: () => void;
  onCancel: () => void;
}

const RoutePlanner: React.FC<RoutePlannerProps> = ({ origin, destination, onConfirm, onCancel }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-2 pointer-events-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-slate-200">
                <div>
                    <span className="text-sm text-slate-400">출발</span>
                    <p className="font-bold text-lg">{origin.name} ({origin.id})</p>
                </div>
                <PlaneIcon className="w-6 h-6 text-cyan-400 transform rotate-90" />
                 <div>
                    <span className="text-sm text-slate-400">도착</span>
                    <p className="font-bold text-lg">{destination.name} ({destination.id})</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors"
                >
                    취소
                </button>
                 <button
                    onClick={onConfirm}
                    className="px-6 py-2 text-sm font-bold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
                >
                    노선 개설
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
