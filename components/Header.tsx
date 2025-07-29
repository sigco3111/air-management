import React from 'react';
import PlaneIcon from './icons/PlaneIcon';
import StarIcon from './icons/StarIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';

interface HeaderProps {
  companyName?: string;
  cash?: number;
  satisfaction?: number;
  onOpenHelp: () => void;
}

const Header: React.FC<HeaderProps> = ({ companyName, cash, satisfaction, onOpenHelp }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-slate-900/60 backdrop-blur-md border-b border-cyan-400/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <PlaneIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              에어매니지먼트
            </h1>
          </div>
          {companyName && (
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <div className="text-right">
                    <div className="hidden sm:block text-sm font-medium text-slate-300">만족도</div>
                    <div className="text-sm sm:text-base font-mono text-yellow-400 font-bold">
                        {satisfaction?.toFixed(1) ?? '0.0'}
                    </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-white">{companyName}</div>
                <div className="text-sm font-mono text-green-400">
                  ${cash?.toLocaleString() ?? '0'}
                </div>
              </div>
               <button 
                  onClick={onOpenHelp}
                  className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-cyan-400 transition-colors"
                  aria-label="도움말 보기"
               >
                   <QuestionMarkCircleIcon className="w-6 h-6" />
               </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
