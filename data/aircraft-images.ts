const svgToBase64DataUrl = (svg: string): string => {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const a320_svg = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100 100) rotate(90)">
    <path d="M 0,-80 L 15,-60 L 15,30 L 80,55 L 85,60 L 15,60 L 15,70 L 5,80 L -5,80 L -15,70 L -15,60 L -85,60 L -80,55 L -15,30 L -15,-60 Z" fill="#D1D5DB" />
    <path d="M 0,-70 L 0,65" stroke="#9CA3AF" stroke-width="8" stroke-linecap="round"/>
    <path d="M 15,60 L 30,80 L -30,80 L -15,60 Z" fill="#D1D5DB" />
    <path d="M 0,65 L 0,80" stroke="#9CA3AF" stroke-width="6" />
    <rect x="-11" y="-55" width="22" height="15" fill="#4B5563" />
  </g>
</svg>
`;

const b737_svg = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100 100) rotate(90)">
    <path d="M 0,-85 L 12,-65 L 12,30 L 75,55 L 80,60 L 12,55 L 12,70 L 8,80 L -8,80 L -12,70 L -12,55 L -80,60 L -75,55 L -12,30 L -12,-65 Z" fill="#D1D5DB" />
    <path d="M 0,-75 L 0,65" stroke="#9CA3AF" stroke-width="7" stroke-linecap="round"/>
    <path d="M 0,60 C -10,60 -15,75 0,85 C 15,75 10,60 0,60 Z" fill="#D1D5DB" />
    <path d="M 0,65 L 0,85" stroke="#9CA3AF" stroke-width="6" />
    <rect x="-10" y="-50" width="20" height="15" fill="#4B5563" />
  </g>
</svg>
`;

const atr72_svg = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100 100) rotate(90)">
    <path d="M 0,-75 L 10,-60 L 10,40 L 60,45 L 65,50 L 10,50 L 10,65 L 5,75 L -5,75 L -10,65 L -10,50 L -65,50 L -60,45 L -10,40 L -10,-60 Z" fill="#D1D5DB"/>
    <path d="M 0,-65 L 0,60" stroke="#9CA3AF" stroke-width="6" stroke-linecap="round"/>
    <path d="M 10,65 L 20,75 L -20,75 L -10,65 Z" fill="#D1D5DB"/>
    <path d="M 0,60 L 0,75" stroke="#9CA3AF" stroke-width="5"/>
    <rect x="-8" y="-40" width="16" height="10" fill="#4B5563"/>
    <rect x="25" y="43" width="10" height="5" fill="#9CA3AF"/>
    <rect x="-35" y="43" width="10" height="5" fill="#9CA3AF"/>
  </g>
</svg>
`;

const e190_svg = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100 100) rotate(90)">
    <path d="M 0,-80 L 12,-65 L 12,35 L 70,55 L 75,60 L 12,58 L 12,70 L 6,80 L -6,80 L -12,70 L -12,58 L -75,60 L -70,55 L -12,35 L -12,-65 Z" fill="#D1D5DB"/>
    <path d="M 0,-70 L 0,68" stroke="#9CA3AF" stroke-width="7" stroke-linecap="round"/>
    <path d="M 10,65 L 25,80 L -25,80 L -10,65 Z" fill="#D1D5DB"/>
    <path d="M 0,68 L 0,80" stroke="#9CA3AF" stroke-width="5"/>
    <rect x="-9" y="-48" width="18" height="13" fill="#4B5563"/>
  </g>
</svg>
`;

const b787_svg = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100 100) rotate(90)">
    <path d="M 0,-90 L 15,-70 L 15,40 L 85,75 L 95,70 L 15,50 L 15,75 L 8,85 L -8,85 L -15,75 L -15,50 L -95,70 L -85,75 L -15,40 L -15,-70 Z" fill="#D1D5DB"/>
    <path d="M 0,-80 L 0,70" stroke="#9CA3AF" stroke-width="9" stroke-linecap="round"/>
    <path d="M 0,70 L 25,88 L -25,88 Z" fill="#D1D5DB"/>
    <path d="M 0,70 L 0,88" stroke="#9CA3AF" stroke-width="7"/>
    <rect x="-12" y="-55" width="24" height="18" fill="#4B5563"/>
  </g>
</svg>
`;

const a350_svg = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100 100) rotate(90)">
    <path d="M 0,-92 L 16,-72 L 16,42 L 88,80 L 98,75 L 16,52 L 16,78 L 9,88 L -9,88 L -16,78 L -16,52 L -98,75 L -88,80 L -16,42 L -16,-72 Z" fill="#D1D5DB"/>
    <path d="M 0,-82 L 0,73" stroke="#9CA3AF" stroke-width="10" stroke-linecap="round"/>
    <path d="M 0,73 L 30,90 L -30,90 Z" fill="#D1D5DB"/>
    <path d="M 0,73 L 0,90" stroke="#9CA3AF" stroke-width="8"/>
    <rect x="-13" y="-60" width="26" height="20" fill="#4B5563"/>
  </g>
</svg>
`;

const b777_svg = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100 100) rotate(90)">
    <path d="M 0,-95 L 14,-75 L 14,45 L 90,80 L 98,78 L 14,55 L 14,80 L 7,90 L -7,90 L -14,80 L -14,55 L -98,78 L -90,80 L -14,45 L -14,-75 Z" fill="#D1D5DB"/>
    <path d="M 0,-85 L 0,75" stroke="#9CA3AF" stroke-width="9" stroke-linecap="round"/>
    <path d="M 0,75 L 28,92 L -28,92 Z" fill="#D1D5DB"/>
    <path d="M 0,75 L 0,92" stroke="#9CA3AF" stroke-width="7"/>
    <rect x="-12" y="-62" width="24" height="18" fill="#4B5563"/>
  </g>
</svg>
`;

const a380_svg = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(100 100) rotate(90)">
    <path d="M 0,-88 L 20,-65 L 20,50 L 95,85 L 100,80 L 20,60 L 20,80 L 10,92 L -10,92 L -20,80 L -20,60 L -100,80 L -95,85 L -20,50 L -20,-65 Z" fill="#D1D5DB"/>
    <path d="M 0,-78 L 0,75" stroke="#9CA3AF" stroke-width="14" stroke-linecap="round"/>
    <path d="M 0,75 L 35,95 L -35,95 Z" fill="#D1D5DB"/>
    <path d="M 0,75 L 0,95" stroke="#9CA3AF" stroke-width="10"/>
    <rect x="-15" y="-60" width="30" height="22" fill="#4B5563"/>
    <rect x="35" y="70" width="12" height="6" fill="#9CA3AF"/>
    <rect x="-47" y="70" width="12" height="6" fill="#9CA3AF"/>
  </g>
</svg>
`;

export const AIRCRAFT_IMAGES = {
    A320: svgToBase64DataUrl(a320_svg),
    B737: svgToBase64DataUrl(b737_svg),
    ATR72: svgToBase64DataUrl(atr72_svg),
    E190: svgToBase64DataUrl(e190_svg),
    B787: svgToBase64DataUrl(b787_svg),
    A350: svgToBase64DataUrl(a350_svg),
    B777: svgToBase64DataUrl(b777_svg),
    A380: svgToBase64DataUrl(a380_svg),
};
