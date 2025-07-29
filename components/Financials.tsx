
import React from 'react';
import type { Player, FinancialReportData } from '../types';
import BanknotesIcon from './icons/BanknotesIcon';

interface FinancialsProps {
  player: Player | null;
}

const Chart = ({ data }: { data: FinancialReportData[] }) => {
    if (data.length === 0) return null;

    const maxVal = Math.max(...data.flatMap(d => [d.income, d.expenses.total]));
    if (maxVal === 0) return null;

    return (
        <div className="bg-slate-900/50 p-4 rounded-lg">
            <h4 className="text-base font-semibold text-white mb-4">월별 손익 추이</h4>
            <div className="flex justify-around items-end h-48 space-x-2">
                {data.slice(-6).map((report, index) => {
                    const incomeHeight = (report.income / maxVal) * 100;
                    const expenseHeight = (report.expenses.total / maxVal) * 100;
                    const profit = report.income - report.expenses.total;
                    const profitColor = profit >= 0 ? 'text-green-400' : 'text-red-400';

                    return (
                        <div key={index} className="flex-1 flex flex-col items-center justify-end text-center">
                            <div className="relative w-full h-full flex justify-center items-end space-x-1">
                                <div
                                    className="w-1/2 bg-green-500/70 rounded-t-sm"
                                    style={{ height: `${incomeHeight}%` }}
                                    title={`수입: $${report.income.toLocaleString()}`}
                                ></div>
                                <div
                                    className="w-1/2 bg-red-500/70 rounded-t-sm"
                                    style={{ height: `${expenseHeight}%` }}
                                    title={`비용: $${report.expenses.total.toLocaleString()}`}
                                ></div>
                            </div>
                            <span className="text-xs text-slate-400 mt-2">
                                {report.month.getMonth() + 1}월
                            </span>
                            <span className={`text-xs font-mono ${profitColor}`}>
                                {profit >= 0 ? `+$${profit.toLocaleString()}`: `-$${Math.abs(profit).toLocaleString()}`}
                            </span>
                        </div>
                    );
                })}
            </div>
             <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
                <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 bg-green-500/70 rounded-sm"></div>
                    <span className="text-slate-300">수입</span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 bg-red-500/70 rounded-sm"></div>
                    <span className="text-slate-300">비용</span>
                </div>
            </div>
        </div>
    );
};


const Financials: React.FC<FinancialsProps> = ({ player }) => {
  if (!player || player.financialHistory.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <BanknotesIcon className="h-12 w-12 text-slate-500 mb-4" />
        <h3 className="text-lg font-medium text-slate-200">재무 기록이 없습니다</h3>
        <p className="mt-1 text-sm text-slate-400">첫 달의 재무 보고서가 생성되면 이곳에서 확인할 수 있습니다.</p>
      </div>
    );
  }
  
  const history = [...player.financialHistory].reverse();

  return (
    <div className="p-4 space-y-6">
       <Chart data={player.financialHistory} />

       <div>
        <h3 className="text-lg font-semibold text-white px-2 mb-3">손익계산서 기록</h3>
         <div className="bg-slate-900/50 rounded-lg max-h-96 overflow-y-auto">
          <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800 sticky top-0">
                  <tr>
                      <th scope="col" className="px-4 py-3">월</th>
                      <th scope="col" className="px-4 py-3 text-right">수입</th>
                      <th scope="col" className="px-4 py-3 text-right">비용</th>
                      <th scope="col" className="px-4 py-3 text-right">순이익</th>
                  </tr>
              </thead>
              <tbody>
                  {history.map((report, index) => {
                      const profit = report.income - report.expenses.total;
                      return (
                          <tr key={index} className="border-b border-slate-700 hover:bg-slate-800/50">
                              <th scope="row" className="px-4 py-3 font-medium whitespace-nowrap">
                                  {`${report.month.getFullYear()}년 ${report.month.getMonth() + 1}월`}
                              </th>
                              <td className="px-4 py-3 text-right font-mono text-green-400">
                                  +${report.income.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-red-400">
                                  -${report.expenses.total.toLocaleString()}
                              </td>
                              <td className={`px-4 py-3 text-right font-mono font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {profit >= 0 ? `+$${profit.toLocaleString()}` : `-$${Math.abs(profit).toLocaleString()}`}
                              </td>
                          </tr>
                      );
                  })}
              </tbody>
          </table>
          </div>
       </div>
    </div>
  );
};

export default Financials;
