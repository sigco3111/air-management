

# 에어매니지먼트: 게임 개발 계획서

이 문서는 "에어매니지먼트" 시뮬레이션 게임 개발을 위한 단계별 로드맵입니다.

## Phase 1: 기본 게임플레이 기반 구축

- [x] **게임 시간 시스템 구현**
  - [x] 게임 내 시간 흐름 (일, 월, 년) 구현
  - [x] 시간 정지, 재생, 배속 기능 UI 추가

- [x] **플레이어 회사 설정**
  - [x] 게임 시작 시 플레이어 회사 이름, 로고, 초기 자본 설정 기능
  - [x] 플레이어 재무 정보 (현금, 자산, 부채) 모델링

- [x] **항공기 시스템**
  - [x] 기본 항공기 모델 데이터 구조 정의 (e.g., 보잉 747, 에어버스 A320)
    - 속성: 이름, 가격, 좌석 수, 항속 거리, 연료 효율, 유지비
  - [x] 항공기 구매/판매 화면 구현
  - [x] **보유 항공기 관리 화면:** 항공기 목록, 상태, 기본 정보 확인

- [x] **공항 및 노선 시스템**
  - [x] **공항 데이터 추가 및 지도에 시각화**
  - [x] **지도에서 공항을 선택하여 노선 생성하는 기본 UI 구현**
  - [x] **노선(Route) 개설 기능 구현 (거리 계산 포함)**
  - [x] **개설 노선 관리 화면: 기본 목록 및 정보 표시**
  - [x] **항공기를 노선에 배정하는 기능**
  - [x] **허브 공항 시스템 구현**
  - [x] 주요 도시/공항 데이터 확장 (현재 지도 데이터 활용)

- [x] **수익 및 비용 모델링**
  - [x] **노선 운영에 따른 수익 계산 로직 (승객 수 x 티켓 가격)**
  - [x] **주기적인 비용 처리 로직**
    - [x] 항공기 유지비
    - [x] 공항 이용료
    - [x] 직원 급여 (추상화)
    - [x] 연료비
  - [x] **파산 및 게임 오버 조건 구현**

## Phase 2: UI/UX 고도화 및 상호작용 개선

- [x] **대시보드 화면 개편**
  - [x] **플레이어 회사 정보 요약 대시보드 구현 및 기본 탭으로 설정**
  - [x] 총 자산, 월간 수익/비용, 보유 항공기 수 등 핵심 지표 표시

- [x] **승객 만족도 시스템**
  - [x] **티켓 가격 설정 기능 추가 (노선별)**
  - [x] **항공기 노후화에 따른 만족도 변화**
  - [x] **티켓 가격에 따른 만족도 변화**
  - [x] **만족도가 노선 수요(승객 수)에 영향을 미치도록 구현**
  - [x] 서비스 품질, 정시성 등 추가 요소 도입

- [x] **관리 화면 추가**
  - [x] **개설 노선 관리 화면:** 노선 목록, 수익성, 탑승률, 시장 점유율 등 상세 정보 표시
  - [x] **재무제표 화면: 월간 손익 기록 및 차트 시각화**

- [x] **지도 상호작용 강화**
  - [x] **지도 위에 개설된 노선을 시각적으로 표시 (선으로 연결)**
  - [x] **공항/도시 클릭 시 상세 정보 팝업 (수요, 경쟁 현황 등)**
  - [x] 노선 개설을 지도 위에서 직관적으로 할 수 있도록 UI 개선 (e.g., 두 도시 클릭)

- [x] **게임 이벤트 및 알림 시스템**
  - [x] **중요한 게임 내 이벤트 (e.g., 유가 변동) 구현 및 게임 로직에 적용**
  - [x] **이벤트 로그(기록) UI 구현**
  - [x] 이벤트 발생 시 팝업 알림 기능

## Phase 3: AI 경쟁 및 동적 시장 환경

- [x] **AI 경쟁사 구현**
  - [x] 1~3개의 AI 항공사 추가
  - [x] AI의 기본적 노선 확장 로직 구현 (월별)
  - [x] AI의 의사결정 로직 고도화 (항공기 구매, 재무 관리)
  - [x] AI가 플레이어의 행동에 반응하도록 설계 (경쟁 노선 개설)

- [x] **시장 수요 모델링**
  - [x] **각 노선별 잠재적 항공 수요 계산 (단순 모델)**
  - [x] **경쟁 노선에 따른 수요 분배 로직 (티켓 가격, 만족도 기반)**
  - [x] 도시 인구, 경제 수준 등 심화된 수요 모델 도입 (공항 규모 기반)

- [x] **동적 이벤트 시스템 확장**
  - [x] 올림픽 등 특정 지역에 영향을 주는 글로벌 이벤트 구현
  - [x] 이벤트가 특정 공항의 항공 수요에 직접 영향을 미치도록 로직 수정
  - [x] 무작위 이벤트 추가 (e.g., 자연재해로 인한 공항 폐쇄, 파업)

## Phase 4: 심화 콘텐츠 및 폴리싱

- [x] **연구 개발(R&D) 시스템**
  - [x] 신규 항공기 기술, 연료 효율 개선, 서비스 품질 향상 등 연구 기능
  - [x] 연구에 시간과 비용이 소모되도록 구현

- [x] **마케팅 및 광고**
  - [x] 회사 인지도 및 노선별 수요를 높이기 위한 광고 캠페인 기능

- [x] **동맹 및 코드셰어**
  - [x] 다른 항공사(AI)와 동맹을 맺어 노선을 공유하는 기능

- [ ] **그래픽 개선**
  - [x] UI 디자인 통일성 및 시각적 완성도 향상
  - [x] 연도별 항공기 아이콘 또는 이미지 추가

- [x] **게임 저장/불러오기 기능**
  - [x] 현재 게임 상태를 저장하고 나중에 이어할 수 있는 기능 구현

- [x] **도움말**
  - [x] 신규 플레이어를 위한 게임 방법 안내