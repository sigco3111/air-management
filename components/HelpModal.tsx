
import React, { useState } from 'react';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import PlaneIcon from './icons/PlaneIcon';
import RouteIcon from './icons/RouteIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import GlobeIcon from './icons/GlobeIcon';
import PlayIcon from './icons/PlayIcon';
import DashboardIcon from './icons/DashboardIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import SaveIcon from './icons/SaveIcon';


interface HelpModalProps {
  onClose: () => void;
}

const tutorialSteps = [
    {
        icon: <PlaneIcon className="w-10 h-10 text-cyan-400" />,
        title: "에어매니지먼트에 오신 것을 환영합니다!",
        content: "당신은 새로운 항공사의 CEO입니다. 당신의 목표는 경쟁에서 승리하고 세계 최고의 항공사를 만드는 것입니다. 이 가이드가 첫걸음을 도와드릴 것입니다.",
    },
    {
        icon: <GlobeIcon className="w-10 h-10 text-cyan-400" />,
        title: "지도 탐색",
        content: "게임의 중심은 세계 지도입니다. 마우스 휠로 확대/축소하고, 드래그하여 지도를 이동할 수 있습니다. 국가나 공항을 클릭하면 상세 정보를 볼 수 있습니다.",
    },
    {
        icon: <PlaneIcon className="w-10 h-10 text-cyan-400" />,
        title: "첫 항공기 구매",
        content: "항공기를 구매하려면 우측 패널의 '항공기 시장' 탭(비행기 아이콘)으로 이동하세요. 예산에 맞는 항공기를 선택하여 첫 비행기를 구매해보세요.",
    },
    {
        icon: <RouteIcon className="w-10 h-10 text-cyan-400" />,
        title: "첫 노선 개설",
        content: "지도에서 두 개의 공항을 차례로 클릭하여 노선을 만들 수 있습니다. 첫 번째 공항을 클릭하면 상세 정보 창이 나타나고, '여기서 노선 개설' 버튼을 누른 후 두 번째 공항을 클릭하세요.",
    },
    {
        icon: <ClipboardListIcon className="w-10 h-10 text-cyan-400" />,
        title: "항공기 배정",
        content: "이제 '노선 관리' 탭으로 이동하여 방금 만든 노선을 찾으세요. '항공기 배정' 버튼을 눌러 구매한 항공기를 이 노선에 투입하면 수익 창출이 시작됩니다.",
    },
    {
        icon: <PlayIcon className="w-10 h-10 text-cyan-400" />,
        title: "시간 관리",
        content: "화면 하단의 시간 조절 버튼으로 게임 속도를 제어할 수 있습니다. 게임을 진행시켜 시간이 흐르면 월간 재무 보고서가 나타나고 수익과 비용이 정산됩니다.",
    },
    {
        icon: <SaveIcon className="w-10 h-10 text-cyan-400" />,
        title: "저장 및 이어하기",
        content: "게임 진행은 하단의 '저장하기' 버튼으로 언제든 수동 저장할 수 있습니다. 게임을 다시 켜면, 시작 화면의 '이어하기'로 마지막 지점에서 계속할 수 있습니다. 새 게임은 페이지 새로고침 후 시작할 수 있습니다.",
    },
    {
        icon: <DashboardIcon className="w-10 h-10 text-cyan-400" />,
        title: "핵심 지표 확인",
        content: "'대시보드' 탭에서 승객 만족도, 브랜드 인지도, 재무 상태 등 회사의 핵심 지표를 항상 주시하세요. 이 지표들이 당신의 성공을 좌우합니다.",
    },
    {
        icon: <LightbulbIcon className="w-10 h-10 text-cyan-400" />,
        title: "성장을 위한 전략",
        content: "이제 기본을 배웠습니다! '연구개발', '마케팅', '동맹' 탭을 탐색하여 회사를 성장시키고 경쟁에서 앞서나가세요. 행운을 빕니다, CEO님!",
    },
];

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = tutorialSteps.length;
  const stepData = tutorialSteps[currentStep];

  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] modal-content-animation ring-1 ring-white/10">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <QuestionMarkCircleIcon className="w-8 h-8 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold text-white">게임 도움말</h2>
              <p className="text-sm text-slate-400 mt-1">기본적인 게임 방법을 안내합니다.</p>
            </div>
          </div>
           <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="닫기"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 text-center flex flex-col items-center justify-center">
            <div className="mb-6">{stepData.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-4">{stepData.title}</h3>
            <p className="text-slate-300 leading-relaxed">{stepData.content}</p>
        </div>

        <div className="p-4 bg-slate-900/50 rounded-b-xl flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors"
          >
            튜토리얼 닫기
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-mono text-slate-400">{currentStep + 1} / {totalSteps}</span>
            <div className="flex items-center space-x-2">
                 <button
                    onClick={goToPrevStep}
                    disabled={currentStep === 0}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    이전
                </button>
                {currentStep === totalSteps - 1 ? (
                     <button
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-bold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
                    >
                        완료
                    </button>
                ) : (
                    <button
                        onClick={goToNextStep}
                        className="px-6 py-2 text-sm font-bold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
                    >
                        다음
                    </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
