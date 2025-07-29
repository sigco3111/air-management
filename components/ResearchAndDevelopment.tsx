import React from 'react';
import type { Player, ResearchProject } from '../types';
import LightbulbIcon from './icons/LightbulbIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface ResearchAndDevelopmentProps {
  player: Player | null;
  researchProjects: ResearchProject[];
  onStartResearch: (project: ResearchProject) => void;
  gameDate: Date;
}

const ResearchCard = ({ 
    project, 
    onStart, 
    status, 
    playerCash, 
    isResearchActive, 
    progress,
    remainingDays
}: { 
    project: ResearchProject; 
    onStart: () => void;
    status: 'available' | 'in_progress' | 'completed' | 'locked';
    playerCash: number;
    isResearchActive: boolean;
    progress?: number;
    remainingDays?: number;
}) => {
    const canAfford = playerCash >= project.cost;
    const buttonDisabled = status !== 'available' || !canAfford || isResearchActive;

    let buttonText = '연구 시작';
    if (status === 'locked') buttonText = '선행 연구 필요';
    else if (isResearchActive && status === 'available') buttonText = '연구 진행 중';
    else if (!canAfford && status === 'available') buttonText = '자금 부족';

    return (
        <div className="bg-slate-800 rounded-lg p-4 flex flex-col space-y-3">
            <div className="flex justify-between items-start">
                <h4 className={`font-bold text-white ${status === 'locked' ? 'text-slate-500' : ''}`}>{project.name}</h4>
                {status === 'completed' && <CheckCircleIcon className="w-6 h-6 text-green-400" />}
            </div>
            <p className={`text-sm ${status === 'locked' ? 'text-slate-600' : 'text-slate-300'}`}>{project.description}</p>
            <div className="text-xs space-y-1 pt-2 border-t border-slate-700/50">
                <div className="flex justify-between">
                    <span className="text-slate-400">비용</span>
                    <span className={`font-mono ${status === 'locked' ? 'text-slate-500' : 'text-slate-200'}`}>${project.cost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400">기간</span>
                    <span className={`font-mono ${status === 'locked' ? 'text-slate-500' : 'text-slate-200'}`}>{project.durationDays}일</span>
                </div>
            </div>
            {status === 'in_progress' && progress !== undefined && remainingDays !== undefined && (
                 <div className="pt-2 space-y-2">
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                        <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-center text-cyan-300 font-mono">{remainingDays}일 남음</p>
                </div>
            )}
            {status === 'available' && (
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


const ResearchAndDevelopment: React.FC<ResearchAndDevelopmentProps> = ({ player, researchProjects, onStartResearch, gameDate }) => {
  if (!player) {
    return <div className="p-4 text-center text-slate-400">플레이어 정보를 불러오는 중입니다...</div>;
  }

  const activeResearch = player.activeResearch;
  
  const availableProjects = researchProjects.filter(p => 
    !player.completedResearch.includes(p.id) &&
    p.id !== activeResearch?.id &&
    p.prerequisites.every(prereq => player.completedResearch.includes(prereq))
  );

  const lockedProjects = researchProjects.filter(p => 
    !player.completedResearch.includes(p.id) &&
    p.id !== activeResearch?.id &&
    !p.prerequisites.every(prereq => player.completedResearch.includes(prereq))
  );
  
  const completedProjects = researchProjects.filter(p => player.completedResearch.includes(p.id));

  return (
    <div className="p-4 space-y-6">
      {activeResearch && (
        <div>
          <h3 className="text-lg font-semibold text-white px-2 mb-3">진행 중인 연구</h3>
           <ResearchCard
              project={activeResearch}
              onStart={() => {}}
              status="in_progress"
              playerCash={player.cash}
              isResearchActive={true}
              progress={Math.min(100, ((gameDate.getTime() - activeResearch.startDate.getTime()) / (activeResearch.durationDays * 24 * 60 * 60 * 1000)) * 100)}
              remainingDays={Math.max(0, Math.ceil(activeResearch.durationDays - (gameDate.getTime() - activeResearch.startDate.getTime()) / (24 * 60 * 60 * 1000)))}
            />
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-white px-2 mb-3">시작 가능한 연구</h3>
        {availableProjects.length > 0 ? (
          <div className="space-y-4">
            {availableProjects.map(p => (
              <ResearchCard
                key={p.id}
                project={p}
                onStart={() => onStartResearch(p)}
                status="available"
                playerCash={player.cash}
                isResearchActive={!!activeResearch}
              />
            ))}
          </div>
        ) : (
            <div className="text-center py-6 text-slate-400 bg-slate-800/50 rounded-lg">
                <p>시작할 수 있는 새로운 연구가 없습니다.</p>
            </div>
        )}
      </div>

      {(completedProjects.length > 0 || lockedProjects.length > 0) && (
        <div>
          <h3 className="text-lg font-semibold text-white px-2 mb-3">기타</h3>
           <div className="space-y-4">
            {completedProjects.map(p => (
              <ResearchCard
                key={p.id}
                project={p}
                onStart={() => {}}
                status="completed"
                playerCash={player.cash}
                isResearchActive={!!activeResearch}
              />
            ))}
            {lockedProjects.map(p => (
              <ResearchCard
                key={p.id}
                project={p}
                onStart={() => {}}
                status="locked"
                playerCash={player.cash}
                isResearchActive={!!activeResearch}
              />
            ))}
          </div>
        </div>
      )}
      
       {researchProjects.length === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <LightbulbIcon className="h-12 w-12 text-slate-500 mb-4" />
                <h3 className="text-lg font-medium text-slate-200">연구 프로젝트가 없습니다</h3>
                <p className="mt-1 text-sm text-slate-400">현재 이용 가능한 연구가 없습니다.</p>
            </div>
        )}
    </div>
  );
};

export default ResearchAndDevelopment;
