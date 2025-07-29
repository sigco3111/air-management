



import React, { useState, useEffect, useRef, useMemo } from 'react';
import { geoMercator, geoPath, select, zoom, zoomIdentity } from 'd3';
import { feature } from 'topojson-client';
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import type { Tooltip, Airport, Route, Competitor } from '../types';

const WORLD_ATLAS_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface WorldMapProps {
  onCountryClick: (countryId: string | null) => void;
  selectedCountryCode: string | null;
  setTooltip: React.Dispatch<React.SetStateAction<Tooltip>>;
  airports: Airport[];
  routeEndpoints: string[];
  onAirportClick: (airportId: string) => void;
  routes: Route[];
  competitors: Competitor[];
}

const WorldMap: React.FC<WorldMapProps> = ({ 
  onCountryClick, 
  selectedCountryCode, 
  setTooltip,
  airports,
  routeEndpoints,
  onAirportClick,
  routes,
  competitors
}) => {
  const [geographies, setGeographies] = useState<Feature<Geometry, GeoJsonProperties>[]>([]);
  const [transform, setTransform] = useState(() => zoomIdentity);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const width = 800;
  const height = 600;

  useEffect(() => {
    fetch(WORLD_ATLAS_URL)
      .then(response => response.json())
      .then(worldData => {
        const countries = feature(worldData, worldData.objects.countries) as unknown as FeatureCollection;
        setGeographies(countries.features);
      }).catch(err => console.error("Error fetching world atlas data:", err));
  }, []);

  const projection = useMemo(() => 
    geoMercator().scale(130).translate([width / 2, height / 1.5])
  , []);
  
  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 12])
      .translateExtent([[0,0], [width, height]])
      .on('zoom', (event) => {
        setTransform(event.transform);
      });

    svg.call(zoomBehavior);
    // Set initial zoom to fit Europe
    const initialTransform = zoomIdentity.translate(width / 4, height / 4).scale(1.5);
    svg.call(zoomBehavior.transform, initialTransform);

    return () => {
      svg.on('.zoom', null); // Clean up zoom listener
    };
  }, [width, height]);
  
  const handleCountryMouseMove = (event: React.MouseEvent<SVGPathElement, MouseEvent>, geo: Feature) => {
    const countryName = geo.properties?.name || '알 수 없음';
    setTooltip({
      show: true,
      x: event.clientX + 15,
      y: event.clientY,
      content: countryName
    });
  };
  
  const handleAirportMouseMove = (event: React.MouseEvent<SVGCircleElement, MouseEvent>, airport: Airport) => {
    setTooltip({
        show: true,
        x: event.clientX + 15,
        y: event.clientY,
        content: `${airport.name} (${airport.id})`
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  return (
    <div className="w-full h-full bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden flex items-center justify-center">
        <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <g transform={transform.toString()}>
            {geographies.map((geo) => {
                const countryId = geo.id;
                const isSelected = selectedCountryCode !== null && countryId !== undefined && String(countryId) === selectedCountryCode;
                
                return (
                <path
                    key={geo.properties?.name + String(geo.id)}
                    d={pathGenerator(geo) || ''}
                    className={`
                    stroke-slate-900 stroke-[0.5] transition-colors duration-200
                    ${isSelected ? 'fill-cyan-500' : 'fill-slate-700 hover:fill-slate-600'}
                    `}
                    onClick={() => onCountryClick(countryId ? String(countryId) : null)}
                    onMouseMove={(e) => handleCountryMouseMove(e, geo)}
                    onMouseLeave={handleMouseLeave}
                />
                );
            })}
            
            {/* Render competitor routes first */}
            {competitors.map(comp =>
              comp.routes.map(route => {
                const origin = airports.find(a => a.id === route.origin);
                const destination = airports.find(a => a.id === route.destination);
                if (!origin || !destination) return null;
                const routeLine = {
                  type: "LineString" as const,
                  coordinates: [[origin.lon, origin.lat], [destination.lon, destination.lat]]
                };
                return (
                  <path
                    key={route.id}
                    d={pathGenerator(routeLine) || ''}
                    className="fill-none"
                    stroke={comp.color}
                    strokeOpacity={0.6}
                    strokeWidth={1.5 / transform.k}
                    strokeDasharray={`4 ${2 / transform.k}`}
                  />
                );
              })
            )}

            {/* Render player routes on top */}
            {routes.map(route => {
                const origin = airports.find(a => a.id === route.origin);
                const destination = airports.find(a => a.id === route.destination);

                if (!origin || !destination) return null;

                const routeLine = {
                    type: "LineString" as const,
                    coordinates: [
                        [origin.lon, origin.lat],
                        [destination.lon, destination.lat]
                    ]
                };
                
                return (
                    <path
                        key={route.id}
                        d={pathGenerator(routeLine) || ''}
                        className="fill-none stroke-cyan-400/60"
                        strokeWidth={1.5 / transform.k}
                        strokeDasharray={`4 ${2 / transform.k}`}
                    />
                );
            })}
            
             {airports.map(airport => {
              const coords = projection([airport.lon, airport.lat]);
              if (!coords) return null;
              
              const isSelected = routeEndpoints.includes(airport.id);
              const radius = Math.max(2.5, 5 / transform.k);

              return (
                <circle
                  key={airport.id}
                  cx={coords[0]}
                  cy={coords[1]}
                  r={radius}
                  strokeWidth={0.5 / transform.k}
                  className={`
                    stroke-slate-900 cursor-pointer transition-colors duration-200
                    ${isSelected ? 'fill-cyan-400' : 'fill-white/70 hover:fill-white'}
                  `}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent country click
                    onAirportClick(airport.id);
                  }}
                  onMouseMove={(e) => handleAirportMouseMove(e, airport)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </g>
        </svg>
    </div>
  );
};

export default WorldMap;