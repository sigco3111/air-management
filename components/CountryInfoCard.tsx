
import React from 'react';
import type { Country, Currency } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface CountryInfoCardProps {
  country: Country | null;
  isLoading: boolean;
}

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-slate-400">{label}</dt>
    <dd className="mt-1 text-sm text-slate-200 sm:mt-0 sm:col-span-2">{value}</dd>
  </div>
);

const CountryInfoCard: React.FC<CountryInfoCardProps> = ({ country, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="text-lg font-medium text-slate-200">국가를 선택하세요</h3>
        <p className="mt-1 text-sm text-slate-400">지도에서 국가를 클릭하여 상세 정보를 확인하세요.</p>
      </div>
    );
  }

  const currencies = (Object.values(country.currencies || {}) as Currency[]).map(c => `${c.name} (${c.symbol})`).join(', ');
  const languages = Object.values(country.languages || {}).join(', ');
  
  const countryName = country.translations?.kor?.common || country.name.common;
  const officialName = country.translations?.kor?.official || country.name.official;

  return (
    <div className="h-full">
      <div className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{countryName}</h2>
              <p className="text-sm text-slate-400">{officialName}</p>
            </div>
            <img src={country.flags.svg} alt={`${countryName} 국기`} className="w-16 h-auto object-contain rounded-sm shadow-md" />
          </div>
        </div>
        <div className="mt-6 border-t border-slate-700 flex-grow overflow-y-auto pr-2">
          <dl className="divide-y divide-slate-700">
            <InfoRow label="수도" value={country.capital?.join(', ') || '정보 없음'} />
            <InfoRow label="인구" value={country.population.toLocaleString() || '정보 없음'} />
            <InfoRow label="지역" value={`${country.region} / ${country.subregion}` || '정보 없음'} />
            <InfoRow label="통화" value={currencies || '정보 없음'} />
            <InfoRow label="언어" value={languages || '정보 없음'} />
          </dl>
        </div>
      </div>
    </div>
  );
};

export default CountryInfoCard;
