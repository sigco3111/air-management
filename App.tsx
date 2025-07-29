

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Header from './components/Header';
import WorldMap from './components/WorldMap';
import SidePanel from './components/SidePanel';
import Footer from './components/Footer';
import GameSetup from './components/GameSetup';
import RoutePlanner from './components/RoutePlanner';
import AircraftAssignmentModal from './components/AircraftAssignmentModal';
import FinancialReportModal from './components/FinancialReportModal';
import EventNotificationModal from './components/EventNotificationModal';
import HubSelectionModal from './components/HubSelectionModal';
import GameOverModal from './components/GameOverModal';
import AirportDetailModal from './components/AirportDetailModal';
import Toast from './components/Toast';
import RankingsModal from './components/RankingsModal';
import HelpModal from './components/HelpModal';
import { fetchCountryData } from './services/countryService';
import type { Country, Tooltip, Player, AircraftModel, AircraftInstance, SidePanelTab, Airport, Route, ActiveGameEvent, FinancialReportData, Competitor, ResearchProject, MarketingCampaign, ActiveMarketingCampaign, Alliance } from './types';
import { AIRCRAFT_MODELS } from './data/aircrafts';
import { AIRPORTS } from './data/airports';
import { GAME_EVENTS } from './data/events';
import { RESEARCH_PROJECTS } from './data/research';
import { MARKETING_CAMPAIGNS } from './data/marketing';
import { calculateDistance } from './utils/geolocation';

const BASE_FUEL_PRICE = 1.2; // $/L
const BASE_AIRPORT_FEE_PER_FLIGHT = 500; // $ per flight (takeoff or landing)
const HUB_DEMAND_MULTIPLIER = 1.2;
const HUB_FEE_DISCOUNT = 0.5; // 50% discount
const BASE_SALARY_COST = 200_000;
const SALARY_PER_AIRCRAFT = 40_000;
const SALARY_PER_ROUTE = 15_000;
const AI_COMPETITIVENESS_SCORE = 1.0;
const ALLIANCE_FORMATION_COST = 100_000_000;
const ALLIANCE_SATISFACTION_BONUS = 2;
const ALLIANCE_DEMAND_BONUS = 1.05; // 5%
const SAVE_GAME_KEY = 'air-management-savegame';

const dateReviver = (key: string, value: any) => {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  if (typeof value === 'string' && iso8601Regex.test(value)) {
    return new Date(value);
  }
  return value;
};


const App: React.FC = () => {
  // Core App State
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [countryData, setCountryData] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tooltip, setTooltip] = useState<Tooltip>({ show: false, x: 0, y: 0, content: '' });
  const [activeSidePanelTab, setActiveSidePanelTab] = useState<SidePanelTab>('dashboard');

  // Game State
  const [gameState, setGameState] = useState<'SETUP' | 'PLAYING' | 'GAME_OVER'>('SETUP');
  const [player, setPlayer] = useState<Player | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  const [gameDate, setGameDate] = useState(new Date('2024-01-01'));
  const [gameSpeed, setGameSpeed] = useState(0); // Game starts paused
  const [lastSpeed, setLastSpeed] = useState(1);
  const [routeEndpoints, setRouteEndpoints] = useState<string[]>([]);
  const [routeToAssign, setRouteToAssign] = useState<Route | null>(null);
  const [financialReport, setFinancialReport] = useState<FinancialReportData | null>(null);
  const [eventToShow, setEventToShow] = useState<ActiveGameEvent | null>(null);
  const [lastProcessedMonth, setLastProcessedMonth] = useState<number>(gameDate.getMonth());
  const [activeEvents, setActiveEvents] = useState<ActiveGameEvent[]>([]);
  const [eventHistory, setEventHistory] = useState<ActiveGameEvent[]>([]);
  const [isHubModalOpen, setIsHubModalOpen] = useState(false);
  const [isRankingsModalOpen, setIsRankingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [airportToView, setAirportToView] = useState<Airport | null>(null);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });


  const speedBeforeReport = useRef<number>(0);

  useEffect(() => {
    const savedGame = localStorage.getItem(SAVE_GAME_KEY);
    if (savedGame) {
        setHasSaveData(true);
    }
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const closedAirports = useMemo(() => {
    const closed = new Set<string>();
    activeEvents.forEach(event => {
        event.effects.airportEffects?.forEach(effect => {
            if (effect.isClosed) {
                closed.add(effect.airportId);
            }
        });
    });
    return closed;
  }, [activeEvents]);


  const handleCountryClick = useCallback((code: string | null) => {
    if (code && code === selectedCountryCode) {
      // Clicked the same country again: deselect
      setSelectedCountryCode(null);
      setCountryData(null);
      setActiveSidePanelTab('dashboard');
    } else if (code) {
      // Clicked a new or first country
      setSelectedCountryCode(code);
      setActiveSidePanelTab('country');
      setRouteEndpoints([]);
    }
  }, [selectedCountryCode]);

  useEffect(() => {
    const getCountryInfo = async () => {
      if (!selectedCountryCode) {
        setCountryData(null);
        return;
      }
      setIsLoading(true);
      const data = await fetchCountryData(selectedCountryCode);
      setCountryData(data);
      setIsLoading(false);
    };

    getCountryInfo();
  }, [selectedCountryCode]);
  
  // Game Loop
  useEffect(() => {
    if (gameSpeed === 0 || gameState !== 'PLAYING') {
      return;
    }

    const baseInterval = 1000; // ms for 1x speed (1 day)
    const intervalDuration = baseInterval / gameSpeed;

    const intervalId = setInterval(() => {
      setGameDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
      });
    }, intervalDuration);

    return () => clearInterval(intervalId);
  }, [gameSpeed, gameState]);

  // Daily processing
  useEffect(() => {
    if (!player || gameState !== 'PLAYING') return;

    // Research Completion Check
    if (player.activeResearch) {
        const research = player.activeResearch;
        const researchEndDate = new Date(research.startDate);
        researchEndDate.setDate(researchEndDate.getDate() + research.durationDays);

        if (gameDate >= researchEndDate) {
            setPlayer(p => {
                if (!p) return null;

                const newModifiers = { ...p.researchModifiers };
                let satisfactionChange = 0;
                let serviceQualityChange = 0;
                let cashChange = 0;

                if (research.effects.fuelEfficiencyModifier) {
                    newModifiers.fuelEfficiency *= research.effects.fuelEfficiencyModifier;
                }
                if (research.effects.maintenanceModifier) {
                    newModifiers.maintenance *= research.effects.maintenanceModifier;
                }
                if (research.effects.baseDemandModifier) {
                    newModifiers.baseDemand *= research.effects.baseDemandModifier;
                }
                if (research.effects.satisfaction) {
                    satisfactionChange = research.effects.satisfaction;
                }
                if (research.effects.serviceQuality) {
                    serviceQualityChange = research.effects.serviceQuality;
                }
                if (research.effects.cash) {
                    cashChange = research.effects.cash;
                }

                return {
                    ...p,
                    cash: p.cash + cashChange,
                    satisfaction: Math.max(0, Math.min(100, p.satisfaction + satisfactionChange)),
                    serviceQuality: Math.max(0, Math.min(100, p.serviceQuality + serviceQualityChange)),
                    activeResearch: null,
                    completedResearch: [...p.completedResearch, research.id],
                    researchModifiers: newModifiers
                };
            });
            
            const completionEvent: ActiveGameEvent = {
                id: `research_complete_${research.id}_${Date.now()}`,
                title: '연구 완료!',
                description: `"${research.name}" 연구가 완료되어 효과가 적용됩니다.`,
                type: 'positive',
                durationDays: 0,
                effects: {},
                startDate: gameDate,
                expiryDate: gameDate,
            };
            setEventToShow(completionEvent);
        }
    }
    
    // Marketing Campaign Expiry Check
    if (player.activeMarketingCampaigns.length > 0) {
        setPlayer(p => {
            if (!p) return null;
            const updatedCampaigns = p.activeMarketingCampaigns.filter(c => gameDate < c.expiryDate);
            if (updatedCampaigns.length < p.activeMarketingCampaigns.length) {
                return { ...p, activeMarketingCampaigns: updatedCampaigns };
            }
            return p;
        });
    }

  }, [gameDate, player, gameState]);


  // Game Over check
  useEffect(() => {
    if (player && player.cash < 0 && gameState === 'PLAYING') {
      setGameState('GAME_OVER');
      if (gameSpeed > 0) {
        setGameSpeed(0); // Pause the game
      }
    }
  }, [player, gameState, gameSpeed]);


  // Monthly financial and satisfaction calculations
  useEffect(() => {
    if (!player || gameState !== 'PLAYING' || financialReport || eventToShow) return;

    if (gameDate.getMonth() !== lastProcessedMonth) {
        const prevMonthDate = new Date(gameDate);
        prevMonthDate.setDate(0); // This sets the date to the last day of the previous month
        const daysInMonth = prevMonthDate.getDate();
        
        // --- AI Competitor Logic ---
        setCompetitors(prevCompetitors => {
            let turnCompetitors = JSON.parse(JSON.stringify(prevCompetitors), dateReviver);

            turnCompetitors = turnCompetitors.map((comp: Competitor) => {
                let updatedComp = { ...comp };
                const currentFuelPrice = player?.fuelPrice || BASE_FUEL_PRICE;

                // 1. AI Financials Simulation
                let income = 0;
                let expenses = 0;
                
                updatedComp.routes.forEach(route => {
                    const aircraft = updatedComp.fleet.find(a => a.routeId === route.id);
                    const model = aircraft ? AIRCRAFT_MODELS.find(m => m.id === aircraft.modelId) : null;
                    if (aircraft && model) {
                        const standardFare = route.distance * 0.30;
                        const dailyPassengers = model.seats * 0.7; 
                        income += dailyPassengers * standardFare * daysInMonth;

                        const fuelCost = route.distance * 2 * daysInMonth * model.fuelEfficiency * currentFuelPrice;
                        const airportFee = BASE_AIRPORT_FEE_PER_FLIGHT * 2 * daysInMonth;
                        expenses += fuelCost + airportFee;
                    }
                });
                
                const maintenance = updatedComp.fleet.reduce((acc, aircraft) => {
                    const model = AIRCRAFT_MODELS.find(m => m.id === aircraft.modelId);
                    return acc + (model?.monthlyMaintenance || 0);
                }, 0);
                expenses += maintenance;

                updatedComp.cash += (income - expenses);


                // 2. AI Aircraft Purchase Logic (20% chance if they have cash)
                if (Math.random() < 0.2) {
                    const affordableModels = AIRCRAFT_MODELS.filter(m => m.price < updatedComp.cash * 0.5); // Don't spend all cash
                    if (affordableModels.length > 0) {
                        const modelToBuy = affordableModels[Math.floor(Math.random() * affordableModels.length)];
                        updatedComp.cash -= modelToBuy.price;
                        const newAircraft: AircraftInstance = {
                            id: Date.now() + Math.random(),
                            modelId: modelToBuy.id,
                            purchaseDate: gameDate,
                            age: 0,
                            status: 'idle',
                        };
                        updatedComp.fleet = [...updatedComp.fleet, newAircraft];
                    }
                }
                
                // 3. AI Route Expansion & Competition Logic
                const idleAircraft = updatedComp.fleet.find(a => a.status === 'idle');
                if (idleAircraft) {
                    const model = AIRCRAFT_MODELS.find(m => m.id === idleAircraft.modelId);
                    let routeToOpen: Route | null = null;

                    if (model) {
                        const competitorIsInAllianceWithPlayer = player && player.allianceId && player.allianceId === updatedComp.allianceId;
                        // Decision 1: Compete with player (30% chance, but not if in alliance)
                        if (player && player.routes.length > 0 && Math.random() < 0.3 && !competitorIsInAllianceWithPlayer) {
                            const potentialTargets = player.routes.filter(playerRoute =>
                                playerRoute.aircraftId && // It's an active route
                                playerRoute.distance < model.range && // Can our plane fly it?
                                !updatedComp.routes.some(r => // Don't we fly it already?
                                    (r.origin === playerRoute.origin && r.destination === playerRoute.destination) ||
                                    (r.origin === playerRoute.destination && r.destination === playerRoute.origin)
                                )
                            );

                            if (potentialTargets.length > 0) {
                                const targetRoute = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
                                const originAirport = AIRPORTS.find(a => a.id === targetRoute.origin);
                                const destinationAirport = AIRPORTS.find(a => a.id === targetRoute.destination);
                                
                                if (originAirport && destinationAirport) {
                                    const baseDemand = Math.max(20, Math.round((originAirport.size * destinationAirport.size) * 20 + (5000 - targetRoute.distance) / 10));
                                    routeToOpen = {
                                        id: `${updatedComp.id}-${targetRoute.origin}-${targetRoute.destination}-${Date.now()}`,
                                        origin: targetRoute.origin,
                                        destination: targetRoute.destination,
                                        distance: targetRoute.distance,
                                        ticketPrice: targetRoute.distance * 0.30,
                                        baseDemand: baseDemand,
                                        aircraftId: idleAircraft.id
                                    };
                                }
                            }
                        }

                        // Decision 2: If no competition route was chosen, try random expansion (50% chance)
                        if (!routeToOpen && Math.random() < 0.5) {
                            const potentialOrigins = AIRPORTS.filter(a => a.size > 2);
                            if (potentialOrigins.length > 0) {
                                const originAirport = potentialOrigins[Math.floor(Math.random() * potentialOrigins.length)];
                                
                                const potentialDestinations = AIRPORTS.filter(a => 
                                    a.id !== originAirport.id &&
                                    calculateDistance(originAirport.lat, originAirport.lon, a.lat, a.lon) < model.range &&
                                    !updatedComp.routes.some(r => (r.origin === originAirport.id && r.destination === a.id) || (r.origin === a.id && r.destination === originAirport.id))
                                );

                                if (potentialDestinations.length > 0) {
                                    const destinationAirport = potentialDestinations[Math.floor(Math.random() * potentialDestinations.length)];
                                    const distance = calculateDistance(originAirport.lat, originAirport.lon, destinationAirport.lat, destinationAirport.lon);
                                    const baseDemand = Math.max(20, Math.round((originAirport.size * destinationAirport.size) * 20 + (5000 - distance) / 10));

                                    routeToOpen = {
                                        id: `${updatedComp.id}-${originAirport.id}-${destinationAirport.id}-${Date.now()}`,
                                        origin: originAirport.id,
                                        destination: destinationAirport.id,
                                        distance: distance,
                                        ticketPrice: distance * 0.30,
                                        baseDemand: baseDemand,
                                        aircraftId: idleAircraft.id
                                    };
                                }
                            }
                        }
                    }
                    
                    if (routeToOpen) {
                        const fleetIndex = updatedComp.fleet.findIndex(a => a.id === idleAircraft.id);
                        if (fleetIndex !== -1) {
                            const finalRouteToOpen = routeToOpen;
                            updatedComp.fleet[fleetIndex] = { ...idleAircraft, status: 'in_service', routeId: finalRouteToOpen.id };
                            updatedComp.routes = [...updatedComp.routes, finalRouteToOpen];
                        }
                    }
                }
                return updatedComp;
            });

            // Process AI alliance formation
            const nonAlliedAIs = turnCompetitors.filter((c: Competitor) => !c.allianceId);
            if (nonAlliedAIs.length >= 2 && Math.random() < 0.05) { // 5% chance per month
                const [c1, c2] = nonAlliedAIs.sort(() => 0.5 - Math.random());
                const newAlliance: Alliance = {
                    id: `alliance-ai-${Date.now()}`,
                    name: `${c1.name.split(' ')[0]} & ${c2.name.split(' ')[0]} Union`,
                    members: [c1.id, c2.id],
                };
                setAlliances(prev => [...prev, newAlliance]);
                turnCompetitors = turnCompetitors.map((c: Competitor) => {
                    if (c.id === c1.id || c.id === c2.id) {
                        return { ...c, allianceId: newAlliance.id };
                    }
                    return c;
                });
            }

            return turnCompetitors;
        });

        
        // --- Event Processing ---
        // 1. Expire old events
        setActiveEvents(prevEvents => prevEvents.filter(event => gameDate < event.expiryDate));

        // 2. Trigger new event (30% chance each month)
        if (Math.random() < 0.3) {
            const newEvent = GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)];
            const startDate = new Date(gameDate);
            const expiryDate = new Date(gameDate);
            expiryDate.setDate(startDate.getDate() + newEvent.durationDays);

            const activeEvent: ActiveGameEvent = { ...newEvent, startDate, expiryDate };

            setPlayer(p => {
                if (!p) return null;
                const cashChange = newEvent.effects.cash || 0;
                const satisfactionChange = newEvent.effects.satisfaction || 0;
                return {
                    ...p,
                    cash: p.cash + cashChange,
                    satisfaction: Math.max(0, Math.min(100, p.satisfaction + satisfactionChange)),
                };
            });
            
            if (newEvent.durationDays > 0) {
                setActiveEvents(prev => [...prev, activeEvent]);
            }
            setEventHistory(prev => [activeEvent, ...prev].slice(0, 20)); // Keep last 20 events
            setEventToShow(activeEvent);
        }
        
        // --- Aggregate Effects ---
        const incomeModifier = activeEvents.reduce((mod, event) => mod * (event.effects.incomeModifier || 1), 1);
        const expenseModifier = activeEvents.reduce((mod, event) => mod * (event.effects.expenseModifier || 1), 1);
        const fuelPriceModifier = activeEvents.reduce((mod, event) => mod * (event.effects.fuelPriceModifier || 1), 1);
        const currentFuelPrice = BASE_FUEL_PRICE * fuelPriceModifier * player.researchModifiers.fuelEfficiency;
        
        const airportDemandModifiers = new Map<string, number>();
        activeEvents.forEach(event => {
            if (event.effects.airportEffects) {
                event.effects.airportEffects.forEach(effect => {
                    if (effect.demandMultiplier) {
                        const currentMultiplier = airportDemandModifiers.get(effect.airportId) || 1;
                        airportDemandModifiers.set(effect.airportId, currentMultiplier * effect.demandMultiplier);
                    }
                });
            }
        });

        const regionalDemandModifiers = new Map<string, number>();
        player.activeMarketingCampaigns.forEach(campaign => {
            if (campaign.effects.regionalDemandModifier) {
                const { region, multiplier } = campaign.effects.regionalDemandModifier;
                const currentMultiplier = regionalDemandModifiers.get(region) || 1;
                regionalDemandModifiers.set(region, currentMultiplier * multiplier);
            }
        });

        // --- On-Time Performance Calculation ---
        let newOnTimePerformance = player.onTimePerformance;
        player.fleet.forEach(aircraft => {
            if (aircraft.status === 'in_service') {
                const ageInYears = (gameDate.getTime() - aircraft.purchaseDate.getTime()) / (1000 * 365.25 * 24 * 60 * 60);
                if (ageInYears > 20 && Math.random() < 0.02) { // 2% chance per month for old aircraft
                    newOnTimePerformance -= 0.1;
                }
            }
        });
        // small random recovery
        if (Math.random() < 0.2) {
            newOnTimePerformance += 0.05;
        }
        newOnTimePerformance = Math.max(70, Math.min(99, newOnTimePerformance));


        // --- Satisfaction Calculation ---
        let satisfactionPoints = 0;
        let activeRoutesCount = 0;

        player.routes.forEach(route => {
            if (!route.aircraftId) return;
            const aircraft = player.fleet.find(a => a.id === route.aircraftId);
            if (!aircraft) return;
            
            activeRoutesCount++;
            
            const standardFare = route.distance * 0.30;
            const priceRatio = route.ticketPrice / standardFare;
            
            let priceSatisfaction = 0;
            if (priceRatio < 0.8) priceSatisfaction = 1.5;
            else if (priceRatio < 1.0) priceSatisfaction = 1.0;
            else if (priceRatio < 1.2) priceSatisfaction = -0.5;
            else if (priceRatio < 1.5) priceSatisfaction = -1.5;
            else priceSatisfaction = -3.0;
            satisfactionPoints += priceSatisfaction;
            
            const ageInYears = (gameDate.getTime() - aircraft.purchaseDate.getTime()) / (1000 * 365.25 * 24 * 60 * 60);
            let ageSatisfaction = 0;
            if (ageInYears > 25) ageSatisfaction = -2.0;
            else if (ageInYears > 15) ageSatisfaction = -1.0;
            else if (ageInYears < 5) ageSatisfaction = 0.5;
            satisfactionPoints += ageSatisfaction;
        });
        
        const averageSatisfactionChange = activeRoutesCount > 0 ? satisfactionPoints / activeRoutesCount : 0;

        const serviceQualityEffect = (player.serviceQuality - 70) / 20;
        const onTimePerformanceEffect = (newOnTimePerformance - 90) / 10;
        
        let monthlySatisfaction = player.satisfaction + averageSatisfactionChange + serviceQualityEffect + onTimePerformanceEffect;
        
        if (player.allianceId) {
            monthlySatisfaction += ALLIANCE_SATISFACTION_BONUS;
        }

        const newSatisfaction = Math.max(0, Math.min(100, monthlySatisfaction));

        // --- Financial Calculation ---
        const satisfactionMultiplier = 0.5 + (newSatisfaction / 100);
        const brandAwarenessFactor = 0.8 + (player.brandAwareness / 100) * 0.4; // 80% at 0, 100% at 50, 120% at 100

        const maintenanceCosts = player.fleet.reduce((acc, aircraft) => {
            const model = AIRCRAFT_MODELS.find(m => m.id === aircraft.modelId);
            return acc + (model?.monthlyMaintenance || 0);
        }, 0) * player.researchModifiers.maintenance;
        
        const salaryCost = BASE_SALARY_COST + 
            (player.fleet.length * SALARY_PER_AIRCRAFT) + 
            (player.routes.length * SALARY_PER_ROUTE);

        let totalFuelCosts = 0;
        let totalAirportFees = 0;
        let totalIncome = 0;

        player.routes.forEach(route => {
            if (!route.aircraftId) return;

            if (closedAirports.has(route.origin) || closedAirports.has(route.destination)) {
                return;
            }

            const aircraft = player.fleet.find(a => a.id === route.aircraftId);
            const model = aircraft ? AIRCRAFT_MODELS.find(m => m.id === aircraft.modelId) : null;
            if (!aircraft || !model) return;
            
            const originAirport = AIRPORTS.find(a => a.id === route.origin);
            const destinationAirport = AIRPORTS.find(a => a.id === route.destination);

            // Income Calculation with Market Competition
            const ticketPrice = route.ticketPrice;
            const standardFare = route.distance * 0.30;

            const competitorsOnRoute = competitors.filter(comp =>
                !comp.allianceId || comp.allianceId !== player.allianceId
            ).filter(comp =>
                comp.routes.some(compRoute =>
                    (compRoute.origin === route.origin && compRoute.destination === route.destination) ||
                    (compRoute.origin === route.destination && compRoute.destination === route.origin)
                )
            );
            
            const playerPriceFactor = standardFare > 0 ? Math.max(0.1, standardFare / ticketPrice) : 1;
            const playerSatisfactionFactor = newSatisfaction / 50;
            const playerScore = playerPriceFactor * playerSatisfactionFactor * brandAwarenessFactor;
            
            const totalScore = playerScore + (competitorsOnRoute.length * AI_COMPETITIVENESS_SCORE);
            const marketShare = totalScore > 0 ? playerScore / totalScore : 0;

            let routeBaseDemand = route.baseDemand * player.researchModifiers.baseDemand;

            // Alliance Demand Bonus
            if (player.allianceId) {
                const alliance = alliances.find(a => a.id === player.allianceId);
                if (alliance) {
                    const partners = alliance.members.filter(m => m !== 'player');
                    const partnerOperatesAtOrigin = competitors.some(c => partners.includes(c.id) && c.routes.some(r => r.origin === route.origin || r.destination === route.origin));
                    const partnerOperatesAtDestination = competitors.some(c => partners.includes(c.id) && c.routes.some(r => r.origin === route.destination || r.destination === route.destination));
                    if (partnerOperatesAtOrigin || partnerOperatesAtDestination) {
                        routeBaseDemand *= ALLIANCE_DEMAND_BONUS;
                    }
                }
            }

            const originEventModifier = airportDemandModifiers.get(route.origin) || 1;
            const destinationEventModifier = airportDemandModifiers.get(route.destination) || 1;
            routeBaseDemand *= Math.max(originEventModifier, destinationEventModifier);
            
            if(originAirport && destinationAirport) {
                const originRegionModifier = regionalDemandModifiers.get(originAirport.region) || 1;
                const destinationRegionModifier = regionalDemandModifiers.get(destinationAirport.region) || 1;
                routeBaseDemand *= Math.max(originRegionModifier, destinationRegionModifier);
            }

            const isHubRoute = player.hubAirportId && (route.origin === player.hubAirportId || route.destination === player.hubAirportId);
            if (isHubRoute) {
                routeBaseDemand = Math.round(routeBaseDemand * HUB_DEMAND_MULTIPLIER);
            }

            const demandForPlayer = routeBaseDemand * marketShare;
            const modifiedDemand = Math.round(demandForPlayer * satisfactionMultiplier);
            const dailyPassengers = Math.min(model.seats, modifiedDemand);
            const monthlyRouteIncome = dailyPassengers * ticketPrice * daysInMonth;
            totalIncome += monthlyRouteIncome;

            const monthlyFuelCost = route.distance * 2 * daysInMonth * model.fuelEfficiency * currentFuelPrice;
            totalFuelCosts += monthlyFuelCost;
            
            let dailyAirportFee = BASE_AIRPORT_FEE_PER_FLIGHT * 2;
            if (player.hubAirportId) {
                let discount = 0;
                if (route.origin === player.hubAirportId) {
                    discount += BASE_AIRPORT_FEE_PER_FLIGHT * HUB_FEE_DISCOUNT;
                }
                if (route.destination === player.hubAirportId) {
                    discount += BASE_AIRPORT_FEE_PER_FLIGHT * HUB_FEE_DISCOUNT;
                }
                dailyAirportFee -= discount;
            }
            const monthlyAirportFee = dailyAirportFee * daysInMonth;
            totalAirportFees += monthlyAirportFee;
        });

        const modifiedIncome = Math.round(totalIncome * incomeModifier);
        const modifiedMaintenance = Math.round(maintenanceCosts * expenseModifier);
        const modifiedAirportFees = Math.round(totalAirportFees * expenseModifier);
        const modifiedSalaries = Math.round(salaryCost * expenseModifier);
        const modifiedFuelCost = Math.round(totalFuelCosts);
        
        const totalExpenses = modifiedMaintenance + modifiedAirportFees + modifiedSalaries + modifiedFuelCost;
        const newPlayerCash = player.cash + modifiedIncome - totalExpenses;

        const reportData: FinancialReportData = {
            month: prevMonthDate,
            income: modifiedIncome,
            expenses: {
                maintenance: modifiedMaintenance,
                fuel: modifiedFuelCost,
                airportFees: modifiedAirportFees,
                salaries: modifiedSalaries,
                total: totalExpenses,
            }
        };

        setPlayer(p => {
            if (!p) return null;
            return {
                ...p,
                cash: newPlayerCash,
                lastMonthIncome: modifiedIncome,
                lastMonthExpense: totalExpenses,
                satisfaction: newSatisfaction,
                onTimePerformance: newOnTimePerformance,
                fuelPrice: currentFuelPrice,
                financialHistory: [...p.financialHistory, reportData],
            };
        });
        
        if (newPlayerCash >= 0) {
            speedBeforeReport.current = gameSpeed;
            if (gameSpeed > 0) {
                setGameSpeed(0);
            }
            
            setFinancialReport(reportData);
        }
        setLastProcessedMonth(gameDate.getMonth());
    }
  }, [gameDate, player, gameState, lastProcessedMonth, financialReport, gameSpeed, activeEvents, eventToShow, competitors, closedAirports, alliances]);

  const handleSpeedChange = (newSpeed: number) => {
    if (newSpeed > 0) {
      setLastSpeed(newSpeed);
    }
    setGameSpeed(newSpeed);
  };
  
  const togglePlayPause = () => {
    setGameSpeed(currentSpeed => (currentSpeed > 0 ? 0 : lastSpeed));
  };

  const handleGameStart = (companyName: string) => {
    localStorage.removeItem(SAVE_GAME_KEY);
    setHasSaveData(false);

    const startDate = new Date('2024-01-01');
    setPlayer({
      companyName,
      cash: 500_000_000,
      fleet: [],
      routes: [],
      satisfaction: 70,
      serviceQuality: 70,
      onTimePerformance: 95,
      brandAwareness: 20,
      fuelPrice: BASE_FUEL_PRICE,
      hubAirportId: null,
      financialHistory: [],
      activeResearch: null,
      completedResearch: [],
      researchModifiers: {
          fuelEfficiency: 1,
          maintenance: 1,
          baseDemand: 1,
      },
      activeMarketingCampaigns: [],
      allianceId: null,
    });
    setGameState('PLAYING');
    setLastProcessedMonth(startDate.getMonth());
    setGameDate(startDate);
    setAlliances([]);
    
    const competitor1Fleet: AircraftInstance[] = [
        { id: Date.now() + Math.random(), modelId: 'B737', purchaseDate: startDate, age: 0, status: 'idle' },
        { id: Date.now() + Math.random(), modelId: 'A320', purchaseDate: startDate, age: 0, status: 'idle' }
    ];
    const competitor2Fleet: AircraftInstance[] = [
        { id: Date.now() + Math.random(), modelId: 'B737', purchaseDate: startDate, age: 0, status: 'idle' },
        { id: Date.now() + Math.random(), modelId: 'E190', purchaseDate: startDate, age: 0, status: 'idle' }
    ];
    const competitor3Fleet: AircraftInstance[] = [
        { id: Date.now() + Math.random(), modelId: 'A320', purchaseDate: startDate, age: 0, status: 'idle' },
        { id: Date.now() + Math.random(), modelId: 'E190', purchaseDate: startDate, age: 0, status: 'idle' }
    ];
    const competitor4Fleet: AircraftInstance[] = [
        { id: Date.now() + Math.random(), modelId: 'B737', purchaseDate: startDate, age: 0, status: 'idle' },
        { id: Date.now() + Math.random(), modelId: 'ATR72', purchaseDate: startDate, age: 0, status: 'idle' }
    ];

    setCompetitors([
        { id: 'ai-1', name: 'Quantum Airlines', routes: [], color: '#F97316', /* orange-500 */ cash: 400_000_000, fleet: competitor1Fleet, allianceId: null },
        { id: 'ai-2', name: 'Starlight Airways', routes: [], color: '#EF4444', /* red-500 */ cash: 350_000_000, fleet: competitor2Fleet, allianceId: null },
        { id: 'ai-3', name: 'Apex Air', routes: [], color: '#A855F7', /* purple-500 */ cash: 380_000_000, fleet: competitor3Fleet, allianceId: null },
        { id: 'ai-4', name: 'Velocity Wings', routes: [], color: '#EC4899', /* pink-500 */ cash: 320_000_000, fleet: competitor4Fleet, allianceId: null },
    ]);
  };

  const handleRestartGame = () => {
    localStorage.removeItem(SAVE_GAME_KEY);
    setHasSaveData(false);

    setSelectedCountryCode(null);
    setCountryData(null);
    setIsLoading(false);
    setTooltip({ show: false, x: 0, y: 0, content: '' });
    setActiveSidePanelTab('dashboard');

    setGameState('SETUP');
    setPlayer(null);
    setCompetitors([]);
    setAlliances([]);
    setGameDate(new Date('2024-01-01'));
    setGameSpeed(0);
    setLastSpeed(1);
    setRouteEndpoints([]);
    setRouteToAssign(null);
    setFinancialReport(null);
    setEventToShow(null);
    setLastProcessedMonth(new Date('2024-01-01').getMonth());
    setActiveEvents([]);
    setEventHistory([]);
    setIsHubModalOpen(false);
    setAirportToView(null);
    speedBeforeReport.current = 0;
  };

  const handleSaveGame = useCallback(() => {
    if (gameState !== 'PLAYING' || !player) return;

    const stateToSave = {
        player,
        competitors,
        alliances,
        gameDate,
        lastProcessedMonth,
        activeEvents,
        eventHistory,
        lastSpeed,
    };

    localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(stateToSave));

    setToast({ show: true, message: '게임이 저장되었습니다.', type: 'success' });

  }, [player, competitors, gameDate, lastProcessedMonth, activeEvents, eventHistory, lastSpeed, gameState, alliances]);
    
  const handleLoadGame = useCallback(() => {
      const savedGameString = localStorage.getItem(SAVE_GAME_KEY);
      if (savedGameString) {
          try {
              const savedState = JSON.parse(savedGameString, dateReviver);
              
              const savedPlayer = savedState.player;
              savedPlayer.serviceQuality = savedPlayer.serviceQuality ?? 70;
              savedPlayer.onTimePerformance = savedPlayer.onTimePerformance ?? 95;
              
              setPlayer(savedPlayer);
              setCompetitors(savedState.competitors);
              setAlliances(savedState.alliances || []);
              setGameDate(savedState.gameDate);
              setLastProcessedMonth(savedState.lastProcessedMonth);
              setActiveEvents(savedState.activeEvents);
              setEventHistory(savedState.eventHistory);
              setLastSpeed(savedState.lastSpeed);
              
              setGameSpeed(0);
              setGameState('PLAYING');

              setSelectedCountryCode(null);
              setCountryData(null);
              setActiveSidePanelTab('dashboard');
              setRouteEndpoints([]);

          } catch (error) {
              console.error("Failed to load game data:", error);
              localStorage.removeItem(SAVE_GAME_KEY);
              setHasSaveData(false);
          }
      }
  }, []);

  const handlePurchaseAircraft = (aircraftToBuy: AircraftModel) => {
    if (!player || player.cash < aircraftToBuy.price) {
        setToast({ show: true, message: '자금이 부족합니다.', type: 'error' });
        return;
    }

    setPlayer(prevPlayer => {
      if (!prevPlayer) return null;
      
      const newAircraftInstance: AircraftInstance = {
        id: Date.now() + Math.random(),
        modelId: aircraftToBuy.id,
        purchaseDate: gameDate,
        age: 0,
        status: 'idle',
      };
      
      return {
        ...prevPlayer,
        cash: prevPlayer.cash - aircraftToBuy.price,
        fleet: [...prevPlayer.fleet, newAircraftInstance]
      };
    });
    setToast({ show: true, message: `${aircraftToBuy.name} 항공기를 구매했습니다.`, type: 'success' });
  };
  
  const handleSellAircraft = (aircraftId: number) => {
    setPlayer(prevPlayer => {
        if (!prevPlayer) return null;

        const aircraftToSell = prevPlayer.fleet.find(a => a.id === aircraftId);
        if (!aircraftToSell) {
            setToast({ show: true, message: '판매할 항공기를 찾을 수 없습니다.', type: 'error' });
            return prevPlayer;
        }

        if (aircraftToSell.status !== 'idle') {
            setToast({ show: true, message: '운항 중인 항공기는 판매할 수 없습니다.', type: 'error' });
            return prevPlayer;
        }
        
        const model = AIRCRAFT_MODELS.find(m => m.id === aircraftToSell.modelId);
        if (!model) {
             setToast({ show: true, message: '항공기 모델 정보를 찾을 수 없습니다.', type: 'error' });
            return prevPlayer;
        }
        
        const ageInYears = (gameDate.getTime() - aircraftToSell.purchaseDate.getTime()) / (1000 * 3600 * 24 * 365.25);
        // Aircraft loses 80% of value over 25 years.
        const depreciationRate = 0.8 / 25; // Yearly depreciation rate
        const depreciationAmount = Math.min(0.8, ageInYears * depreciationRate); // Cap at 80% loss
        const salePrice = Math.round(model.price * (1 - depreciationAmount));

        const newFleet = prevPlayer.fleet.filter(a => a.id !== aircraftId);

        setToast({ show: true, message: `${model.name} 항공기를 $${salePrice.toLocaleString()}에 판매했습니다.`, type: 'success' });

        return {
            ...prevPlayer,
            cash: prevPlayer.cash + salePrice,
            fleet: newFleet
        };
    });
  };

  const handleOpenAirportDetailModal = (airportId: string) => {
    const airport = AIRPORTS.find(a => a.id === airportId);
    if (airport) {
        setAirportToView(airport);
    }
  };

  const handleCloseAirportDetailModal = () => {
    setAirportToView(null);
  };
  
  const handleStartRouteFromAirport = (airportId: string) => {
    setAirportToView(null);
    setRouteEndpoints([airportId]);
    if (selectedCountryCode) setSelectedCountryCode(null);
    if (activeSidePanelTab === 'country') setActiveSidePanelTab('dashboard');
  };

  const handleAirportClick = (airportId: string) => {
    if (selectedCountryCode) {
        setSelectedCountryCode(null);
        setCountryData(null);
        if(activeSidePanelTab === 'country') {
            setActiveSidePanelTab('dashboard');
        }
    }

    if (routeEndpoints.length === 1) {
        // Second airport selected, complete the pair if it's not the same one
        if (routeEndpoints[0] !== airportId) {
            setRouteEndpoints(prev => [...prev, airportId]);
        }
    } else {
        // First airport selected (or starting over), open detail modal
        handleOpenAirportDetailModal(airportId);
    }
  };

  const handleCreateRoute = () => {
    if (routeEndpoints.length !== 2) return;
    
    const originAirport = AIRPORTS.find(a => a.id === routeEndpoints[0]);
    const destinationAirport = AIRPORTS.find(a => a.id === routeEndpoints[1]);

    if (!originAirport || !destinationAirport) {
        console.error("Could not find airport data for route creation.");
        setRouteEndpoints([]);
        return;
    }

    const distance = calculateDistance(
        originAirport.lat,
        originAirport.lon,
        destinationAirport.lat,
        destinationAirport.lon
    );

    const standardFare = Math.round(distance * 0.30);
    const baseDemand = Math.max(20, Math.round((originAirport.size * destinationAirport.size) * 20 + (5000 - distance) / 10));

    const newRoute: Route = {
      id: `${routeEndpoints[0]}-${routeEndpoints[1]}-${Date.now()}`,
      origin: routeEndpoints[0],
      destination: routeEndpoints[1],
      distance: distance,
      ticketPrice: standardFare,
      baseDemand: baseDemand,
    };

    setPlayer(prevPlayer => {
        if (!prevPlayer) return null;
        return {
            ...prevPlayer,
            routes: [...prevPlayer.routes, newRoute],
        };
    });

    setRouteEndpoints([]);
    setActiveSidePanelTab('routes');
  };

  const handleCancelRouteCreation = () => {
    setRouteEndpoints([]);
  };
  
  const handleOpenAssignmentModal = (routeId: string) => {
    const route = player?.routes.find(r => r.id === routeId);
    if (route) {
        setRouteToAssign(route);
    }
  };

  const handleCloseAssignmentModal = () => {
      setRouteToAssign(null);
  };
  
  const handleCloseFinancialReport = () => {
    setFinancialReport(null);
    setGameSpeed(speedBeforeReport.current);
  };
  
  const handleCloseEventNotification = () => {
    setEventToShow(null);
  };

  const handleAssignAircraftToRoute = (routeId: string, aircraftId: number) => {
    setPlayer(prevPlayer => {
        if (!prevPlayer) return null;

        const newFleet = [...prevPlayer.fleet];
        const newRoutes = [...prevPlayer.routes];

        const routeIndex = newRoutes.findIndex(r => r.id === routeId);
        if (routeIndex === -1) return prevPlayer;

        const route = { ...newRoutes[routeIndex] };

        // 1. Unassign the old aircraft if there was one
        if (route.aircraftId) {
            const oldAircraftIndex = newFleet.findIndex(a => a.id === route.aircraftId);
            if (oldAircraftIndex !== -1) {
                newFleet[oldAircraftIndex] = { ...newFleet[oldAircraftIndex], status: 'idle', routeId: undefined };
            }
        }

        // 2. Assign the new aircraft
        const newAircraftIndex = newFleet.findIndex(a => a.id === aircraftId);
        if (newAircraftIndex !== -1) {
            newFleet[newAircraftIndex] = { ...newFleet[newAircraftIndex], status: 'in_service', routeId: routeId };
        }

        // 3. Update the route
        route.aircraftId = aircraftId;
        newRoutes[routeIndex] = route;

        return {
            ...prevPlayer,
            fleet: newFleet,
            routes: newRoutes
        };
    });
    handleCloseAssignmentModal();
  };
  
  const handleUnassignAircraftFromRoute = (routeId: string) => {
      setPlayer(prevPlayer => {
          if (!prevPlayer) return null;
          
          const newFleet = [...prevPlayer.fleet];
          const newRoutes = [...prevPlayer.routes];

          const routeIndex = newRoutes.findIndex(r => r.id === routeId);
          if (routeIndex === -1) return prevPlayer;
          
          const route = { ...newRoutes[routeIndex] };
          const aircraftId = route.aircraftId;

          if (!aircraftId) return prevPlayer;

          // 1. Update aircraft status
          const aircraftIndex = newFleet.findIndex(a => a.id === aircraftId);
          if (aircraftIndex !== -1) {
              newFleet[aircraftIndex] = { ...newFleet[aircraftIndex], status: 'idle', routeId: undefined };
          }

          // 2. Update route
          route.aircraftId = undefined;
          newRoutes[routeIndex] = route;
          
          return {
              ...prevPlayer,
              fleet: newFleet,
              routes: newRoutes,
          };
      });
  };
  
  const handleUpdateTicketPrice = (routeId: string, newPrice: number) => {
    setPlayer(prevPlayer => {
        if (!prevPlayer) return null;
        
        const newRoutes = prevPlayer.routes.map(route => {
            if (route.id === routeId) {
                return { ...route, ticketPrice: newPrice };
            }
            return route;
        });

        return {
            ...prevPlayer,
            routes: newRoutes
        };
    });
  };

  const handleOpenHubModal = () => {
    setIsHubModalOpen(true);
  };

  const handleCloseHubModal = () => {
    setIsHubModalOpen(false);
  };
  
  const handleOpenRankingsModal = () => {
    setIsRankingsModalOpen(true);
  };
  
  const handleCloseRankingsModal = () => {
    setIsRankingsModalOpen(false);
  };

  const handleOpenHelpModal = () => {
    setIsHelpModalOpen(true);
  };

  const handleCloseHelpModal = () => {
    setIsHelpModalOpen(false);
  };


  const handleSetHub = (airportId: string) => {
    setPlayer(p => {
        if (!p) return null;
        return { ...p, hubAirportId: airportId };
    });
    handleCloseHubModal();
  };
  
  const handleStartResearch = (project: ResearchProject) => {
    if (!player || player.cash < project.cost || player.activeResearch) return;

    setPlayer(p => {
        if (!p) return null;
        return {
            ...p,
            cash: p.cash - project.cost,
            activeResearch: {
                ...project,
                startDate: gameDate,
            }
        };
    });
    setActiveSidePanelTab('research');
  };
  
  const handleStartMarketingCampaign = (campaign: MarketingCampaign) => {
    if (!player || player.cash < campaign.cost || player.activeMarketingCampaigns.length > 0) return;

    setPlayer(p => {
      if (!p) return null;
      
      const expiryDate = new Date(gameDate);
      expiryDate.setDate(expiryDate.getDate() + campaign.durationDays);

      const newCampaign: ActiveMarketingCampaign = {
        ...campaign,
        startDate: gameDate,
        expiryDate: expiryDate,
      };

      let newBrandAwareness = p.brandAwareness;
      if(campaign.effects.brandAwareness) {
        newBrandAwareness = Math.min(100, p.brandAwareness + campaign.effects.brandAwareness);
      }

      return {
        ...p,
        cash: p.cash - campaign.cost,
        brandAwareness: newBrandAwareness,
        activeMarketingCampaigns: [...p.activeMarketingCampaigns, newCampaign],
      };
    });
    setActiveSidePanelTab('marketing');
  };

  const handleFormAlliance = (name: string) => {
    if (!player || player.allianceId || player.cash < ALLIANCE_FORMATION_COST) return;

    const newAlliance: Alliance = {
        id: `alliance-player-${Date.now()}`,
        name: name,
        members: ['player']
    };

    setAlliances(prev => [...prev, newAlliance]);
    setPlayer(p => {
        if (!p) return null;
        return {
            ...p,
            cash: p.cash - ALLIANCE_FORMATION_COST,
            allianceId: newAlliance.id,
        };
    });
    setActiveSidePanelTab('alliance');
  };
  
  const handleInviteToAlliance = (competitorId: string) => {
    if (!player || !player.allianceId) return;

    // AI will always accept for now for simplicity
    setAlliances(prev => prev.map(a => {
        if (a.id === player.allianceId) {
            return {
                ...a,
                members: [...new Set([...a.members, competitorId])],
            };
        }
        return a;
    }));

    setCompetitors(prev => prev.map(c => {
        if (c.id === competitorId) {
            return { ...c, allianceId: player.allianceId };
        }
        return c;
    }));
  };
  
  const handleLeaveAlliance = () => {
    if (!player || !player.allianceId) return;
    const allianceId = player.allianceId;

    setPlayer(p => {
        if (!p) return null;
        return {
            ...p,
            allianceId: null,
            // Add a penalty
            satisfaction: Math.max(0, p.satisfaction - 5),
        };
    });

    setAlliances(prev => {
        const alliance = prev.find(a => a.id === allianceId);
        if (alliance) {
            const remainingMembers = alliance.members.filter(m => m !== 'player');
            if (remainingMembers.length < 2) {
                // Disband alliance if < 2 members remain
                setCompetitors(comps => comps.map(c => remainingMembers.includes(c.id) ? { ...c, allianceId: null } : c));
                return prev.filter(a => a.id !== allianceId);
            } else {
                return prev.map(a => a.id === allianceId ? { ...a, members: remainingMembers } : a);
            }
        }
        return prev;
    });
  };


  if (gameState === 'SETUP') {
    return <GameSetup onGameStart={handleGameStart} hasSaveData={hasSaveData} onLoadGame={handleLoadGame} />;
  }
  
  const originAirport = routeEndpoints.length > 0 ? AIRPORTS.find(a => a.id === routeEndpoints[0]) : undefined;
  const destinationAirport = routeEndpoints.length > 1 ? AIRPORTS.find(a => a.id === routeEndpoints[1]) : undefined;


  return (
    <div className="min-h-screen lg:h-screen bg-slate-900 text-slate-200 font-sans flex flex-col lg:overflow-y-hidden">
      <Header companyName={player?.companyName} cash={player?.cash} satisfaction={player?.satisfaction} onOpenHelp={handleOpenHelpModal} />
      
      {isHelpModalOpen && <HelpModal onClose={handleCloseHelpModal} />}
      
      {tooltip.show && (
        <div 
          className="fixed z-50 p-2 text-sm bg-slate-800 text-white rounded-md shadow-lg pointer-events-none"
          style={{ top: `${tooltip.y}px`, left: `${tooltip.x}px`, transform: 'translateY(-100%)' }}
        >
          {tooltip.content}
        </div>
      )}

      <Toast show={toast.show} message={toast.message} type={toast.type} />

      <main className="flex-grow pt-16 pb-4 flex flex-col relative min-h-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-grow min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <div className="lg:col-span-2 h-full min-h-[calc(100vh-250px)] lg:min-h-0">
                  <WorldMap 
                    onCountryClick={handleCountryClick} 
                    selectedCountryCode={selectedCountryCode}
                    setTooltip={setTooltip}
                    airports={AIRPORTS}
                    routeEndpoints={routeEndpoints}
                    onAirportClick={handleAirportClick}
                    routes={player?.routes || []}
                    competitors={competitors}
                  />
                </div>
                <div className="lg:col-span-1 h-full min-h-[400px] lg:min-h-0">
                  <SidePanel
                    activeTab={activeSidePanelTab}
                    setActiveTab={setActiveSidePanelTab}
                    countryData={countryData}
                    isLoadingCountry={isLoading}
                    player={player}
                    onPurchaseAircraft={handlePurchaseAircraft}
                    onSellAircraft={handleSellAircraft}
                    gameDate={gameDate}
                    aircraftModels={AIRCRAFT_MODELS}
                    airports={AIRPORTS}
                    onOpenAssignmentModal={handleOpenAssignmentModal}
                    onUnassignAircraft={handleUnassignAircraftFromRoute}
                    onUpdateTicketPrice={handleUpdateTicketPrice}
                    activeEvents={activeEvents}
                    eventHistory={eventHistory}
                    onOpenHubModal={handleOpenHubModal}
                    onOpenRankingsModal={handleOpenRankingsModal}
                    competitors={competitors}
                    closedAirports={closedAirports}
                    researchProjects={RESEARCH_PROJECTS}
                    onStartResearch={handleStartResearch}
                    marketingCampaigns={MARKETING_CAMPAIGNS}
                    onStartMarketingCampaign={handleStartMarketingCampaign}
                    alliances={alliances}
                    onFormAlliance={handleFormAlliance}
                    onInviteToAlliance={handleInviteToAlliance}
                    onLeaveAlliance={handleLeaveAlliance}
                  />
                </div>
            </div>
        </div>
        
        {originAirport && destinationAirport && (
          <RoutePlanner
            origin={originAirport}
            destination={destinationAirport}
            onConfirm={handleCreateRoute}
            onCancel={handleCancelRouteCreation}
          />
        )}

        {routeToAssign && player && (
          <AircraftAssignmentModal 
            route={routeToAssign}
            player={player}
            aircraftModels={AIRCRAFT_MODELS}
            onAssign={handleAssignAircraftToRoute}
            onCancel={handleCloseAssignmentModal}
          />
        )}
        
        {isHubModalOpen && player && (
          <HubSelectionModal
            player={player}
            airports={AIRPORTS}
            onSetHub={handleSetHub}
            onClose={handleCloseHubModal}
          />
        )}

        {airportToView && player && (
            <AirportDetailModal
                airport={airportToView}
                player={player}
                competitors={competitors}
                airports={AIRPORTS}
                onClose={handleCloseAirportDetailModal}
                onStartRoute={handleStartRouteFromAirport}
            />
        )}

        {isRankingsModalOpen && player && (
          <RankingsModal
            player={player}
            competitors={competitors}
            onClose={handleCloseRankingsModal}
          />
        )}

        {eventToShow && (
          <EventNotificationModal 
            event={eventToShow}
            onClose={handleCloseEventNotification}
          />
        )}

        {!eventToShow && financialReport && (
          <FinancialReportModal
            report={financialReport}
            onClose={handleCloseFinancialReport}
          />
        )}
        
        {gameState === 'GAME_OVER' && player && (
            <GameOverModal 
                companyName={player.companyName} 
                onRestart={handleRestartGame} 
            />
        )}

      </main>
      
      <Footer 
        gameDate={gameDate}
        gameSpeed={gameSpeed}
        onSpeedChange={handleSpeedChange}
        togglePlayPause={togglePlayPause}
        onSaveGame={handleSaveGame}
      />
    </div>
  );
};

export default App;