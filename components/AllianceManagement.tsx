
import React, { useState } from 'react';
import type { Player, Competitor, Alliance } from '../types';
import LinkIcon from './icons/LinkIcon';

interface AllianceManagementProps {
  player: Player | null;
  competitors: Competitor[];
  alliances: Alliance[];
  onFormAlliance: (name: string) => void;
  onInviteToAlliance: (competitorId: string) => void;
  onLeaveAlliance: () => void;
}

const ALLIANCE_FORMATION_COST = 100_000_000;

const AllianceManagement: React.FC<AllianceManagementProps> = ({
  player,
  competitors,
  alliances,
  onFormAlliance,
  onInviteToAlliance,
  onLeaveAlliance
}) => {
  const [allianceName, setAllianceName] = useState('');

  if (!player) {
    return <div className="p-4 text-center text-slate-400">플레이어 정보를 불러오는 중입니다...</div>;
  }
  
  const playerAlliance = alliances.find(a => a.id === player.allianceId);
  const otherAlliances = alliances.filter(a => a.id !== player.allianceId);
  const canAffordFormation = player.cash >= ALLIANCE_FORMATION_COST;

  const handleFormAlliance = () => {
    if (allianceName.trim() && canAffordFormation) {
      onFormAlliance(allianceName.trim());
      setAllianceName('');
    }
  };
  
  const eligibleForInvite = competitors.filter(c => !c.allianceId);

  return (
    <div className="p-4 space-y-6">
      {!playerAlliance ? (
        <div>
          <h3 className="text-lg font-semibold text-white px-2 mb-3">동맹 결성</h3>
          <div className="bg-slate-800 rounded-lg p-4 space-y-4">
             <p className="text-sm text-slate-300">
                동맹을 결성하여 다른 항공사와 협력하세요. 동맹 회원사들은 수요 및 만족도 보너스를 받고, 서로 공격적으로 경쟁하지 않습니다.
             </p>
             <div className="space-y-2">
                 <label htmlFor="alliance-name" className="text-sm font-medium text-slate-400">동맹 이름</label>
                 <input
                    type="text"
                    id="alliance-name"
                    value={allianceName}
                    onChange={(e) => setAllianceName(e.target.value)}
                    placeholder="예: 스타 얼라이언스"
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                 />
             </div>
             <p className="text-sm text-slate-400">결성 비용: <span className="font-mono text-yellow-400">${ALLIANCE_FORMATION_COST.toLocaleString()}</span></p>
             <button
                onClick={handleFormAlliance}
                disabled={!allianceName.trim() || !canAffordFormation}
                className="w-full bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
             >
                {!canAffordFormation ? '자금 부족' : '동맹 결성'}
             </button>
          </div>
        </div>
      ) : (
         <div>
          <h3 className="text-lg font-semibold text-white px-2 mb-3">나의 동맹: {playerAlliance.name}</h3>
          <div className="bg-slate-800 rounded-lg p-4 space-y-4">
            <div>
              <h4 className="font-semibold text-slate-300 mb-2">회원사</h4>
              <ul className="space-y-2">
                {playerAlliance.members.map(memberId => {
                  const member = memberId === 'player' 
                    ? { name: player.companyName, color: '#38BDF8' /* cyan-400 */ } 
                    : competitors.find(c => c.id === memberId);
                  if (!member) return null;
                  return (
                    <li key={memberId} className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: member.color }}></div>
                      <span className="text-white font-medium">{member.name}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            
            {eligibleForInvite.length > 0 && (
              <div className="border-t border-slate-700 pt-4">
                 <h4 className="font-semibold text-slate-300 mb-2">회원사 초대</h4>
                 <div className="space-y-2">
                  {eligibleForInvite.map(comp => (
                    <div key={comp.id} className="flex items-center justify-between bg-slate-900/50 p-2 rounded-md">
                      <span className="text-slate-200">{comp.name}</span>
                      <button
                        onClick={() => onInviteToAlliance(comp.id)}
                        className="px-3 py-1 text-xs font-semibold rounded-md bg-cyan-700 text-white hover:bg-cyan-600 transition-colors"
                      >
                        초대
                      </button>
                    </div>
                  ))}
                 </div>
              </div>
            )}

            <div className="border-t border-slate-700 pt-4">
              <button
                onClick={onLeaveAlliance}
                className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors"
              >
                동맹 탈퇴
              </button>
            </div>

          </div>
         </div>
      )}

      {otherAlliances.length > 0 && (
         <div>
          <h3 className="text-lg font-semibold text-white px-2 mb-3">다른 동맹</h3>
          <div className="space-y-4">
            {otherAlliances.map(alliance => (
              <div key={alliance.id} className="bg-slate-800 rounded-lg p-4">
                <h4 className="font-bold text-cyan-400 mb-2">{alliance.name}</h4>
                <ul className="space-y-1.5">
                   {alliance.members.map(memberId => {
                     const member = competitors.find(c => c.id === memberId);
                     if (!member) return null;
                     return (
                      <li key={memberId} className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: member.color }}></div>
                        <span className="text-slate-300">{member.name}</span>
                      </li>
                     )
                   })}
                </ul>
              </div>
            ))}
          </div>
         </div>
      )}
      
       {alliances.length === 0 && !playerAlliance && (
           <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
             <LinkIcon className="h-12 w-12 text-slate-500 mb-4" />
             <h3 className="text-lg font-medium text-slate-200">현재 활동중인 동맹이 없습니다.</h3>
             <p className="mt-1 text-sm">최초의 동맹을 결성하여 항공업계를 이끌어보세요.</p>
           </div>
       )}

    </div>
  );
};

export default AllianceManagement;