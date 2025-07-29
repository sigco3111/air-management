

import React from 'react';
import type { ActiveGameEvent } from '../types';
import BellIcon from './icons/BellIcon';

interface EventNotificationModalProps {
  event: ActiveGameEvent;
  onClose: () => void;
}

const EventNotificationModal: React.FC<EventNotificationModalProps> = ({ event, onClose }) => {
    const typeClasses = {
        positive: {
            icon: 'text-green-400',
            border: 'border-green-500',
            title: 'text-green-400',
        },
        negative: {
            icon: 'text-red-400',
            border: 'border-red-500',
            title: 'text-red-400',
        },
        neutral: {
            icon: 'text-cyan-400',
            border: 'border-cyan-500',
            title: 'text-cyan-400',
        },
    };

    const classes = typeClasses[event.type] || typeClasses.neutral;

    return (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className={`bg-slate-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col border-t-4 ${classes.border} modal-content-animation ring-1 ring-white/10`}>
                <div className="p-6 text-center">
                    <BellIcon className={`w-12 h-12 mx-auto mb-3 ${classes.icon}`} />
                    <h2 className={`text-xl font-bold ${classes.title}`}>{event.title}</h2>
                </div>

                <div className="px-6 pb-6 text-center">
                    <p className="text-slate-300">{event.description}</p>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-b-xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-bold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventNotificationModal;