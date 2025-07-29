


import React, { useState, useEffect, useMemo } from 'react';
import type { Player, Airport, Route, AircraftModel, Competitor, Alliance } from '../types';
import RouteIcon from './icons/RouteIcon';
import Pagination from './Pagination';
import HomeIcon from './icons/HomeIcon';
import UsersGroupIcon from './icons/UsersGroupIcon';
import ExclamationIcon from './icons/ExclamationIcon';
import LinkIcon from './icons/LinkIcon';

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

const ITEMS_PER_PAGE = 2;
const BASE_AIRPORT_FEE_PER_FLIGHT = 500;
const AI_COMPETITIVENESS_SCORE = 1.0;

const getAirportById = (id: string, airports: Airport[]) => airports.find(a => a.id === id);
const getModelDetails = (modelId: string, models: AircraftModel[]) => models.find(m => m.id === modelId);

const InfoItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="font-medium text-slate-200 text-right">{value}</span>
  </div>
);

interface RouteCardProps {
    route: Route;
    airports: Airport[];
    player: Player;
    aircraftModels: AircraftModel[];
    onOpenAssignmentModal: (routeId: string) => void;
    onUnassignAircraft: (routeId: string) => void;
    onUpdateTicketPrice: (routeId: string, newPrice: number) => void;
    competitors: Competitor[];
    closedAirports: Set<string>;
    alliances: Alliance[];
}


const RouteCard = ({ route, airports, player, aircraftModels, onOpenAssignmentModal, onUnassignAircraft, onUpdateTicketPrice, competitors, closedAirports, alliances }: RouteCardProps) => {
    const origin = getAirportById(route.origin, airports);
    const destination = getAirportById(route.destination, airports);

    const [priceInput, setPriceInput] = useState(String(route.ticketPrice));

    const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPriceInput(e.target.value);
    };
    
    const handlePriceUpdate = () => {
        const newPrice = parseInt(priceInput, 10);
        if (!isNaN(newPrice) && newPrice > 0) {
            onUpdateTicketPrice(route.id, newPrice);
        } else {
            setPriceInput(String(route.ticketPrice));
        }
    };
    
    useEffect(() => {
        setPriceInput(String(route.ticketPrice));
    }, [route.ticketPrice]);
    
    const assignedAircraft = route.aircraftId ? player.fleet.find(a => a.id === route.aircraftId) : null;
    const aircraftModel = assignedAircraft ? getModelDetails(assignedAircraft.modelId, aircraftModels) : null;

    if (!origin || !destination) {
        return null;
    }
    
    const competitorsOnRoute = competitors
        .filter(comp => !comp.allianceId || comp.allianceId !== player.allianceId)
        .filter(comp =>
            comp.routes.some(compRoute =>
                (compRoute.origin === route.origin && compRoute.destination === route.destination) ||
                (compRoute.origin === route.destination && compRoute.destination === route.origin)
            )
        );

    const assignedAircraftLabel = aircraftModel 
        ? (
            <div className="flex items-center space-x-2 justify-end">
                {aircraftModel.imageUrl && <img src={aircraftModel.imageUrl} alt={aircraftModel.name} className="w-8 h-auto" />}
                <span>{aircraftModel.name}</span>
            </div>
        )
        : <span className="text-yellow-400">없음</span>;

    const isRouteClosed = closedAirports.has(route.origin) || closedAirports.has(route.destination);

    let estimatedMonthlyIncome = 0;
    let estimatedMonthlyCosts = 0;
    let estimatedMonthlyProfit = 0;
    let marketShare = 1;
    let loadFactor = 0;
    
    const standardFare = route.distance * 0.30;
    
    const benefitsFromAlliance = useMemo(() => {
        if (!player.allianceId) return false;
        const alliance = alliances.find(a => a.id === player.allianceId);
        if (!alliance) return false;
        
        const partners = alliance.members.filter(m => m !== 'player');
        if (partners.length === 0) return false;
        
        const partnerOperatesAtOrigin = competitors.some(c => partners.includes(c.id) && c.allianceId === alliance.id && c.routes.some(r => r.origin === route.origin || r.destination === route.origin));
        const partnerOperatesAtDestination = competitors.some(c => partners.includes(c.id) && c.allianceId === alliance.id && c.routes.some(r => r.origin === route.destination || r.destination === route.destination));
        
        return partnerOperatesAtOrigin || partnerOperatesAtDestination;
    }, [player.allianceId, alliances, competitors, route.origin, route.destination]);

    if (assignedAircraft && aircraftModel && player.fuelPrice) {
        // Market Share Calculation
        const playerPriceFactor = standardFare > 0 ? Math.max(0.1, standardFare / route.ticketPrice) : 1;
        const playerSatisfactionFactor = player.satisfaction / 50;
        const brandAwarenessFactor = 0.8 + (player.brandAwareness / 100) * 0.4;
        const playerScore = playerPriceFactor * playerSatisfactionFactor * brandAwarenessFactor;
        const totalScore = playerScore + (competitorsOnRoute.length * AI_COMPETITIVENESS_SCORE);
        marketShare = totalScore > 0 ? playerScore / totalScore : 0;
        if (competitorsOnRoute.length === 0) marketShare = 1;

        // Demand Calculation
        const satisfactionMultiplier = 0.5 + (player.satisfaction / 100);
        let routeBaseDemand = route.baseDemand * player.researchModifiers.baseDemand;

        if (benefitsFromAlliance) {
            routeBaseDemand *= 1.05;
        }

        const regionalDemandModifiers = new Map<string, number>();
        player.activeMarketingCampaigns.forEach(campaign => {
            if (campaign.effects.regionalDemandModifier) {
                const { region, multiplier } = campaign.effects.regionalDemandModifier;
                const currentMultiplier = regionalDemandModifiers.get(region) || 1;
                regionalDemandModifiers.set(region, currentMultiplier * multiplier);
            }
        });
        const originRegionModifier = regionalDemandModifiers.get(origin.region) || 1;
        const destinationRegionModifier = regionalDemandModifiers.get(destination.region) || 1;
        routeBaseDemand *= Math.max(originRegionModifier, destinationRegionModifier);

        const isHubRoute = player.hubAirportId && (route.origin === player.hubAirportId || route.destination === player.hubAirportId);
        if (isHubRoute) {
            routeBaseDemand = Math.round(routeBaseDemand * 1.2);
        }
        const demandForPlayer = routeBaseDemand * marketShare;
        const modifiedDemand = Math.round(demandForPlayer * satisfactionMultiplier);
        const dailyPassengers = Math.min(aircraftModel.seats, modifiedDemand);
        loadFactor = Math.round((dailyPassengers / aircraftModel.seats) * 100);
        estimatedMonthlyIncome = Math.round(dailyPassengers * route.ticketPrice * 30);

        // Cost Calculation
        const fuelCost = route.distance * 2 * 30 * aircraftModel.fuelEfficiency * player.fuelPrice;
        let dailyAirportFee = BASE_AIRPORT_FEE_PER_FLIGHT * 2;
        if (player.hubAirportId) {
            let discount = 0;
            if (route.origin === player.hubAirportId) discount += BASE_AIRPORT_FEE_PER_FLIGHT * 0.5;
            if (route.destination === player.hubAirportId) discount += BASE_AIRPORT_FEE_PER_FLIGHT * 0.5;
            dailyAirportFee -= discount;
        }
        const airportFee = dailyAirportFee * 30;
        estimatedMonthlyCosts = Math.round(fuelCost + airportFee);
        
        // Profit Calculation
        estimatedMonthlyProfit = estimatedMonthlyIncome - estimatedMonthlyCosts;
    }
    
    if (isRouteClosed) {
        estimatedMonthlyIncome = 0;
        estimatedMonthlyCosts = 0;
        estimatedMonthlyProfit = 0;
        marketShare = 0;
        loadFactor = 0;
    }

    const isHubRoute = player.hubAirportId && (route.origin === player.hubAirportId || route.destination === player.hubAirportId);

    return (
        <li className="bg-slate-800 rounded-lg p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-base text-white truncate">
                    {origin.city} ({origin.id})
                    </h3>
                    <RouteIcon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <h3 className="font-bold text-base text-white truncate">
                    {destination.city} ({destination.id})
                    </h3>
                </div>
                <div className="flex items-center space-x-2">
                    {isRouteClosed && (
                        <div className="flex items-center space-x-1 text-xs font-semibold text-red-400 bg-red-900/50 px-2 py-1 rounded-full" title="공항 폐쇄로 운항 중단">
                            <ExclamationIcon className="w-4 h-4" />
                            <span>운항 중단</span>
                        </div>
                    )}
                    {competitorsOnRoute.length > 0 && !isRouteClosed && (
                        <div className="flex items-center space-x-1 text-xs font-semibold text-yellow-400 bg-yellow-900/50 px-2 py-1 rounded-full" title={`경쟁사: ${competitorsOnRoute.map(c => c.name).join(', ')}`}>
                            <UsersGroupIcon className="w-4 h-4" />
                            <span>{competitorsOnRoute.length}개사 경쟁</span>
                        </div>
                    )}
                    {benefitsFromAlliance && (
                        <div className="flex items-center space-x-1 text-xs font-semibold text-blue-400 bg-blue-900/50 px-2 py-1 rounded-full" title="동맹 네트워크 보너스">
                            <LinkIcon className="w-3.5 h-3.5" />
                            <span>동맹</span>
                        </div>
                    )}
                    {isHubRoute && (
                        <div className="flex items-center space-x-1 text-xs font-semibold text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded-full" title="허브 노선">
                            <HomeIcon className="w-3.5 h-3.5" />
                            <span>허브</span>
                        </div>
                    )}
                </div>
            </div>
             <div className="space-y-1.5 text-sm border-t border-slate-700 pt-3">
                <InfoItem label="거리" value={`${route.distance.toLocaleString()} km`} />
                <InfoItem label="배정 항공기" value={assignedAircraftLabel} />
                 <InfoItem label="기준 운임" value={<span className="font-mono">${standardFare.toLocaleString()}</span>} />
                 <div className="flex justify-between items-center text-sm">
                    <label htmlFor={`price-${route.id}`} className="text-slate-400">티켓 가격</label>
                    <div className="flex items-center space-x-1">
                        <span className="font-medium text-slate-200 font-mono">$</span>
                        <input
                            id={`price-${route.id}`}
                            type="number"
                            value={priceInput}
                            onChange={handlePriceInputChange}
                            onBlur={handlePriceUpdate}
                            className="w-24 bg-slate-900 text-white font-mono text-right rounded-md p-1 border border-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                            min="0"
                            disabled={isRouteClosed}
                        />
                    </div>
                </div>
                 <InfoItem 
                    label="예상 시장 점유율" 
                    value={
                        assignedAircraft 
                        ? <span className="font-mono" style={{ color: `hsl(${marketShare * 120}, 70%, 60%)` }}>
                            {Math.round(marketShare * 100)}%
                          </span>
                        : 'N/A'
                    } 
                />
                <InfoItem
                    label="예상 탑승률"
                    value={
                        assignedAircraft
                        ? <span className="font-mono" style={{ color: `hsl(${loadFactor * 1.2}, 70%, 60%)` }}>
                            {loadFactor}%
                          </span>
                        : 'N/A'
                    }
                />
                 <InfoItem 
                    label="월 예상 수입" 
                    value={
                        assignedAircraft 
                        ? <span className="text-green-400 font-mono">${estimatedMonthlyIncome.toLocaleString()}</span>
                        : 'N/A'
                    } 
                />
                 <InfoItem 
                    label="월 운영 비용" 
                    value={
                        assignedAircraft 
                        ? <span className="text-red-400 font-mono">-${estimatedMonthlyCosts.toLocaleString()}</span>
                        : 'N/A'
                    } 
                />
                 <InfoItem 
                    label="월 예상 순이익" 
                    value={
                        assignedAircraft 
                        ? <span className={`font-mono font-bold ${estimatedMonthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {estimatedMonthlyProfit >= 0 ? `+$${estimatedMonthlyProfit.toLocaleString()}` : `-$${Math.abs(estimatedMonthlyProfit).toLocaleString()}`}
                          </span>
                        : 'N/A'
                    } 
                />
            </div>
            <div className="mt-2 flex items-center space-x-2">
                <button
                    onClick={() => onOpenAssignmentModal(route.id)}
                    className="w-full bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors"
                    disabled={isRouteClosed}
                >
                    {assignedAircraft ? '배정 변경' : '항공기 배정'}
                </button>
                {assignedAircraft && (
                    <button
                        onClick={() => onUnassignAircraft(route.id)}
                        className="w-full bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-colors"
                        disabled={isRouteClosed}
                    >
                        배정 해제
                    </button>
                )}
            </div>
        </li>
    );
};


const RouteManagement: React.FC<RouteManagementProps> = ({ player, airports, aircraftModels, onOpenAssignmentModal, onUnassignAircraft, onUpdateTicketPrice, competitors, closedAirports, alliances }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!player) {
    return <div className="p-4 text-center text-slate-400">플레이어 정보를 불러오는 중입니다...</div>;
  }
  
  const totalPages = Math.ceil(player.routes.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [player.routes.length, totalPages, currentPage]);

  const paginatedRoutes = player.routes.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

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
    <div className="p-4">
      <ul className="space-y-4">
        {paginatedRoutes.map(route => (
          <RouteCard
            key={route.id}
            route={route}
            airports={airports}
            player={player}
            aircraftModels={aircraftModels}
            onOpenAssignmentModal={onOpenAssignmentModal}
            onUnassignAircraft={onUnassignAircraft}
            onUpdateTicketPrice={onUpdateTicketPrice}
            competitors={competitors}
            closedAirports={closedAirports}
            alliances={alliances}
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

export default RouteManagement;