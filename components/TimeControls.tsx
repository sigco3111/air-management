
import React from 'react';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';

interface TimeControlsProps {
  gameDate: Date;
  gameSpeed: number; // 0 for paused, > 0 for active
  onSpeedChange: (speed: number) => void;
  togglePlayPause: () => void;
  onSaveGame: () => void;
}

const TimeControls: React.FC<TimeControlsProps> = ({ gameDate, gameSpeed, onSpeedChange, togglePlayPause, onSaveGame }) => {
  const speeds = [1, 2, 4]; // Represents 1x, 2x, 4x

  return (
    <div className="flex items-center justify-between w-full">
      <div className="text-lg font-mono font-bold text-cyan-300 w-36">
        {gameDate.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
      </div>
      <div className="flex items-center space-x-4">
        <button 
            onClick={togglePlayPause} 
            className="p-1 rounded-full text-slate-200 hover:bg-slate-700 transition-colors"
            aria-label={gameSpeed === 0 ? "게임 시작" : "게임 일시정지"}
        >
          {gameSpeed === 0 ? <PlayIcon className="w-8 h-8 text-green-400" /> : <PauseIcon className="w-8 h-8 text-yellow-400" />}
        </button>
        <div className="flex items-center bg-slate-800 rounded-full p-1">
          {speeds.map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors flex items-center space-x-1 ${
                gameSpeed === speed ? 'bg-cyan-500 text-slate-900 shadow-lg' : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{speed}x</span>
            </button>
          ))}
        </div>
      </div>
      <div className="w-36 flex justify-end">
        <button
            onClick={onSaveGame}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-cyan-400 transition-colors"
        >
            <span role="img" aria-label="저장 아이콘">💾</span>
            <span>저장하기</span>
        </button>
      </div>
    </div>
  );
};

export default TimeControls;