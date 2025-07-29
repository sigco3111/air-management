






import React from 'react';
import type { Player, Airport, Competitor } from '../types';
import CashIcon from './icons/CashIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import TrendingDownIcon from './icons/TrendingDownIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import PlaneIcon from './icons/PlaneIcon';
import RouteIcon from './icons/RouteIcon';
import HomeIcon from './icons/HomeIcon';
import UsersGroupIcon from './icons/UsersGroupIcon';
import SparklesIcon from './icons/SparklesIcon';
import StarIcon from './icons/StarIcon';
import ClockIcon from './icons/ClockIcon';
import UserCircleIcon from './icons/UserCircleIcon';


interface DashboardProps {
  player: Player | null;
  onOpenHubModal: () => void;
  airports: Airport[];
  competitors: Competitor[];
  onOpenRankingsModal: () => void;
}

const KpiCard = ({
  icon,
  label,
  value,
  colorClass = 'text-cyan-400',
  valueClass = 'text-slate-100',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass?: string;
  valueClass?: string;
}) => (
  <div className="bg-slate-800 rounded-lg p-4 flex items-center space-x-4">
    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-slate-700 ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`text-xl font-bold font-mono ${valueClass}`}>{value}</p>
    </div>
  </div>
);

const HubCard = ({ player, airports, onOpenHubModal }: { player: Player, airports: Airport[], onOpenHubModal: () => void}) => {
    const hubAirport = player.hubAirportId 
        ? airports.find(a => a.id === player.hubAirportId)
        : null;

    return (
        <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                     <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-slate-700 text-cyan-400">
                         <HomeIcon className="w-6 h-6" />
                     </div>
                     <div>
                         <p className="text-sm text-slate-400">허브 공항</p>
                         <p className="text-lg font-bold text-slate-100">
                            {hubAirport ? `${hubAirport.name} (${hubAirport.id})` : '지정되지 않음'}
                         </p>
                     </div>
                </div>
                 <button
                    onClick={onOpenHubModal}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors"
                >
                    {hubAirport ? '변경' : '설정'}
                </button>
            </div>
            <p className="text-xs text-slate-500 mt-3 pl-14">
                허브 공항에서는 공항 이용료가 할인되고 노선 수요가 증가합니다.
            </p>
        </div>
    );
}

const Dashboard: React.FC<DashboardProps> = ({ player, onOpenHubModal, airports, competitors, onOpenRankingsModal }) => {
  if (!player) {
    return <div className="p-4 text-center text-slate-400">플레이어 정보를 불러오는 중입니다...</div>;
  }

  const { cash, lastMonthIncome = 0, lastMonthExpense = 0, fleet, routes, satisfaction, brandAwareness } = player;
  const profit = lastMonthIncome - lastMonthExpense;
  
  const inServiceCount = fleet.filter(a => a.status === 'in_service').length;
  const idleCount = fleet.filter(a => a.status === 'idle').length;

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white px-2 mb-3">핵심 성과 지표</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <KpiCard
                icon={<StarIcon className="w-6 h-6" />}
                label="승객 만족도"
                value={satisfaction.toFixed(1)}
                colorClass="text-yellow-400"
            />
            <KpiCard
                icon={<UserCircleIcon className="w-6 h-6" />}
                label="서비스 품질"
                value={player.serviceQuality.toFixed(1)}
                colorClass="text-sky-400"
            />
            <KpiCard
                icon={<ClockIcon className="w-6 h-6" />}
                label="정시성"
                value={`${player.onTimePerformance.toFixed(1)}%`}
                colorClass="text-fuchsia-400"
            />
            <KpiCard
                icon={<SparklesIcon className="w-6 h-6" />}
                label="브랜드 인지도"
                value={brandAwareness.toFixed(1)}
                colorClass="text-violet-400"
            />
            <KpiCard
                icon={<TrendingUpIcon className="w-6 h-6" />}
                label="월간 수입"
                value={`$${lastMonthIncome.toLocaleString()}`}
                colorClass="text-green-400"
            />
            <KpiCard
                icon={<TrendingDownIcon className="w-6 h-6" />}
                label="월간 비용"
                value={`$${lastMonthExpense.toLocaleString()}`}
                colorClass="text-red-400"
            />
        </div>
      </div>
       
      <div>
        <h3 className="text-lg font-semibold text-white px-2 mb-3">운영 본부</h3>
        <HubCard player={player} airports={airports} onOpenHubModal={onOpenHubModal} />
      </div>

       <div>
         <div className="flex items-center justify-between px-2 mb-3">
            <h3 className="text-lg font-semibold text-white">경쟁사 현황</h3>
            <button
                onClick={onOpenRankingsModal}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-cyan-300 transition-colors"
            >
                순위 보기
            </button>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 space-y-3">
          {competitors.map(comp => (
            <div key={comp.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: comp.color}}></div>
                <span className="text-white font-semibold">{comp.name}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1.5 text-slate-300" title="노선 수">
                    <RouteIcon className="w-4 h-4"/>
                    <span className="font-mono">{comp.routes.length}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-300" title="보유 항공기 수">
                    <PlaneIcon className="w-4 h-4"/>
                    <span className="font-mono">{comp.fleet.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div>
        <h3 className="text-lg font-semibold text-white px-2 mb-3">자산 현황</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <KpiCard
                icon={<PlaneIcon className="w-6 h-6" />}
                label="보유 항공기"
                value={`${fleet.length} 대`}
            />
            <KpiCard
                icon={<RouteIcon className="w-6 h-6" />}
                label="운항 노선"
                value={`${routes.length} 개`}
            />
        </div>
      </div>

       <div>
        <h3 className="text-lg font-semibold text-white px-2 mb-3">항공기 상태</h3>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex justify-around">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{inServiceCount}</p>
              <p className="text-sm text-slate-400">운항 중</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{idleCount}</p>
              <p className="text-sm text-slate-400">대기 중</p>
            </div>
          </div>
        </div>
       </div>

    </div>
  );
};

export default Dashboard;