import React, { useState } from 'react';
import PlaneIcon from './icons/PlaneIcon';

interface GameSetupProps {
  onGameStart: (companyName: string) => void;
  hasSaveData: boolean;
  onLoadGame: () => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onGameStart, hasSaveData, onLoadGame }) => {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      onGameStart(companyName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl p-8 text-center">
        <div className="flex justify-center items-center mb-6">
            <PlaneIcon className="w-12 h-12 text-cyan-400" />
            <h1 className="ml-4 text-3xl font-bold tracking-tight text-slate-100">
              에어매니지먼트
            </h1>
        </div>
        
        {hasSaveData ? (
           <p className="text-slate-400 mb-8">
              저장된 게임을 이어서 하거나, 새로운 항공사를 설립할 수 있습니다.
           </p>
        ) : (
           <p className="text-slate-400 mb-8">
              항공사의 CEO가 되어 세계 최고의 항공사를 만들어보세요.
              <br />
              먼저, 회사 이름을 정해주세요.
           </p>
        )}

        {hasSaveData && (
          <button
            onClick={onLoadGame}
            className="w-full mb-4 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500 transition-colors"
          >
            이어하기
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="company-name" className="sr-only">회사 이름</label>
            <input
              type="text"
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="예: 대한항공"
              required
              className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-center rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!companyName.trim()}
            className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            새 게임 시작하기
          </button>
        </form>
         <p className="text-xs text-slate-500 mt-6">초기 자본금: $500,000,000</p>
      </div>
    </div>
  );
};

export default GameSetup;