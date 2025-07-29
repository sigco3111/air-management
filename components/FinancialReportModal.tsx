



import React from 'react';
import type { FinancialReportData } from '../types';
import ChartBarIcon from './icons/ChartBarIcon';
import WrenchIcon from './icons/WrenchIcon';
import FuelIcon from './icons/FuelIcon';
import BuildingIcon from './icons/BuildingIcon';
import UsersIcon from './icons/UsersIcon';

interface FinancialReportModalProps {
  report: FinancialReportData;
  onClose: () => void;
}

const ExpenseRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
    <div className="flex justify-between items-center text-sm py-1">
        <div className="flex items-center space-x-2">
            <span className="text-slate-400">{icon}</span>
            <span className="text-slate-300">{label}</span>
        </div>
        <span className="font-mono font-medium text-slate-300">-${value.toLocaleString()}</span>
    </div>
);


const FinancialReportModal: React.FC<FinancialReportModalProps> = ({ report, onClose }) => {
  const { income, expenses, month } = report;
  const profit = income - expenses.total;

  const reportMonthKorean = `${month.getFullYear()}년 ${month.getMonth() + 1}월`;


  return (
    <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col modal-content-animation ring-1 ring-white/10">
        <div className="p-6 border-b border-slate-700 text-center">
          <ChartBarIcon className="w-12 h-12 mx-auto text-cyan-400 mb-3" />
          <h2 className="text-xl font-bold text-white">월간 재무 보고서</h2>
          <p className="text-sm text-slate-400 mt-1">{reportMonthKorean}</p>
        </div>

        <div className="p-6 space-y-3">
            <div className="flex justify-between items-center text-lg">
                <span className="text-slate-300">총 수입:</span>
                <span className="font-mono font-semibold text-green-400">+${income.toLocaleString()}</span>
            </div>
            
            <div className="space-y-2 pt-2">
                <h4 className="text-base font-semibold text-slate-400 mb-1">비용 상세 내역</h4>
                <div className="bg-slate-900/50 rounded-lg p-3 space-y-1">
                    <ExpenseRow icon={<WrenchIcon className="w-4 h-4" />} label="항공기 유지비" value={expenses.maintenance} />
                    <ExpenseRow icon={<FuelIcon className="w-4 h-4" />} label="연료비" value={expenses.fuel} />
                    <ExpenseRow icon={<BuildingIcon className="w-4 h-4" />} label="공항 이용료" value={expenses.airportFees} />
                    <ExpenseRow icon={<UsersIcon className="w-4 h-4" />} label="직원 급여" value={expenses.salaries} />
                </div>
            </div>

            <div className="flex justify-between items-center text-lg pt-2">
                <span className="text-slate-300">총 비용:</span>
                <span className="font-mono font-semibold text-red-400">-${expenses.total.toLocaleString()}</span>
            </div>

            <div className="border-t border-slate-600 my-2"></div>

            <div className="flex justify-between items-center text-xl">
                <span className="font-bold text-slate-100">순이익:</span>
                <span className={`font-mono font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {profit >= 0 ? `+$${profit.toLocaleString()}` : `-$${Math.abs(profit).toLocaleString()}`}
                </span>
            </div>
        </div>

        <div className="p-4 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 flex justify-end">
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

export default FinancialReportModal;