
import type { MarketingCampaign } from '../types';

export const MARKETING_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'global_awareness_small',
    name: '글로벌 인지도 캠페인 (소형)',
    description: '온라인 및 소셜 미디어를 통해 전 세계적으로 항공사 인지도를 10점 높입니다. 모든 노선 수요에 긍정적인 영향을 줍니다.',
    cost: 35_000_000,
    durationDays: 60,
    effects: {
      brandAwareness: 10,
    },
  },
  {
    id: 'european_holiday_promo',
    name: '유럽 휴가 프로모션',
    description: '유럽 지역의 휴가철을 겨냥한 타겟 광고를 집행합니다. 90일간 유럽 내 모든 노선의 기본 수요가 15% 증가합니다.',
    cost: 50_000_000,
    durationDays: 90,
    effects: {
      regionalDemandModifier: {
        region: 'Europe',
        multiplier: 1.15,
      },
    },
  },
  {
    id: 'north_america_business_travel',
    name: '북미 비즈니스 여행객 유치',
    description: '북미 주요 도시의 비즈니스 여행객을 대상으로 한 캠페인. 120일간 북미 지역 노선 수요가 10% 증가합니다.',
    cost: 60_000_000,
    durationDays: 120,
    effects: {
      regionalDemandModifier: {
        region: 'North America',
        multiplier: 1.10,
      },
    },
  },
  {
    id: 'asia_expansion_campaign',
    name: '아시아 시장 확장 캠페인',
    description: '급성장하는 아시아 시장에서의 인지도를 20점 높이고, 60일간 아시아 지역 노선 수요를 10% 증가시킵니다.',
    cost: 80_000_000,
    durationDays: 60,
    effects: {
      brandAwareness: 20,
      regionalDemandModifier: {
        region: 'Asia',
        multiplier: 1.10,
      },
    },
  },
  {
    id: 'global_tv_campaign',
    name: '글로벌 TV 광고 캠페인',
    description: '전 세계 주요 TV 채널에 광고를 집행하여 브랜드 인지도를 30점 대폭 상승시킵니다. 막대한 비용이 소요됩니다.',
    cost: 200_000_000,
    durationDays: 90,
    effects: {
      brandAwareness: 30,
    },
  },
];
