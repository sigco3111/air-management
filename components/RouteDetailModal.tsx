import React, { useState, useEffect, useMemo } from 'react';
import type { Player, Airport, Route, AircraftModel, Competitor, Alliance } from '../types';
import RouteIcon from './icons/RouteIcon';
import HomeIcon from './icons/HomeIcon';
import UsersGroupIcon from './icons/UsersGroupIcon';
import ExclamationIcon from './icons/ExclamationIcon';
import LinkIcon from './icons/LinkIcon';
import XCircleIcon from './icons/XCircleIcon';

interface RouteDetailModalProps {
  route: Route | null;
  airports: Airport[];
  player: Player;
  aircraftModels: AircraftModel[];
  competitors: Competitor[];
  closedAirports: Set<string>;
  alliances: Alliance[];
  isOpen: boolean;
  onClose: () => void;
  onOpenAssignmentModal: (routeId: string) => void;
  onUnassignAircraft: (routeId: string) => void;
  onUpdateTicketPrice: (routeId: string, newPrice: number) => void;
}

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

const RouteDetailModal: React.FC<RouteDetailModalProps> = ({
  route,
  airports,
  player,
  aircraftModels,
  competitors,
  closedAirports,
  alliances,
  isOpen,
  onClose,
  onOpenAssignmentModal,
  onUnassignAircraft,
  onUpdateTicketPrice,
}) => {
  const [priceInput, setPriceInput] = useState('');

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Update price input when route changes
  useEffect(() => {
    if (route) {
      setPriceInput(String(route.ticketPrice));
    }
  }, [route]);

  // Handle background click
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceInput(e.target.value);
  };

  const handlePriceUpdate = () => {
    if (!route) return;
    
    const newPrice = parseInt(priceInput, 10);
    if (!isNaN(newPrice) && newPrice > 0) {
      onUpdateTicketPrice(route.id, newPrice);
    } else {
      setPriceInput(String(route.ticketPrice));
    }
  };



  const origin = route ? getAirportById(route.origin, airports) : null;
  const destination = route ? getAirportById(route.destination, airports) : null;

  const assignedAircraft = route?.aircraftId ? player.fleet.find(a => a.id === route.aircraftId) : null;
  const aircraftModel = assignedAircraft ? getModelDetails(assignedAircraft.modelId, aircraftModels) : null;

  const competitorsOnRoute = route ? competitors
    .filter(comp => !comp.allianceId || comp.allianceId !== player.allianceId)
    .filter(comp =>
      comp.routes.some(compRoute =>
        (compRoute.origin === route.origin && compRoute.destination === route.destination) ||
        (compRoute.origin === route.destination && compRoute.destination === route.origin)
      )
    ) : [];

  const assignedAircraftLabel = aircraftModel 
    ? (
        <div className="flex items-center space-x-2 justify-end">
          {aircraftModel.imageUrl && <img src={aircraftModel.imageUrl} alt={aircraftModel.name} className="w-8 h-auto" />}
          <span>{aircraftModel.name}</span>
        </div>
      )
    : <span className="text-yellow-400">없음</span>;

  const isRouteClosed = route ? (closedAirports.has(route.origin) || closedAirports.has(route.destination)) : false;

  let estimatedMonthlyIncome = 0;
  let estimatedMonthlyCosts = 0;
  let estimatedMonthlyProfit = 0;
  let marketShare = 1;
  let loadFactor = 0;

  const standardFare = route ? route.distance * 0.30 : 0;

  const benefitsFromAlliance = useMemo(() => {
    if (!player.allianceId || !route) return false;
    const alliance = alliances.find(a => a.id === player.allianceId);
    if (!alliance) return false;
    
    const partners = alliance.members.filter(m => m !== 'player');
    if (partners.length === 0) return false;
    
    const partnerOperatesAtOrigin = competitors.some(c => partners.includes(c.id) && c.allianceId === alliance.id && c.routes.some(r => r.origin === route.origin || r.destination === route.origin));
    const partnerOperatesAtDestination = competitors.some(c => partners.includes(c.id) && c.allianceId === alliance.id && c.routes.some(r => r.origin === route.destination || r.destination === route.destination));
    
    return partnerOperatesAtOrigin || partnerOperatesAtDestination;
  }, [player.allianceId, alliances, competitors, route?.origin, route?.destination]);

  if (assignedAircraft && aircraftModel && player.fuelPrice && route) {
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

    const isHubRouteForDemand = player.hubAirportId && (route.origin === player.hubAirportId || route.destination === player.hubAirportId);
    if (isHubRouteForDemand) {
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

  const isHubRoute = route && player.hubAirportId && (route.origin === player.hubAirportId || route.destination === player.hubAirportId);

  if (!isOpen || !route || !origin || !destination) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={handleBackgroundClick}
    >
      <div 
        className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-100 opacity-100 mx-2 sm:mx-0 modal-container modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <h2 className="text-lg sm:text-xl font-bold text-white">노선 상세 정보</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700"
            aria-label="모달 닫기"
          >
            <XCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          {/* Route Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h3 className="font-bold text-lg text-white">
                {origin.city} ({origin.id})
              </h3>
              <RouteIcon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
              <h3 className="font-bold text-lg text-white">
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

          {/* Route Details */}
          <div className="space-y-3 mb-6">
            <InfoItem label="거리" value={`${route.distance.toLocaleString()} km`} />
            <InfoItem label="배정 항공기" value={assignedAircraftLabel} />
            <InfoItem label="기준 운임" value={<span className="font-mono">${standardFare.toLocaleString()}</span>} />
            
            {/* Ticket Price Input */}
            <div className="flex justify-between items-center text-sm">
              <label htmlFor={`modal-price-${route.id}`} className="text-slate-400">티켓 가격</label>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-slate-200 font-mono">$</span>
                <input
                  id={`modal-price-${route.id}`}
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
                    {estimatedMonthlyProfit >= 0 ? `+${estimatedMonthlyProfit.toLocaleString()}` : `-${Math.abs(estimatedMonthlyProfit).toLocaleString()}`}
                  </span>
                : 'N/A'
              } 
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onOpenAssignmentModal(route.id)}
              className="flex-1 bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors"
              disabled={isRouteClosed}
            >
              {assignedAircraft ? '배정 변경' : '항공기 배정'}
            </button>
            {assignedAircraft && (
              <button
                onClick={() => onUnassignAircraft(route.id)}
                className="flex-1 bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-colors"
                disabled={isRouteClosed}
              >
                배정 해제
              </button>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Mobile-first responsive design for modal */
        @media (max-width: 480px) {
          .modal-container {
            margin: 0;
            border-radius: 0;
            max-height: 100vh;
            height: 100vh;
          }
        }
        
        /* Tablet adjustments */
        @media (min-width: 481px) and (max-width: 768px) {
          .modal-container {
            max-width: 90vw;
          }
        }
        
        /* Ensure proper touch scrolling on mobile */
        .modal-content {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default RouteDetailModal;