
import type { Airport } from '../types';

export const AIRPORTS: Airport[] = [
  // Asia
  { id: 'ICN', name: '인천국제공항', city: '서울', country: '대한민국', region: 'Asia', lat: 37.4692, lon: 126.4505, size: 5 },
  { id: 'HND', name: '도쿄 하네다 공항', city: '도쿄', country: '일본', region: 'Asia', lat: 35.5533, lon: 139.7811, size: 5 },
  { id: 'PEK', name: '베이징 수도 국제공항', city: '베이징', country: '중국', region: 'Asia', lat: 40.0799, lon: 116.5845, size: 5 },
  { id: 'PVG', name: '상하이 푸둥 국제공항', city: '상하이', country: '중국', region: 'Asia', lat: 31.1434, lon: 121.8052, size: 5 },
  { id: 'HKG', name: '홍콩 국제공항', city: '홍콩', country: '홍콩', region: 'Asia', lat: 22.3089, lon: 113.9144, size: 5 },
  { id: 'SIN', name: '싱가포르 창이 공항', city: '싱가포르', country: '싱가포르', region: 'Asia', lat: 1.3592, lon: 103.9894, size: 5 },
  { id: 'TPE', name: '타오위안 국제공항', city: '타이베이', country: '대만', region: 'Asia', lat: 25.0777, lon: 121.2328, size: 4 },
  { id: 'BKK', name: '수완나품 국제공항', city: '방콕', country: '태국', region: 'Asia', lat: 13.6811, lon: 100.7475, size: 4 },
  { id: 'KUL', name: '쿠알라룸푸르 국제공항', city: '쿠알라룸푸르', country: '말레이시아', region: 'Asia', lat: 2.7456, lon: 101.7099, size: 4 },
  { id: 'DEL', name: '인디라 간디 국제공항', city: '델리', country: '인도', region: 'Asia', lat: 28.5665, lon: 77.1031, size: 4 },
  { id: 'BOM', name: '차트라파티 시바지 국제공항', city: '뭄바이', country: '인도', region: 'Asia', lat: 19.0887, lon: 72.8679, size: 3 },
  { id: 'MNL', name: '니노이 아키노 국제공항', city: '마닐라', country: '필리핀', region: 'Asia', lat: 14.5086, lon: 121.0194, size: 3 },
  
  // Middle East
  { id: 'DXB', name: '두바이 국제공항', city: '두바이', country: '아랍에미리트', region: 'Asia', lat: 25.2528, lon: 55.3644, size: 5 },
  { id: 'DOH', name: '하마드 국제공항', city: '도하', country: '카타르', region: 'Asia', lat: 25.2611, lon: 51.6142, size: 4 },

  // Europe
  { id: 'LHR', name: '런던 히드로 공항', city: '런던', country: '영국', region: 'Europe', lat: 51.4706, lon: -0.4619, size: 5 },
  { id: 'CDG', name: '파리 샤를 드골 공항', city: '파리', country: '프랑스', region: 'Europe', lat: 49.0097, lon: 2.5479, size: 5 },
  { id: 'FRA', name: '프랑크푸르트 공항', city: '프랑크푸르트', country: '독일', region: 'Europe', lat: 50.0333, lon: 8.5706, size: 5 },
  { id: 'AMS', name: '암스테르담 스키폴 공항', city: '암스테르담', country: '네덜란드', region: 'Europe', lat: 52.3086, lon: 4.7639, size: 5 },
  { id: 'IST', name: '이스탄불 공항', city: '이스탄불', country: '터키', region: 'Europe', lat: 41.2753, lon: 28.7519, size: 5 },
  { id: 'MAD', name: '마드리드 바라하스 공항', city: '마드리드', country: '스페인', region: 'Europe', lat: 40.4936, lon: -3.5668, size: 4 },
  { id: 'MUC', name: '뮌헨 공항', city: '뮌헨', country: '독일', region: 'Europe', lat: 48.3538, lon: 11.7861, size: 4 },
  { id: 'FCO', name: '레오나르도 다 빈치 국제공항', city: '로마', country: '이탈리아', region: 'Europe', lat: 41.8045, lon: 12.2508, size: 4 },
  { id: 'ZRH', name: '취리히 공항', city: '취리히', country: '스위스', region: 'Europe', lat: 47.4647, lon: 8.5492, size: 3 },
  { id: 'VIE', name: '비엔나 국제공항', city: '비엔나', country: '오스트리아', region: 'Europe', lat: 48.1103, lon: 16.5697, size: 3 },
  { id: 'DUB', name: '더블린 공항', city: '더블린', country: '아일랜드', region: 'Europe', lat: 53.4214, lon: -6.2701, size: 3 },
  { id: 'OSL', name: '오슬로 가르데르모엔 공항', city: '오슬로', country: '노르웨이', region: 'Europe', lat: 60.1939, lon: 11.1004, size: 3 },
  { id: 'ATH', name: '아테네 국제공항', city: '아테네', country: '그리스', region: 'Europe', lat: 37.9364, lon: 23.9444, size: 2 },
  
  // North America
  { id: 'ATL', name: '하츠필드-잭슨 애틀랜타 국제공항', city: '애틀랜타', country: '미국', region: 'North America', lat: 33.6367, lon: -84.4281, size: 5 },
  { id: 'LAX', name: '로스앤젤레스 국제공항', city: '로스앤젤레스', country: '미국', region: 'North America', lat: 33.9425, lon: -118.4081, size: 5 },
  { id: 'ORD', name: '오헤어 국제공항', city: '시카고', country: '미국', region: 'North America', lat: 41.9786, lon: -87.9048, size: 5 },
  { id: 'DFW', name: '댈러스 포트워스 국제공항', city: '댈러스', country: '미국', region: 'North America', lat: 32.8968, lon: -97.0380, size: 5 },
  { id: 'DEN', name: '덴버 국제공항', city: '덴버', country: '미국', region: 'North America', lat: 39.8617, lon: -104.6731, size: 4 },
  { id: 'JFK', name: '존 F. 케네디 국제공항', city: '뉴욕', country: '미국', region: 'North America', lat: 40.6398, lon: -73.7789, size: 5 },
  { id: 'SFO', name: '샌프란시스코 국제공항', city: '샌프란시스코', country: '미국', region: 'North America', lat: 37.6189, lon: -122.3750, size: 4 },
  { id: 'YYZ', name: '토론토 피어슨 국제공항', city: '토론토', country: '캐나다', region: 'North America', lat: 43.6772, lon: -79.6306, size: 4 },
  { id: 'YVR', name: '밴쿠버 국제공항', city: '밴쿠버', country: '캐나다', region: 'North America', lat: 49.1939, lon: -123.1844, size: 3 },
  { id: 'MEX', name: '멕시코시티 국제공항', city: '멕시코시티', country: '멕시코', region: 'North America', lat: 19.4363, lon: -99.0721, size: 3 },

  // South America
  { id: 'GRU', name: '상파울루 과룰류스 국제공항', city: '상파울루', country: '브라질', region: 'South America', lat: -23.4356, lon: -46.4731, size: 4 },
  { id: 'BOG', name: '엘도라도 국제공항', city: '보고타', country: '콜롬비아', region: 'South America', lat: 4.7016, lon: -74.1469, size: 3 },
  { id: 'SCL', name: '코모도로 아르투로 메리노 베니테스 국제공항', city: '산티아고', country: '칠레', region: 'South America', lat: -33.3930, lon: -70.7858, size: 2 },
  { id: 'EZE', name: '미니스토로 피스타리니 국제공항', city: '부에노스아이레스', country: '아르헨티나', region: 'South America', lat: -34.8222, lon: -58.5358, size: 2 },
  { id: 'LIM', name: '호르헤 차베스 국제공항', city: '리마', country: '페루', region: 'South America', lat: -12.0219, lon: -77.1143, size: 2 },
  
  // Oceania
  { id: 'SYD', name: '시드니 킹스포드 스미스 공항', city: '시드니', country: '호주', region: 'Oceania', lat: -33.9461, lon: 151.1772, size: 4 },
  { id: 'MEL', name: '멜버른 공항', city: '멜버른', country: '호주', region: 'Oceania', lat: -37.6733, lon: 144.8433, size: 3 },
  { id: 'AKL', name: '오클랜드 공항', city: '오클랜드', country: '뉴질랜드', region: 'Oceania', lat: -37.0082, lon: 174.7917, size: 2 },
  { id: 'PER', name: '퍼스 공항', city: '퍼스', country: '호주', region: 'Oceania', lat: -31.9403, lon: 115.9669, size: 2 },
  
  // Africa
  { id: 'JNB', name: 'O. R. 탐보 국제공항', city: '요하네스버그', country: '남아프리카 공화국', region: 'Africa', lat: -26.1392, lon: 28.2461, size: 3 },
  { id: 'CAI', name: '카이로 국제공항', city: '카이로', country: '이집트', region: 'Africa', lat: 30.1219, lon: 31.4056, size: 3 },
  { id: 'ADD', name: '볼레 국제공항', city: '아디스아바바', country: '에티오피아', region: 'Africa', lat: 8.9779, lon: 38.7993, size: 3 },
  { id: 'LOS', name: '무르탈라 모하메드 국제공항', city: '라오스', country: '나이지리아', region: 'Africa', lat: 6.5774, lon: 3.3211, size: 2 },
  { id: 'NBO', name: '조모 케냐타 국제공항', city: '나이로비', country: '케냐', region: 'Africa', lat: -1.3192, lon: 36.9278, size: 2 },
];
