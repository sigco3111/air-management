

import React from 'react';
import ExclamationIcon from './icons/ExclamationIcon';

interface GameOverModalProps {
  companyName: string;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ companyName, onRestart }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col items-center p-8 text-center modal-content-animation ring-1 ring-white/10">
        <ExclamationIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-3xl font-bold text-white">파산</h2>
        <p className="text-lg text-red-400 mt-2">{companyName}</p>
        <p className="text-slate-300 mt-6 mb-8">
            회사의 자금이 바닥나 더 이상 운영할 수 없습니다.
            <br/>
            재무 관리에 실패하여 파산했습니다.
        </p>

        <button
            onClick={onRestart}
            className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors"
        >
            다시 시작하기
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;