

import React from 'react';
import TimeControls from './TimeControls';

interface FooterProps {
  gameDate: Date;
  gameSpeed: number;
  onSpeedChange: (speed: number) => void;
  togglePlayPause: () => void;
  onSaveGame: () => void;
}

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <footer className="bg-slate-900/80 backdrop-blur-md border-t border-cyan-400/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <TimeControls {...props} />
      </div>
    </footer>
  );
};

export default Footer;