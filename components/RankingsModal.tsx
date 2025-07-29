
import React, { useMemo, useState } from 'react';
import type { Player, Competitor } from '../types';
import TrophyIcon from './icons/TrophyIcon';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

type SortableKeys = 'overallRank' | 'name' | 'satisfaction' | 'brandAwareness' | 'cash' | 'fleetSize' | 'routeCount';
type SortDirection = 'ascending' | 'descending';

interface SortConfig {
  key: SortableKeys;
  direction: SortDirection;
}

interface RankingsModalProps {
  player: Player;
  competitors: Competitor[];
  onClose: () => void;
}

interface AirlineRankingData {
  id: string;
  isPlayer: boolean;
  name: string;
  satisfaction: number;
  brandAwareness: number;
  cash: number;
  fleetSize: number;
  routeCount: number;
  satisfactionRank: number;
  brandAwarenessRank: number;
  cashRank: number;
  fleetSizeRank: number;
  routeCountRank: number;
  overallScore: number;
  overallRank: number;
}

const RankingsModal: React.FC<RankingsModalProps> = ({ player, competitors, onClose }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'overallRank', direction: 'ascending' });

  const rankedAirlines = useMemo((): AirlineRankingData[] => {
    const allAirlines = [
      {
        id: 'player',
        isPlayer: true,
        name: player.companyName,
        satisfaction: player.satisfaction,
        brandAwareness: player.brandAwareness,
        cash: player.cash,
        fleetSize: player.fleet.length,
        routeCount: player.routes.length,
      },
      ...competitors.map(c => ({
        id: c.id,
        isPlayer: false,
        name: c.name,
        satisfaction: 75, // AI satisfaction isn't tracked, so using a baseline
        brandAwareness: 50, // AI brand awareness isn't tracked, so using a baseline
        cash: c.cash,
        fleetSize: c.fleet.length,
        routeCount: c.routes.length,
      }))
    ];

    type RankableKey = keyof Omit<typeof allAirlines[0], 'id' | 'isPlayer' | 'name'>;

    const getRanks = (key: RankableKey, order: 'asc' | 'desc' = 'desc') => {
      const sorted = [...allAirlines].sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        return order === 'desc' ? valB - valA : valA - valB;
      });
      const ranks = new Map<string, number>();
      sorted.forEach((airline, index) => ranks.set(airline.id, index + 1));
      return ranks;
    };

    const satisfactionRanks = getRanks('satisfaction');
    const brandAwarenessRanks = getRanks('brandAwareness');
    const cashRanks = getRanks('cash');
    const fleetSizeRanks = getRanks('fleetSize');
    const routeCountRanks = getRanks('routeCount');
    
    const withScores = allAirlines.map(airline => {
      const satisfactionRank = satisfactionRanks.get(airline.id) || 0;
      const brandAwarenessRank = brandAwarenessRanks.get(airline.id) || 0;
      const cashRank = cashRanks.get(airline.id) || 0;
      const fleetSizeRank = fleetSizeRanks.get(airline.id) || 0;
      const routeCountRank = routeCountRanks.get(airline.id) || 0;

      // Lower score is better
      const overallScore = satisfactionRank + brandAwarenessRank + cashRank + fleetSizeRank + routeCountRank;
      
      return {
        ...airline,
        satisfactionRank,
        brandAwarenessRank,
        cashRank,
        fleetSizeRank,
        routeCountRank,
        overallScore,
      };
    });
    
    withScores.sort((a, b) => a.overallScore - b.overallScore);

    return withScores.map((airline, index) => ({ ...airline, overallRank: index + 1 }));

  }, [player, competitors]);

  const sortedAirlines = useMemo(() => {
    let sortableItems = [...rankedAirlines];
    sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
        }
        return 0;
    });
    return sortableItems;
  }, [rankedAirlines, sortConfig]);

  const requestSort = (key: SortableKeys) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const SortableHeader = ({ label, sortKey, align = 'left' }: { label: string; sortKey: SortableKeys; align?: 'left' | 'right' }) => {
    const isSorted = sortConfig.key === sortKey;
    const textAlignClass = align === 'right' ? 'justify-end' : 'justify-start';
    return (
      <th scope="col" className={`px-4 py-3 text-${align}`}>
        <button onClick={() => requestSort(sortKey)} className={`flex items-center space-x-1 group w-full ${textAlignClass}`}>
          <span>{label}</span>
          {isSorted ? (
            sortConfig.direction === 'ascending' ? (
              <ArrowUpIcon className="w-3 h-3" />
            ) : (
              <ArrowDownIcon className="w-3 h-3" />
            )
          ) : (
            <ArrowDownIcon className="w-3 h-3 text-slate-600 group-hover:text-slate-300" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] modal-content-animation ring-1 ring-white/10">
        <div className="p-6 border-b border-slate-700 flex items-center space-x-3">
            <TrophyIcon className="w-8 h-8 text-yellow-400" />
            <div>
                <h2 className="text-xl font-bold text-white">항공사 순위</h2>
                <p className="text-sm text-slate-400 mt-1">플레이어와 경쟁사의 성과를 비교합니다.</p>
            </div>
        </div>

        <div className="flex-grow overflow-y-auto">
            <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-900/70 backdrop-blur-sm sticky top-0">
                    <tr>
                        <SortableHeader label="종합 순위" sortKey="overallRank" />
                        <SortableHeader label="항공사" sortKey="name" />
                        <SortableHeader label="만족도" sortKey="satisfaction" align="right" />
                        <SortableHeader label="브랜드 인지도" sortKey="brandAwareness" align="right" />
                        <SortableHeader label="자본금" sortKey="cash" align="right" />
                        <SortableHeader label="보유 항공기" sortKey="fleetSize" align="right" />
                        <SortableHeader label="노선 수" sortKey="routeCount" align="right" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {sortedAirlines.map((airline) => {
                        const rankColor = airline.overallRank === 1 ? 'text-yellow-400' : airline.overallRank === 2 ? 'text-slate-300' : airline.overallRank === 3 ? 'text-orange-400' : 'text-slate-400';
                        return (
                            <tr key={airline.id} className={`${airline.isPlayer ? 'bg-cyan-900/30' : ''} hover:bg-slate-700/50`}>
                                <td className={`px-4 py-3 font-bold text-lg text-center ${rankColor}`}>{airline.overallRank}</td>
                                <th scope="row" className={`px-4 py-3 font-medium ${airline.isPlayer ? 'text-cyan-400' : 'text-white'}`}>{airline.name}</th>
                                <td className="px-4 py-3 font-mono text-right">{airline.satisfaction.toFixed(1)} <span className="text-slate-500 text-xs">({airline.satisfactionRank}위)</span></td>
                                <td className="px-4 py-3 font-mono text-right">{airline.brandAwareness.toFixed(1)} <span className="text-slate-500 text-xs">({airline.brandAwarenessRank}위)</span></td>
                                <td className="px-4 py-3 font-mono text-right">${airline.cash.toLocaleString()} <span className="text-slate-500 text-xs">({airline.cashRank}위)</span></td>
                                <td className="px-4 py-3 font-mono text-right">{airline.fleetSize} <span className="text-slate-500 text-xs">({airline.fleetSizeRank}위)</span></td>
                                <td className="px-4 py-3 font-mono text-right">{airline.routeCount} <span className="text-slate-500 text-xs">({airline.routeCountRank}위)</span></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>

        <div className="p-4 bg-slate-900/50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingsModal;
