

import type { AircraftModel } from '../types';
import { AIRCRAFT_IMAGES } from './aircraft-images';

export const AIRCRAFT_MODELS: AircraftModel[] = [
  {
    id: 'ATR72',
    name: 'ATR 72-600',
    manufacturer: 'ATR',
    price: 26_800_000,
    seats: 70,
    range: 1528, // km
    monthlyMaintenance: 80_000,
    fuelEfficiency: 2.5, // L/km
    imageUrl: AIRCRAFT_IMAGES.ATR72,
  },
  {
    id: 'E190',
    name: 'E190-E2',
    manufacturer: '엠브라에르',
    price: 60_000_000,
    seats: 106,
    range: 5278, // km
    monthlyMaintenance: 100_000,
    fuelEfficiency: 3.5,
    imageUrl: AIRCRAFT_IMAGES.E190,
  },
  {
    id: 'B737',
    name: '737-800',
    manufacturer: '보잉',
    price: 106_100_000,
    seats: 162,
    range: 5765, // km
    monthlyMaintenance: 150_000,
    fuelEfficiency: 4.0,
    imageUrl: AIRCRAFT_IMAGES.B737,
  },
  {
    id: 'A320',
    name: 'A320neo',
    manufacturer: '에어버스',
    price: 110_600_000,
    seats: 165,
    range: 6300, // km
    monthlyMaintenance: 160_000,
    fuelEfficiency: 3.8,
    imageUrl: AIRCRAFT_IMAGES.A320,
  },
  {
    id: 'B787',
    name: '787-9 드림라이너',
    manufacturer: '보잉',
    price: 292_500_000,
    seats: 290,
    range: 14140, // km
    monthlyMaintenance: 350_000,
    fuelEfficiency: 5.5,
    imageUrl: AIRCRAFT_IMAGES.B787,
  },
  {
    id: 'A350',
    name: 'A350-900',
    manufacturer: '에어버스',
    price: 317_400_000,
    seats: 325,
    range: 15000, // km
    monthlyMaintenance: 400_000,
    fuelEfficiency: 5.2,
    imageUrl: AIRCRAFT_IMAGES.A350,
  },
  {
    id: 'B777',
    name: '777-300ER',
    manufacturer: '보잉',
    price: 375_500_000,
    seats: 396,
    range: 13649, // km
    monthlyMaintenance: 450_000,
    fuelEfficiency: 7.0,
    imageUrl: AIRCRAFT_IMAGES.B777,
  },
  {
    id: 'A380',
    name: 'A380-800',
    manufacturer: '에어버스',
    price: 445_600_000,
    seats: 555,
    range: 15200, // km
    monthlyMaintenance: 500_000,
    fuelEfficiency: 8.5,
    imageUrl: AIRCRAFT_IMAGES.A380,
  },
];