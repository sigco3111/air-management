
import React from 'react';
import type { Player, MarketingCampaign, ActiveMarketingCampaign } from '../types';
import MegaphoneIcon from './icons/MegaphoneIcon';

interface MarketingProps {
  player: Player | null;
  marketingCampaigns: MarketingCampaign[];
  onStartCampaign: (campaign: MarketingCampaign) => void;
  gameDate: Date;
}

const CampaignCard = ({
  campaign,
  onStart,
  playerCash,
  isActive,
  isAnotherCampaignActive,
  progress,
  remainingDays,
}: {
  campaign: MarketingCampaign | ActiveMarketingCampaign;
  onStart: () => void;
  playerCash: number;
  isActive: boolean;
  isAnotherCampaignActive: boolean;
  progress?: number;
  remainingDays?: number;
}) => {
  const canAfford = playerCash >= campaign.cost;
  const buttonDisabled = isActive || !canAfford || (isAnotherCampaignActive && !isActive);

  let buttonText = '캠페인 시작';
  if (isAnotherCampaignActive && !isActive) buttonText = '다른 캠페인 진행 중';
  else if (!canAfford) buttonText = '자금 부족';

  const getEffectDescription = () => {
    if (campaign.effects.brandAwareness) {
        return `브랜드 인지도 +${campaign.effects.brandAwareness}`;
    }
    if (campaign.effects.regionalDemandModifier) {
        const { region, multiplier } = campaign.effects.regionalDemandModifier;
        return `${region} 지역 수요 +${((multiplier - 1) * 100).toFixed(0)}%`;
    }
    return '특별 효과';
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 flex flex-col space-y-3">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-white">{campaign.name}</h4>
        <span className="text-xs font-semibold bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded-full">{getEffectDescription()}</span>
      </div>
      <p className="text-sm text-slate-300">{campaign.description}</p>
      <div className="text-xs space-y-1 pt-2 border-t border-slate-700/50">
        <div className="flex justify-between">
          <span className="text-slate-400">비용</span>
          <span className="font-mono text-slate-200">${campaign.cost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">기간</span>
          <span className="font-mono text-slate-200">{campaign.durationDays}일</span>
        </div>
      </div>
      {isActive && progress !== undefined && remainingDays !== undefined && (
        <div className="pt-2 space-y-2">
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-center text-cyan-300 font-mono">{remainingDays}일 남음</p>
        </div>
      )}
      {!isActive && (
        <button
          onClick={onStart}
          disabled={buttonDisabled}
          className="mt-auto w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

const Marketing: React.FC<MarketingProps> = ({ player, marketingCampaigns, onStartCampaign, gameDate }) => {
  if (!player) {
    return <div className="p-4 text-center text-slate-400">플레이어 정보를 불러오는 중입니다...</div>;
  }

  const activeCampaigns = player.activeMarketingCampaigns;
  const isAnotherCampaignActive = activeCampaigns.length > 0;
  
  const availableCampaigns = marketingCampaigns.filter(
    (c) => !activeCampaigns.some((ac) => ac.id === c.id)
  );

  return (
    <div className="p-4 space-y-6">
      {isAnotherCampaignActive && (
        <div>
          <h3 className="text-lg font-semibold text-white px-2 mb-3">진행 중인 캠페인</h3>
          <div className="space-y-4">
            {activeCampaigns.map(ac => {
                const progress = Math.min(100, ((gameDate.getTime() - ac.startDate.getTime()) / (ac.durationDays * 24 * 60 * 60 * 1000)) * 100);
                const remainingDays = Math.max(0, Math.ceil((ac.expiryDate.getTime() - gameDate.getTime()) / (1000 * 3600 * 24)));
                return (
                     <CampaignCard
                        key={ac.id}
                        campaign={ac}
                        onStart={() => {}}
                        playerCash={player.cash}
                        isActive={true}
                        isAnotherCampaignActive={true}
                        progress={progress}
                        remainingDays={remainingDays}
                    />
                )
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-white px-2 mb-3">사용 가능한 캠페인</h3>
        {availableCampaigns.length > 0 ? (
          <div className="space-y-4">
            {availableCampaigns.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                onStart={() => onStartCampaign(c)}
                playerCash={player.cash}
                isActive={false}
                isAnotherCampaignActive={isAnotherCampaignActive}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 bg-slate-800/50 rounded-lg">
            <p>시작할 수 있는 새로운 캠페인이 없습니다.</p>
          </div>
        )}
      </div>

      {marketingCampaigns.length === 0 && (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
          <MegaphoneIcon className="h-12 w-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-200">마케팅 캠페인이 없습니다</h3>
          <p className="mt-1 text-sm text-slate-400">현재 이용 가능한 캠페인이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default Marketing;
