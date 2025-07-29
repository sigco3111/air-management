


export type SidePanelTab = 'dashboard' | 'financials' | 'research' | 'marketing' | 'alliance' | 'fleet' | 'routes' | 'market' | 'events' | 'country';

export interface CountryName {
  common: string;
  official: string;
}

export interface Currency {
  name: string;
  symbol: string;
}

export interface Country {
  name: CountryName;
  cca3: string;
  capital: string[];
  region: string;
  subregion: string;
  population: number;
  flags: {
    svg: string;
    png: string;
  };
  currencies: { [key:string]: Currency };
  languages: { [key:string]: string };
  translations: {
    [key:string]: CountryName;
  };
}

export interface Tooltip {
  show: boolean;
  x: number;
  y: number;
  content: string;
}

export interface AircraftModel {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  seats: number;
  range: number; // km
  monthlyMaintenance: number;
  fuelEfficiency: number; // L/km
  imageUrl?: string;
}

export interface AircraftInstance {
  id: number; // Unique ID for each owned aircraft
  modelId: string;
  purchaseDate: Date;
  age: number; // in years
  status: 'idle' | 'in_service';
  routeId?: string; // Assigned route ID
}

export interface Airport {
  id: string; // IATA code
  name: string;
  city: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
  size: number; // e.g., 1 (small) to 5 (mega-hub)
}

export interface Route {
  id: string;
  origin: string; // Airport ID
  destination: string; // Airport ID
  distance: number; // km
  aircraftId?: number; // Assigned aircraft instance ID
  ticketPrice: number;
  baseDemand: number;
}

export interface ResearchModifiers {
    fuelEfficiency: number; // multiplier, e.g., 0.95 for 5% less
    maintenance: number; // multiplier
    baseDemand: number; // multiplier
}

export interface Alliance {
    id: string;
    name: string;
    members: string[]; // array of 'player' or competitor IDs
}

export interface Player {
  companyName: string;
  cash: number;
  fleet: AircraftInstance[];
  routes: Route[];
  lastMonthIncome?: number;
  lastMonthExpense?: number;
  satisfaction: number;
  serviceQuality: number;
  onTimePerformance: number;
  brandAwareness: number;
  fuelPrice: number;
  hubAirportId: string | null;
  financialHistory: FinancialReportData[];
  activeResearch: ActiveResearchProject | null;
  completedResearch: string[];
  researchModifiers: ResearchModifiers;
  activeMarketingCampaigns: ActiveMarketingCampaign[];
  allianceId: string | null;
}

export interface Competitor {
  id: string;
  name: string;
  routes: Route[];
  color: string;
  cash: number;
  fleet: AircraftInstance[];
  allianceId: string | null;
}

export interface GameEventEffect {
    cash?: number;
    satisfaction?: number;
    expenseModifier?: number; // e.g., 1.2 for +20%
    incomeModifier?: number;  // e.g., 0.9 for -10%
    fuelPriceModifier?: number; // e.g., 1.5 for +50%
    airportEffects?: {
        airportId: string;
        demandMultiplier?: number;
        isClosed?: boolean;
    }[];
}

export interface ResearchEffect {
    fuelEfficiencyModifier?: number;
    maintenanceModifier?: number;
    baseDemandModifier?: number;
    satisfaction?: number;
    serviceQuality?: number;
    cash?: number;
}

export interface ResearchProject {
    id: string;
    name: string;
    description: string;
    cost: number;
    durationDays: number;
    effects: ResearchEffect;
    prerequisites: string[];
}

export interface ActiveResearchProject extends ResearchProject {
    startDate: Date;
}

export interface MarketingCampaignEffect {
    brandAwareness?: number;
    regionalDemandModifier?: {
        region: string;
        multiplier: number;
    };
}

export interface MarketingCampaign {
    id: string;
    name: string;
    description: string;
    cost: number;
    durationDays: number;
    effects: MarketingCampaignEffect;
}

export interface ActiveMarketingCampaign extends MarketingCampaign {
    startDate: Date;
    expiryDate: Date;
}


export interface GameEvent {
    id:string;
    title: string;
    description: string;
    type: 'positive' | 'negative' | 'neutral';
    durationDays: number; // 0 for instantaneous events
    effects: GameEventEffect;
}

export interface ActiveGameEvent extends GameEvent {
    startDate: Date;
    expiryDate: Date;
}

export interface ExpenseBreakdown {
  maintenance: number;
  fuel: number;
  airportFees: number;
  salaries: number;
  total: number;
}

export interface FinancialReportData {
  month: Date;
  income: number;
  expenses: ExpenseBreakdown;
}