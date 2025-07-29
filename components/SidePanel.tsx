


import React from 'react';
import type { Country, Player, AircraftModel, SidePanelTab, Airport, ActiveGameEvent, Competitor, ResearchProject, MarketingCampaign, Alliance } from '../types';
import CountryInfoCard from './CountryInfoCard';
import AircraftMarket from './AircraftMarket';
import FleetManagement from './FleetManagement';
import GlobeIcon from './icons/GlobeIcon';
import PlaneIcon from './icons/PlaneIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import RouteIcon from './icons/RouteIcon';
import RouteManagement from './RouteManagement';
import DashboardIcon from './icons/DashboardIcon';
import Dashboard from './Dashboard';
import BellIcon from './icons/BellIcon';
import EventLog from './EventLog';
import BanknotesIcon from './icons/BanknotesIcon';
import Financials from './Financials';
import LightbulbIcon from './icons/LightbulbIcon';
import ResearchAndDevelopment from './ResearchAndDevelopment';
import MegaphoneIcon from './icons/MegaphoneIcon';
import Marketing from './Marketing';
import LinkIcon from './icons/LinkIcon';
import AllianceManagement from './AllianceManagement';

interface SidePanelProps {
  activeTab: SidePanelTab;
  setActiveTab: (tab: SidePanelTab) => void;
  countryData: Country | null;
  isLoadingCountry: boolean;
  player: Player | null;
  onPurchaseAircraft: (aircraft: AircraftModel) => void;
  onSellAircraft: (aircraftId: number) => void;
  gameDate: Date;
  aircraftModels: AircraftModel[];
  airports: Airport[];
  onOpenAssignmentModal: (routeId: string) => void;
  onUnassignAircraft: (routeId: string) => void;
  onUpdateTicketPrice: (routeId: string, newPrice: number) => void;
  activeEvents: ActiveGameEvent[];
  eventHistory: ActiveGameEvent[];
  onOpenHubModal: () => void;
  onOpenRankingsModal: () => void;
  competitors: Competitor[];
  closedAirports: Set<string>;
  researchProjects: ResearchProject[];
  onStartResearch: (project: ResearchProject) => void;
  marketingCampaigns: MarketingCampaign[];
  onStartMarketingCampaign: (campaign: MarketingCampaign) => void;
  alliances: Alliance[];
  onFormAlliance: (name: string) => void;
  onInviteToAlliance: (competitorId: string) => void;
  onLeaveAlliance: () => void;
}

const TabButton = ({
  label,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    title={label}
    className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'bg-slate-700 text-cyan-300'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span className="sr-only">{label}</span>
  </button>
);

const SidePanel: React.FC<SidePanelProps> = ({
  activeTab,
  setActiveTab,
  countryData,
  isLoadingCountry,
  player,
  onPurchaseAircraft,
  onSellAircraft,
  gameDate,
  aircraftModels,
  airports,
  onOpenAssignmentModal,
  onUnassignAircraft,
  onUpdateTicketPrice,
  activeEvents,
  eventHistory,
  onOpenHubModal,
  onOpenRankingsModal,
  competitors,
  closedAirports,
  researchProjects,
  onStartResearch,
  marketingCampaigns,
  onStartMarketingCampaign,
  alliances,
  onFormAlliance,
  onInviteToAlliance,
  onLeaveAlliance
}) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-xl shadow-lg h-full flex flex-col ring-1 ring-white/5">
      <div className="flex-shrink-0 border-b border-slate-700">
        <nav className="flex justify-around p-1.5">
          <TabButton
            label="대시보드"
            icon={<DashboardIcon className="w-5 h-5" />}
            isActive={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <TabButton
            label="재무"
            icon={<BanknotesIcon className="w-5 h-5" />}
            isActive={activeTab === 'financials'}
            onClick={() => setActiveTab('financials')}
          />
           <TabButton
            label="연구개발"
            icon={<LightbulbIcon className="w-5 h-5" />}
            isActive={activeTab === 'research'}
            onClick={() => setActiveTab('research')}
          />
          <TabButton
            label="마케팅"
            icon={<MegaphoneIcon className="w-5 h-5" />}
            isActive={activeTab === 'marketing'}
            onClick={() => setActiveTab('marketing')}
          />
           <TabButton
            label="동맹"
            icon={<LinkIcon className="w-5 h-5" />}
            isActive={activeTab === 'alliance'}
            onClick={() => setActiveTab('alliance')}
          />
          <TabButton
            label="내 항공기"
            icon={<ClipboardListIcon className="w-5 h-5" />}
            isActive={activeTab === 'fleet'}
            onClick={() => setActiveTab('fleet')}
          />
          <TabButton
            label="노선 관리"
            icon={<RouteIcon className="w-5 h-5" />}
            isActive={activeTab === 'routes'}
            onClick={() => setActiveTab('routes')}
          />
           <TabButton
            label="항공기 시장"
            icon={<PlaneIcon className="w-5 h-5" />}
            isActive={activeTab === 'market'}
            onClick={() => setActiveTab('market')}
          />
          <TabButton
            label="이벤트"
            icon={<BellIcon className="w-5 h-5" />}
            isActive={activeTab === 'events'}
            onClick={() => setActiveTab('events')}
          />
          <TabButton
            label="국가 정보"
            icon={<GlobeIcon className="w-5 h-5" />}
            isActive={activeTab === 'country'}
            onClick={() => setActiveTab('country')}
          />
        </nav>
      </div>
      <div className="flex-grow overflow-y-auto min-h-0">
        {activeTab === 'dashboard' && <Dashboard player={player} onOpenHubModal={onOpenHubModal} airports={airports} competitors={competitors} onOpenRankingsModal={onOpenRankingsModal} />}
        {activeTab === 'financials' && <Financials player={player} />}
        {activeTab === 'research' && (
            <ResearchAndDevelopment
                player={player}
                researchProjects={researchProjects}
                onStartResearch={onStartResearch}
                gameDate={gameDate}
            />
        )}
        {activeTab === 'marketing' && (
            <Marketing
                player={player}
                marketingCampaigns={marketingCampaigns}
                onStartCampaign={onStartMarketingCampaign}
                gameDate={gameDate}
            />
        )}
        {activeTab === 'alliance' && (
            <AllianceManagement
                player={player}
                competitors={competitors}
                alliances={alliances}
                onFormAlliance={onFormAlliance}
                onInviteToAlliance={onInviteToAlliance}
                onLeaveAlliance={onLeaveAlliance}
            />
        )}
        {activeTab === 'fleet' && (
          <FleetManagement 
            player={player}
            gameDate={gameDate}
            aircraftModels={aircraftModels}
            airports={airports}
            onSellAircraft={onSellAircraft}
          />
        )}
        {activeTab === 'routes' && (
          <RouteManagement 
            player={player} 
            airports={airports}
            aircraftModels={aircraftModels}
            onOpenAssignmentModal={onOpenAssignmentModal}
            onUnassignAircraft={onUnassignAircraft}
            onUpdateTicketPrice={onUpdateTicketPrice}
            competitors={competitors}
            closedAirports={closedAirports}
            alliances={alliances}
          />
        )}
        {activeTab === 'market' && (
          <AircraftMarket player={player} onPurchase={onPurchaseAircraft} />
        )}
        {activeTab === 'events' && <EventLog activeEvents={activeEvents} eventHistory={eventHistory} gameDate={gameDate} />}
        {activeTab === 'country' && (
          <CountryInfoCard country={countryData} isLoading={isLoadingCountry} />
        )}
      </div>
    </div>
  );
};

export default SidePanel;