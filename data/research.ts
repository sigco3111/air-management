import type { ResearchProject } from '../types';

export const RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: 'fuel_efficiency_1',
    name: '연료 효율 개선 I',
    description: '모든 항공기의 연료 효율을 5% 개선하여 연료비를 절감합니다.',
    cost: 50_000_000,
    durationDays: 90,
    effects: {
      fuelEfficiencyModifier: 0.95,
    },
    prerequisites: [],
  },
  {
    id: 'advanced_maintenance',
    name: '고급 정비 훈련',
    description: '정비팀의 효율성을 높여 모든 항공기의 월간 유지비를 10% 절감합니다.',
    cost: 30_000_000,
    durationDays: 60,
    effects: {
      maintenanceModifier: 0.9,
    },
    prerequisites: [],
  },
  {
    id: 'customer_satisfaction_program',
    name: '고객 만족 프로그램',
    description: '새로운 서비스 프로그램을 도입하여 고객 만족도를 5점, 서비스 품질을 5점 상승시킵니다.',
    cost: 20_000_000,
    durationDays: 45,
    effects: {
      satisfaction: 5,
      serviceQuality: 5,
    },
    prerequisites: [],
  },
  {
    id: 'digital_marketing',
    name: '디지털 마케팅',
    description: '온라인 광고 캠페인을 통해 항공사 인지도를 높여 모든 노선의 기본 수요를 5% 증가시킵니다.',
    cost: 40_000_000,
    durationDays: 75,
    effects: {
      baseDemandModifier: 1.05,
    },
    prerequisites: [],
  },
  {
    id: 'fuel_efficiency_2',
    name: '연료 효율 개선 II',
    description: '추가적인 엔진 튜닝 기술을 개발하여 연료 효율을 7% 더 개선합니다.',
    cost: 150_000_000,
    durationDays: 180,
    effects: {
      fuelEfficiencyModifier: 0.93,
    },
    prerequisites: ['fuel_efficiency_1'],
  },
  {
    id: 'inflight_entertainment',
    name: '기내 엔터테인먼트 시스템',
    description: '전 항공기에 최신 기내 엔터테인먼트 시스템을 도입하여 서비스 품질을 8점 향상시킵니다.',
    cost: 75_000_000,
    durationDays: 120,
    effects: {
      serviceQuality: 8,
    },
    prerequisites: ['customer_satisfaction_program'],
  },
  {
    id: 'premium_cabin_service',
    name: '프리미엄 객실 서비스',
    description: '객실 승무원의 서비스 교육을 강화하고 고급 기내식을 제공하여 서비스 품질을 12점 대폭 향상시킵니다.',
    cost: 120_000_000,
    durationDays: 150,
    effects: {
      serviceQuality: 12,
    },
    prerequisites: ['inflight_entertainment'],
  },
];
