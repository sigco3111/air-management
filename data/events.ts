

import type { GameEvent } from '../types';

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'economic_boom',
    title: '세계 경제 호황',
    description: '전 세계적인 경제 호황으로 여행 수요가 급증합니다. 모든 노선의 수입이 일시적으로 증가합니다.',
    type: 'positive',
    durationDays: 90,
    effects: {
      incomeModifier: 1.15, // 수입 15% 증가
    },
  },
  {
    id: 'fuel_price_spike',
    title: '유가 급등',
    description: '국제 유가가 급등하여 항공유 가격이 크게 상승했습니다. 모든 노선의 연료비가 증가합니다.',
    type: 'negative',
    durationDays: 60,
    effects: {
      fuelPriceModifier: 1.50, // 연료비 50% 증가
    },
  },
  {
    id: 'safety_award',
    title: '항공 안전 대상 수상',
    description: '귀하의 항공사가 최고의 안전 등급을 획득하여 상금과 함께 승객 만족도가 향상되었습니다.',
    type: 'positive',
    durationDays: 0, // 즉시 발동
    effects: {
      cash: 10_000_000,
      satisfaction: 5,
    },
  },
  {
    id: 'volcanic_ash_cloud',
    title: '화산재 확산',
    description: '화산 폭발로 인한 화산재 구름이 항공 교통을 방해하여 일부 노선 수입이 감소합니다.',
    type: 'negative',
    durationDays: 30,
    effects: {
      incomeModifier: 0.9, // 수입 10% 감소
    },
  },
   {
    id: 'major_sports_event',
    title: '국제 스포츠 대회',
    description: '대규모 국제 스포츠 행사 개최로 인해 단기간 여행 수요가 폭발적으로 증가합니다.',
    type: 'positive',
    durationDays: 45,
    effects: {
        incomeModifier: 1.25, // 수입 25% 증가
    },
  },
  {
    id: 'pilot_strike',
    title: '조종사 파업',
    description: '조종사 노조의 파업으로 인해 항공편 운영에 차질이 생겨 수입이 감소하고 만족도가 하락합니다.',
    type: 'negative',
    durationDays: 20,
    effects: {
        incomeModifier: 0.80, // 수입 20% 감소
        satisfaction: -3,
    },
  },
  {
    id: 'paris_olympics',
    title: '파리 올림픽 개최',
    description: '파리에서 올림픽이 개최되어 파리로 향하는 여행 수요가 폭발적으로 증가합니다! CDG 노선을 확인하세요.',
    type: 'positive',
    durationDays: 30,
    effects: {
        airportEffects: [
            { airportId: 'CDG', demandMultiplier: 2.5 }
        ]
    },
  },
  {
    id: 'airport_strike_jfk',
    title: 'JFK 공항 파업',
    description: '뉴욕 JFK 공항의 관제사 및 지상 근무 직원들이 파업에 돌입했습니다. JFK 공항이 일시적으로 폐쇄됩니다.',
    type: 'negative',
    durationDays: 20,
    effects: {
        airportEffects: [
            { airportId: 'JFK', isClosed: true }
        ]
    },
  },
  {
    id: 'volcanic_ash_europe',
    title: '유럽 화산재 확산',
    description: '아이슬란드 화산 폭발로 인해 유럽 주요 공항들이 일시적으로 폐쇄됩니다. 해당 공항을 이용하는 모든 노선은 운항이 중단됩니다.',
    type: 'negative',
    durationDays: 15,
    effects: {
        airportEffects: [
            { airportId: 'LHR', isClosed: true },
            { airportId: 'CDG', isClosed: true },
            { airportId: 'FRA', isClosed: true },
            { airportId: 'AMS', isClosed: true }
        ]
    },
  }
];